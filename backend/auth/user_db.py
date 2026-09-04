"""
Evolva SQLite user/student data store.

This module supports the functions imported by app.py:
- user profile
- resume history
- course progress
- interview history
- skill scores
- student dashboard summary

It keeps the existing users table and adds missing columns/tables
automatically when the application starts.
"""

import json
import os
import sqlite3
from datetime import datetime


DB_PATH = os.path.join(os.path.dirname(__file__), "..", "evolva_users.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _add_column_if_missing(conn, table, column, definition):
    columns = {
        row["name"]
        for row in conn.execute(f"PRAGMA table_info({table})").fetchall()
    }
    if column not in columns:
        conn.execute(
            f"ALTER TABLE {table} ADD COLUMN {column} {definition}"
        )


def init_db():
    """Create/migrate all Evolva SQLite tables."""
    with get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name     TEXT    NOT NULL,
                email         TEXT    NOT NULL UNIQUE,
                password_hash TEXT    NOT NULL,
                college       TEXT,
                year          TEXT,
                branch        TEXT,
                target_role   TEXT,
                phone         TEXT,
                created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # These columns are used by the profile endpoint in app.py.
        _add_column_if_missing(conn, "users", "bio", "TEXT")
        _add_column_if_missing(conn, "users", "linkedin", "TEXT")
        _add_column_if_missing(conn, "users", "github", "TEXT")

        conn.execute("""
            CREATE TABLE IF NOT EXISTS resume_history (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id     INTEGER NOT NULL,
                filename    TEXT,
                target_role TEXT,
                result_json TEXT NOT NULL,
                created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS course_progress (
                id                INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id           INTEGER NOT NULL,
                course_tag        TEXT NOT NULL,
                course_title      TEXT,
                status            TEXT DEFAULT 'started',
                progress_pct      REAL DEFAULT 0,
                assessment_score  REAL DEFAULT 0,
                badge_earned      TEXT DEFAULT '',
                xp_earned         INTEGER DEFAULT 0,
                updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, course_tag)
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS interview_history (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id     INTEGER NOT NULL,
                track       TEXT DEFAULT 'General',
                mode        TEXT DEFAULT 'text',
                scores_json TEXT NOT NULL,
                created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS skill_scores (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id    INTEGER NOT NULL,
                skill_name TEXT NOT NULL,
                score      REAL NOT NULL DEFAULT 0,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, skill_name)
            )
        """)

        conn.commit()


# Initialize/migrate the database when this module is imported.
init_db()


def create_user(
    full_name,
    email,
    password_hash,
    college="",
    year="",
    branch="",
    target_role="",
    phone=""
):
    with get_conn() as conn:
        cursor = conn.execute("""
            INSERT INTO users
                (full_name, email, password_hash, college, year,
                 branch, target_role, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            full_name,
            email.lower().strip(),
            password_hash,
            college,
            year,
            branch,
            target_role,
            phone,
        ))
        conn.commit()
        return cursor.lastrowid


def get_user_by_email(email):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM users WHERE email = ?",
            (email.lower().strip(),)
        ).fetchone()
    return dict(row) if row else None


def get_user_by_id(user_id):
    with get_conn() as conn:
        row = conn.execute(
            "SELECT * FROM users WHERE id = ?",
            (int(user_id),)
        ).fetchone()
    return dict(row) if row else None


def email_exists(email):
    return get_user_by_email(email) is not None


def update_user_profile(
    user_id,
    full_name=None,
    college=None,
    year=None,
    branch=None,
    target_role=None,
    phone=None,
    bio=None,
    linkedin=None,
    github=None,
):
    """Update only profile fields supplied by the frontend."""
    fields = []
    values = []

    allowed = {
        "full_name": full_name,
        "college": college,
        "year": year,
        "branch": branch,
        "target_role": target_role,
        "phone": phone,
        "bio": bio,
        "linkedin": linkedin,
        "github": github,
    }

    for column, value in allowed.items():
        if value is not None:
            fields.append(f"{column} = ?")
            values.append(value)

    if not fields:
        return False

    values.append(int(user_id))

    with get_conn() as conn:
        cursor = conn.execute(
            f"UPDATE users SET {', '.join(fields)} WHERE id = ?",
            values,
        )
        conn.commit()
        return cursor.rowcount > 0


def save_resume_result(user_id, filename, target_role, result):
    with get_conn() as conn:
        cursor = conn.execute("""
            INSERT INTO resume_history
                (user_id, filename, target_role, result_json)
            VALUES (?, ?, ?, ?)
        """, (
            int(user_id),
            filename or "",
            target_role or "",
            json.dumps(result, ensure_ascii=False),
        ))
        conn.commit()
        return cursor.lastrowid


def _decode_json(value, default=None):
    if default is None:
        default = {}
    try:
        return json.loads(value) if value else default
    except (TypeError, ValueError, json.JSONDecodeError):
        return default


def get_resume_history(user_id):
    with get_conn() as conn:
        rows = conn.execute("""
            SELECT id, filename, target_role, result_json, created_at
            FROM resume_history
            WHERE user_id = ?
            ORDER BY created_at DESC, id DESC
        """, (int(user_id),)).fetchall()

    output = []
    for row in rows:
        item = dict(row)
        result = _decode_json(item.pop("result_json"), {})
        if isinstance(result, dict):
            item.update(result)
        else:
            item["result"] = result
        output.append(item)
    return output


def get_latest_resume(user_id):
    with get_conn() as conn:
        row = conn.execute("""
            SELECT id, filename, target_role, result_json, created_at
            FROM resume_history
            WHERE user_id = ?
            ORDER BY created_at DESC, id DESC
            LIMIT 1
        """, (int(user_id),)).fetchone()

    if not row:
        return None

    item = dict(row)
    result = _decode_json(item.pop("result_json"), {})
    if isinstance(result, dict):
        item.update(result)
    else:
        item["result"] = result
    return item


def upsert_course_progress(
    user_id,
    course_tag,
    course_title="",
    status="started",
    progress_pct=0,
    assessment_score=0,
    badge_earned="",
    xp_earned=0,
):
    course_tag = (course_tag or "").strip()
    if not course_tag:
        return False

    with get_conn() as conn:
        conn.execute("""
            INSERT INTO course_progress
                (user_id, course_tag, course_title, status, progress_pct,
                 assessment_score, badge_earned, xp_earned, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, course_tag) DO UPDATE SET
                course_title = excluded.course_title,
                status = excluded.status,
                progress_pct = excluded.progress_pct,
                assessment_score = excluded.assessment_score,
                badge_earned = excluded.badge_earned,
                xp_earned = excluded.xp_earned,
                updated_at = CURRENT_TIMESTAMP
        """, (
            int(user_id),
            course_tag,
            course_title or "",
            status or "started",
            float(progress_pct or 0),
            float(assessment_score or 0),
            badge_earned or "",
            int(xp_earned or 0),
        ))
        conn.commit()
    return True


def get_course_progress(user_id):
    with get_conn() as conn:
        rows = conn.execute("""
            SELECT course_tag, course_title, status, progress_pct,
                   assessment_score, badge_earned, xp_earned,
                   created_at, updated_at
            FROM course_progress
            WHERE user_id = ?
            ORDER BY updated_at DESC, id DESC
        """, (int(user_id),)).fetchall()
    return [dict(row) for row in rows]


def get_completed_courses(user_id):
    with get_conn() as conn:
        rows = conn.execute("""
            SELECT course_tag, course_title, status, progress_pct,
                   assessment_score, badge_earned, xp_earned, updated_at
            FROM course_progress
            WHERE user_id = ?
              AND (status = 'completed' OR progress_pct >= 100)
            ORDER BY updated_at DESC, id DESC
        """, (int(user_id),)).fetchall()
    return [dict(row) for row in rows]


def save_interview_result(user_id, track="General", mode="text", scores=None):
    if scores is None:
        scores = {}

    with get_conn() as conn:
        cursor = conn.execute("""
            INSERT INTO interview_history
                (user_id, track, mode, scores_json)
            VALUES (?, ?, ?, ?)
        """, (
            int(user_id),
            track or "General",
            mode or "text",
            json.dumps(scores, ensure_ascii=False),
        ))
        conn.commit()
        return cursor.lastrowid


def get_interview_history(user_id):
    with get_conn() as conn:
        rows = conn.execute("""
            SELECT id, track, mode, scores_json, created_at
            FROM interview_history
            WHERE user_id = ?
            ORDER BY created_at DESC, id DESC
        """, (int(user_id),)).fetchall()

    output = []
    for row in rows:
        item = dict(row)
        item["scores"] = _decode_json(item.pop("scores_json"), {})
        output.append(item)
    return output


def upsert_skill_score(user_id, skill_name, score):
    skill_name = (skill_name or "").strip()
    if not skill_name:
        return False

    with get_conn() as conn:
        conn.execute("""
            INSERT INTO skill_scores
                (user_id, skill_name, score, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, skill_name) DO UPDATE SET
                score = excluded.score,
                updated_at = CURRENT_TIMESTAMP
        """, (
            int(user_id),
            skill_name,
            float(score),
        ))
        conn.commit()
    return True


def get_skill_scores(user_id):
    with get_conn() as conn:
        rows = conn.execute("""
            SELECT skill_name AS name, score, updated_at
            FROM skill_scores
            WHERE user_id = ?
            ORDER BY skill_name ASC
        """, (int(user_id),)).fetchall()
    return [dict(row) for row in rows]


def get_student_summary(user_id):
    """Return the combined profile/dashboard data expected by the frontend."""
    user = get_user_by_id(user_id)
    if not user:
        return None

    user.pop("password_hash", None)

    resumes = get_resume_history(user_id)
    latest_resume = get_latest_resume(user_id)
    courses = get_course_progress(user_id)
    completed = get_completed_courses(user_id)
    interviews = get_interview_history(user_id)
    skills = get_skill_scores(user_id)

    total_xp = sum(int(item.get("xp_earned") or 0) for item in courses)

    return {
        "user": user,
        "profile": user,
        "resume_history": resumes,
        "latest_resume": latest_resume,
        "course_progress": courses,
        "completed_courses": completed,
        "interview_history": interviews,
        "skill_scores": skills,
        "stats": {
            "resume_count": len(resumes),
            "courses_started": len(courses),
            "courses_completed": len(completed),
            "interviews_completed": len(interviews),
            "skills_tracked": len(skills),
            "total_xp": total_xp,
        },
    }
