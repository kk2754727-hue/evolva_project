import cv2

from computer_vision.shared_models import get_face_mesh
from computer_vision.eye_contact import detect_eye_contact
from computer_vision.head_pose import detect_head_pose

from computer_vision.body_language.shoulder_allignment import detect_shoulder
from computer_vision.body_language.body_lean import detecting_body_lean
from computer_vision.body_language.movement_detection import detect_movement
from computer_vision.body_language.posture_score import detect_posture_score


class ComputerVisionEngine:

    def __init__(self):
        pass

    def process(self, frame):

        # -----------------------------
        # Eye Contact
        # -----------------------------
        # One face-detection pass shared by eye contact and head pose
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_results = get_face_mesh().process(rgb)

        frame, eye_score, eye_status = detect_eye_contact(frame, face_results)

        # -----------------------------
        # Head Pose
        # -----------------------------
        frame, head_score, head_status = detect_head_pose(frame, face_results)

        # -----------------------------
        # Shoulder
        # -----------------------------
        frame, shoulder_score, shoulder_status = detect_shoulder(frame)

        # -----------------------------
        # Body Lean
        # -----------------------------
        frame, lean_score, lean_status = detecting_body_lean(frame)

        # -----------------------------
        # Movement
        # -----------------------------
        frame, movement_score, movement_status = detect_movement(frame)

        # -----------------------------
        # Posture
        # -----------------------------
        frame, posture_score, posture_status = detect_posture_score(frame)

        # -----------------------------
        # Body Score
        # -----------------------------
        body_score = int(
            (
                shoulder_score +
                lean_score +
                movement_score +
                posture_score
            ) / 4
        )

        # -----------------------------
        # Overall CV Score
        # -----------------------------
        cv_score = int(
            (
                eye_score +
                head_score +
                body_score
            ) / 3
        )

        scores = {

            "eye_score": eye_score,
            "eye_status": eye_status,

            "head_score": head_score,
            "head_status": head_status,

            "body_score": body_score,

            "cv_score": cv_score

        }

        return frame, scores