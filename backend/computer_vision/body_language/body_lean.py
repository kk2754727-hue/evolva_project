import cv2
import mediapipe as mp

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils

pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)



def detecting_body_lean(frame):

    score = 0
    status = "NO FACE"

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

        # Nose
        nose = lm[0]

        # Left Shoulder
        left_shoulder = lm[11]

        # Right Shoulder
        right_shoulder = lm[12]

        # Left Hip
        left_hip = lm[23]

        # Right Hip
        right_hip = lm[24]

        # Convert to pixels
        nose_x = int(nose.x * w)
        nose_y = int(nose.y * h)

        ls_x = int(left_shoulder.x * w)
        rs_x = int(right_shoulder.x * w)

        lh_x = int(left_hip.x * w)
        rh_x = int(right_hip.x * w)

        # Shoulder Center
        shoulder_center_x = (ls_x + rs_x) // 2

        # Hip Center
        hip_center_x = (lh_x + rh_x) // 2

        # Body Center
        body_center_x = (shoulder_center_x + hip_center_x) // 2

        # Draw landmarks
        cv2.circle(frame, (nose_x, nose_y), 8, (0, 0, 255), -1)
        cv2.circle(frame, (body_center_x, nose_y), 8, (255, 0, 0), -1)

        cv2.line(frame,
                 (nose_x, nose_y),
                 (body_center_x, nose_y),
                 (0, 255, 255),
                 2)

        difference = nose_x - body_center_x

        if abs(difference) < 20:
            status = "BODY STRAIGHT"
            score = 100

        elif difference > 20:
            status = "LEANING RIGHT"
            score = max(50, 100 - abs(difference) // 2)

        else:
            status = "LEANING LEFT"
            score = max(50, 100 - abs(difference) // 2)

        cv2.putText(
            frame,
            status,
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        cv2.putText(
            frame,
            f"Lean Score : {score}",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 0),
            2
        )

        cv2.putText(
            frame,
            f"Offset : {difference}",
            (20, 120),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 255),
            2
        )

    

    return frame,score,status


