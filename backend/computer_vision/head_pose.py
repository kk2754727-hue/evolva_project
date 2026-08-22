import cv2
import mediapipe as mp

# ----------------------------------
# Initialize Face Mesh
# ----------------------------------
mp_face_mesh = mp.solutions.face_mesh

face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)


def detect_head_pose(frame):

    score = 0
    status = "NO FACE"

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = face_mesh.process(rgb)

    h, w, _ = frame.shape

    if results.multi_face_landmarks:

        landmarks = results.multi_face_landmarks[0].landmark

        # -----------------------------
        # Face Landmarks
        # -----------------------------
        nose = landmarks[1]

        left_face = landmarks[234]

        right_face = landmarks[454]

        nose_x = int(nose.x * w)
        nose_y = int(nose.y * h)

        left_x = int(left_face.x * w)
        left_y = int(left_face.y * h)

        right_x = int(right_face.x * w)
        right_y = int(right_face.y * h)

        # -----------------------------
        # Draw Points
        # -----------------------------
        cv2.circle(frame, (nose_x, nose_y), 5, (0, 0, 255), -1)

        cv2.circle(frame, (left_x, left_y), 5, (255, 0, 0), -1)

        cv2.circle(frame, (right_x, right_y), 5, (255, 0, 0), -1)

        # -----------------------------
        # Head Position
        # -----------------------------
        left_distance = nose_x - left_x

        right_distance = right_x - nose_x

        difference = left_distance - right_distance

        if abs(difference) < 15:

            status = "HEAD STRAIGHT"

            score = 100

        elif difference > 15:

            status = "HEAD LEFT"

            score = max(60, 100 - abs(difference))

        else:

            status = "HEAD RIGHT"

            score = max(60, 100 - abs(difference))

        # -----------------------------
        # Display
        # -----------------------------
        cv2.putText(
            frame,
            status,
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

        cv2.putText(
            frame,
            f"Head Score : {score}",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 0),
            2
        )

        cv2.putText(
            frame,
            f"Difference : {difference}",
            (20, 120),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 255),
            2
        )

    return frame, score, status