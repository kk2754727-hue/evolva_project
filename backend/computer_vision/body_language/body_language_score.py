import cv2

# -----------------------------
# Calculate Body Language Score
# -----------------------------
def calculate_body_language_score(
        shoulder_score,
        head_score,
        body_lean_score,
        movement_score):

    score = (
        shoulder_score * 0.30 +
        head_score * 0.25 +
        body_lean_score * 0.25 +
        movement_score * 0.20
    )

    return round(score,2)


# -----------------------------
# Example Scores
# (Later these come from
# previous modules)
# -----------------------------

shoulder_score = 95
head_score = 90
body_lean_score = 88
movement_score = 92

body_language_score = calculate_body_language_score(
    shoulder_score,
    head_score,
    body_lean_score,
    movement_score
)

print("Shoulder Score :", shoulder_score)
print("Head Score :", head_score)
print("Body Lean Score :", body_lean_score)
print("Movement Score :", movement_score)
print("----------------------------")
print("Body Language Score :", body_language_score)