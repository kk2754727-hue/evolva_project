import os
import random
import time
import hashlib
import smtplib
from email.message import EmailMessage

OTP_EXPIRY = 300          # 5 minutes
MAX_ATTEMPTS = 5
RESEND_COOLDOWN = 30

otp_store = {}


def normalize_email(email):
    return email.strip().lower()


def hash_otp(email, otp):
    salt = os.getenv("OTP_SALT", "change-this-salt")
    value = f"{salt}:{email}:{otp}"
    return hashlib.sha256(value.encode()).hexdigest()


def generate_otp():
    return f"{random.SystemRandom().randint(0, 999999):06d}"


def send_otp_email(email, otp):
    sender = os.getenv("GMAIL_SENDER")
    app_password = os.getenv("GMAIL_APP_PASSWORD")

    if not sender or not app_password:
        raise RuntimeError(
            "GMAIL_SENDER and GMAIL_APP_PASSWORD are not configured."
        )

    message = EmailMessage()

    message["Subject"] = "EVOLVA Login OTP"
    message["From"] = sender
    message["To"] = email

    message.set_content(
        f"""
Hello,

Your EVOLVA login OTP is:

{otp}

This OTP is valid for 5 minutes.

Do not share this OTP with anyone.

If you did not request this login, please ignore this email.

Regards,
EVOLVA Team
"""
    )

    with smtplib.SMTP("smtp.gmail.com", 587, timeout=20) as server:
        server.starttls()
        server.login(sender, app_password)
        server.send_message(message)


def create_and_send_otp(email):
    email = normalize_email(email)

    if not email.endswith("@gmail.com"):
        raise ValueError("Please use a valid Gmail address.")

    current_time = time.time()

    existing = otp_store.get(email)

    if existing:
        elapsed = current_time - existing["created_at"]

        if elapsed < RESEND_COOLDOWN:
            remaining = int(RESEND_COOLDOWN - elapsed)

            raise ValueError(
                f"Please wait {remaining} seconds before requesting another OTP."
            )

    otp = generate_otp()

    send_otp_email(email, otp)

    otp_store[email] = {
        "otp_hash": hash_otp(email, otp),
        "created_at": current_time,
        "attempts": 0
    }


def verify_otp(email, otp):
    email = normalize_email(email)

    record = otp_store.get(email)

    if not record:
        return False, "OTP not found. Please request a new OTP."

    current_time = time.time()

    if current_time - record["created_at"] > OTP_EXPIRY:
        otp_store.pop(email, None)

        return False, "OTP expired. Please request a new OTP."

    if record["attempts"] >= MAX_ATTEMPTS:
        otp_store.pop(email, None)

        return False, "Too many incorrect attempts. Please request a new OTP."

    if hash_otp(email, otp) != record["otp_hash"]:
        record["attempts"] += 1

        remaining = MAX_ATTEMPTS - record["attempts"]

        return False, f"Incorrect OTP. {remaining} attempts remaining."

    otp_store.pop(email, None)

    return True, "OTP verified successfully."