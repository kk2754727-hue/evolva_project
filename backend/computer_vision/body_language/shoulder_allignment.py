import cv2
import mediapipe as mp
import math

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils

pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)



def detect_shoulder(frame):

    score = 0
    status = "NO BODY DETECTED"

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = pose.process(rgb)

    h, w, _ = frame.shape

    if results.pose_landmarks:

        mp_draw.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS
        )

        landmarks = results.pose_landmarks.landmark

        # Left Shoulder
        left = landmarks[11]

        # Right Shoulder
        right = landmarks[12]

        lx = int(left.x * w)
        ly = int(left.y * h)

        rx = int(right.x * w)
        ry = int(right.y * h)

        # Draw shoulders
        cv2.circle(frame, (lx, ly), 8, (0, 255, 0), -1)
        cv2.circle(frame, (rx, ry), 8, (0, 255, 0), -1)

        # Connect shoulders
        cv2.line(frame, (lx, ly), (rx, ry), (255, 0, 0), 3)

        # Calculate shoulder angle
        angle = math.degrees(math.atan2(ry - ly, rx - lx))
        if angle > 90:
            angle -= 180
        elif angle < -90:
            angle += 180

        # Determine posture
        tilt = abs(angle)

        if tilt <= 3:
            status = "SHOULDERS LEVEL"
        elif angle > 3:
            status = "LEANING LEFT"
        else:
            status = "LEANING RIGHT"

# Score out of 100
        score = max(0, min(100, int(100 - tilt * 8)))

        # Display results
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
            f"Angle : {angle:.2f} deg",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 0),
            2
        )

        cv2.putText(
            frame,
            f"Shoulder Score : {score}",
            (20, 120),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 255),
            2
        )

    return frame, score, status