"""
Registration and login logic.
Passwords are hashed with bcrypt — never stored in plain text.
"""

import bcrypt
from auth.user_db import create_user, get_user_by_email, email_exists, init_db

# Initialise DB on import
init_db()


def hash_password(plain_password: str) -> str:
    return bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt()).decode()


def check_password(plain_password: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed.encode())


def register_user(full_name, email, password, college="",
                  year="", branch="", target_role="", phone=""):
    """
    Returns (success: bool, message: str)
    """
    email = email.strip().lower()

    if not full_name or not email or not password:
        return False, "Name, email, and password are required."

    if len(password) < 6:
        return False, "Password must be at least 6 characters."

    if email_exists(email):
        return False, "An account with this email already exists. Please log in."

    password_hash = hash_password(password)

    try:
        create_user(
            full_name=full_name,
            email=email,
            password_hash=password_hash,
            college=college,
            year=year,
            branch=branch,
            target_role=target_role,
            phone=phone,
        )
        return True, "Account created successfully."
    except Exception as e:
        return False, f"Registration failed: {e}"


def login_user(email, password):
    """
    Returns (success: bool, message: str, user_data: dict | None)
    """
    email = email.strip().lower()

    if not email or not password:
        return False, "Email and password are required.", None

    user = get_user_by_email(email)

    if not user:
        return False, "No account found with this email. Please register first.", None

    if not check_password(password, user["password_hash"]):
        return False, "Incorrect password. Please try again.", None

    # Return safe user object (no password hash)
    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    return True, "Login successful.", safe_user