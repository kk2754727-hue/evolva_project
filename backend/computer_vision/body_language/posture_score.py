import cv2
import mediapipe as mp
import math

mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils

pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)



prev_center = None

def detect_posture_score(frame):
    
    global prev_center

    posture_score = 0
    status = "NO BODY DETECTED"

    frame = cv2.flip(frame, 1)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = pose.process(rgb)

    h, w, _ = frame.shape

    if results.pose_landmarks:

        mp_draw.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

        lm = results.pose_landmarks.landmark

        # -------------------------
        # Shoulder Alignment Score
        # -------------------------

        ls = lm[11]
        rs = lm[12]

        lx = int(ls.x * w)
        ly = int(ls.y * h)

        rx = int(rs.x * w)
        ry = int(rs.y * h)

        shoulder_difference = abs(ly - ry)

        shoulder_score = max(
            0,
            100 - shoulder_difference * 3
        )

        # -------------------------
        # Body Lean Score
        # -------------------------

        nose = lm[0]

        shoulder_center = (lx + rx) // 2

        body_difference = abs(
            int(nose.x * w) - shoulder_center
        )

        body_score = max(
            0,
            100 - body_difference // 2
        )

        # -------------------------
        # Head Pose Score
        # -------------------------

        head_score = 100

        # -------------------------
        # Movement Score
        # -------------------------

        cx = shoulder_center
        cy = (ly + ry) // 2

        if prev_center is not None:

            distance = math.sqrt(
                (cx - prev_center[0])**2 +
                (cy - prev_center[1])**2
            )

            movement_score = max(
                0,
                100 - distance * 5
            )

        else:

            movement_score = 100

        prev_center = (cx, cy)

        # -------------------------
        # Final Posture Score
        # -------------------------

        posture_score = (
            shoulder_score * 0.40 +
            head_score * 0.25 +
            body_score * 0.20 +
            movement_score * 0.15
        )

        posture_score = int(posture_score)

        # -------------------------
        # Display
        # -------------------------

        cv2.putText(
            frame,
            f"Shoulder : {int(shoulder_score)}",
            (20,40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255,255,0),
            2
        )

        cv2.putText(
            frame,
            f"Body Lean : {int(body_score)}",
            (20,70),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255,255,0),
            2
        )

        cv2.putText(
            frame,
            f"Movement : {int(movement_score)}",
            (20,100),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255,255,0),
            2
        )

        cv2.putText(
            frame,
            f"Posture Score : {posture_score}",
            (20,150),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0,255,0),
            3
        )
        
    return frame, posture_score, status