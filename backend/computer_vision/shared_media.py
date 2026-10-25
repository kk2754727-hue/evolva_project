"""
Shared MediaPipe model instances.

Each detector used to build its own FaceMesh at import time, so the same
model was loaded several times over. Everything now asks for the one shared
instance, created lazily on first use.
"""

import mediapipe as mp

_face_mesh = None


def get_face_mesh():
    global _face_mesh
    if _face_mesh is None:
        _face_mesh = mp.solutions.face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,      # needed for the iris landmarks (eye contact)
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )
    return _face_mesh