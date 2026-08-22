import cv2
import mediapipe as mp
from collections import deque

# -----------------------------
# MediaPipe Face Mesh
# -----------------------------
mp_face_mesh = mp.solutions.face_mesh

face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Left iris landmarks
LEFT_IRIS = [474, 475, 476, 477]

# Eye corners
LEFT_EYE_LEFT = 362
LEFT_EYE_RIGHT = 263

# Store last 100 eye directions
history = deque(maxlen=100)


def detect_eye_contact(frame):

    score = 0
    direction = "NO FACE"

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = face_mesh.process(rgb)

    h, w, _ = frame.shape

    if results.multi_face_landmarks:

        landmarks = results.multi_face_landmarks[0].landmark

        # -----------------------------
        # Iris
        # -----------------------------
        iris = landmarks[474]

        iris_x = iris.x * w
        iris_y = iris.y * h

        cv2.circle(
            frame,
            (int(iris_x), int(iris_y)),
            4,
            (0,255,0),
            -1
        )

        # -----------------------------
        # Eye Corners
        # -----------------------------
        left_corner = landmarks[LEFT_EYE_LEFT]
        right_corner = landmarks[LEFT_EYE_RIGHT]

        left_x = left_corner.x * w
        right_x = right_corner.x * w

        eye_width = abs(right_x - left_x)

        if eye_width > 0:

            ratio = (iris_x - left_x) / eye_width
        

            if ratio < 0.35:
                direction = "LOOKING LEFT"

            elif ratio > 0.65:
                direction = "LOOKING RIGHT"

            else:
                direction = "LOOKING CENTER"

        # -----------------------------
        # Eye Contact Score
        # -----------------------------
        history.append(direction)

        center_count = history.count("LOOKING CENTER")
        left_count = history.count("LOOKING LEFT")
        right_count = history.count("LOOKING RIGHT")
        
        if center_count >= max(left_count, right_count):
            score = 100
        elif left_count >= max(center_count, right_count):
            score = max(60, 100 - (left_count * 2))     
        elif right_count >= max(center_count, left_count):
            score = max(60, 100 - (right_count * 2))
            
        # -----------------------------
        # Display
        # -----------------------------
        cv2.putText(
            frame,
            direction,
            (20,40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0,255,0),
            2
        )

        cv2.putText(
            frame,
            f"Eye Contact : {score}",
            (20,80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255,255,0),
            2
        )

    return frame, score, direction