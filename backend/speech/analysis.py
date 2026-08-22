"""
Speech fluency analysis.

Ported from Mock_interview/speech_analysis/filler_detection.py and
speaking_speed.py. The original scripts ran Whisper locally on a recorded
audio file to get a transcript and timing. Here, the browser's Web Speech
API already produces the transcript and we just track how long the user
spoke (via JS timestamps), so this module works directly on that -
same filler-word list and WPM thresholds, no Whisper/audio processing
needed.
"""

import re

# Same list as the original filler_detection.py
FILLER_WORDS = [
    "um",
    "uh",
    "like",
    "actually",
    "basically",
    "you know",
    "hmm",
]


def count_fillers(text):
    lower = text.lower()
    counts = {}
    total = 0
    for word in FILLER_WORDS:
        # word-boundary count so "actually" doesn't match inside another word
        count = len(re.findall(rf"\b{re.escape(word)}\b", lower))
        if count > 0:
            counts[word] = count
        total += count
    return counts, total


def wpm_rating(wpm):
    # Same thresholds as the original speaking_speed.py
    if wpm < 90:
        return "Slow"
    elif wpm <= 150:
        return "Good"
    else:
        return "Fast"


def fluency_score(wpm, filler_total, word_count):
    """
    Not present in the original scripts (those just printed raw numbers) -
    this turns WPM + filler ratio into a single 0-100 score so it can sit
    alongside the other interview scores.
    """
    # Ideal band is the same "Good" range as wpm_rating (90-150)
    if 90 <= wpm <= 150:
        speed_score = 100
    elif wpm < 90:
        speed_score = max(40, 100 - (90 - wpm) * 1.5)
    else:
        speed_score = max(40, 100 - (wpm - 150) * 1.5)

    filler_ratio = (filler_total / word_count) if word_count else 0
    filler_penalty = min(50, filler_ratio * 300)  # heavier filler use costs more

    score = max(0, min(100, speed_score - filler_penalty))
    return round(score)


def analyze_speech(transcript, duration_seconds):
    """
    transcript: the spoken answer, as text (from the browser's speech
        recognition)
    duration_seconds: how long the user was actually speaking, measured
        client-side
    """
    words = transcript.split()
    word_count = len(words)

    duration_minutes = max(duration_seconds, 1) / 60
    wpm = round(word_count / duration_minutes, 1) if duration_minutes > 0 else 0

    filler_counts, filler_total = count_fillers(transcript)

    return {
        "word_count": word_count,
        "duration_seconds": round(duration_seconds, 1),
        "words_per_minute": wpm,
        "speed_rating": wpm_rating(wpm),
        "filler_word_counts": filler_counts,
        "total_filler_words": filler_total,
        "fluency_score": fluency_score(wpm, filler_total, word_count),
    }
