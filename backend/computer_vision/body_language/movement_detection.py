import cv2
import mediapipe as mp
import math

# ----------------------------
# MediaPipe Pose Initialization
# ----------------------------
mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils

pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)



# Previous shoulder center
prev_center = None



def detect_movement(frame):
    
    movement = "no body detected"

    global prev_center
    movement_score = 0

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

        # Left Shoulder
        left = lm[11]

        # Right Shoulder
        right = lm[12]

        lx = int(left.x * w)
        ly = int(left.y * h)

        rx = int(right.x * w)
        ry = int(right.y * h)

        # Shoulder Center
        cx = (lx + rx) // 2
        cy = (ly + ry) // 2

        cv2.circle(frame, (cx, cy), 8, (0, 0, 255), -1)

        # -----------------------------
        # Movement Calculation
        # -----------------------------
        if prev_center is not None:

            distance = math.sqrt(
                (cx - prev_center[0]) ** 2 +
                (cy - prev_center[1]) ** 2
            )

            if distance < 5:
                movement = "VERY STABLE"
                movement_score = 100

            elif distance < 10:
                movement = "STABLE"
                movement_score = 90

            elif distance < 20:
                movement = "SLIGHT MOVEMENT"
                movement_score = 75

            elif distance < 35:
                movement = "HIGH MOVEMENT"
                movement_score = 55

            else:
                movement = "EXCESSIVE MOVEMENT"
                movement_score = 30

            cv2.putText(
                frame,
                movement,
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0,255,0),
                2
            )

            cv2.putText(
                frame,
                f"Movement Score : {movement_score}",
                (20,80),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (255,255,0),
                2
            )

            cv2.putText(
                frame,
                f"Distance : {distance:.2f}",
                (20,120),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0,255,255),
                2
            )

        prev_center = (cx, cy)

    

    return frame, movement_score,movement

