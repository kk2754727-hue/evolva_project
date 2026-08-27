"""
Client for a locally-running Ollama server.

No cloud API, no API key. Ollama runs entirely on your machine
(https://ollama.com) - install it, `ollama pull <model>`, and it exposes a
local HTTP server on port 11434 that this client talks to. If Ollama isn't
running or the model isn't pulled yet, we raise a clear error instead of a
confusing stack trace.
"""

import os
import json

import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "phi3:mini")

# Generation can be slow on CPU-only machines for longer outputs
# (course content especially) - keep the timeout generous.
REQUEST_TIMEOUT_SECONDS = 300


class OllamaNotAvailableError(RuntimeError):
    """Raised when Ollama isn't reachable or the model isn't pulled, so
    callers can return a clean 503 with setup instructions instead of a
    raw connection-error stack trace."""


class OllamaClient:
    def __init__(self, host=None, model=None):
        self.host = host or OLLAMA_HOST
        self.model = model or OLLAMA_MODEL

    def is_ready(self):
        """Best-effort check for the health endpoint - doesn't raise."""
        try:
            resp = requests.get(f"{self.host}/api/tags", timeout=3)
            resp.raise_for_status()
            models = [m.get("name", "") for m in resp.json().get("models", [])]
            model_pulled = any(m.split(":")[0] == self.model.split(":")[0] for m in models)
            return {"ollama_running": True, "model_pulled": model_pulled, "models": models}
        except Exception:
            return {"ollama_running": False, "model_pulled": False, "models": []}

    def generate_json(self, prompt, temperature=0.4, num_predict=2048):
        """
        Calls Ollama with format='json' so the model is constrained to
        emit valid JSON. Some models still wrap it in markdown fences
        occasionally - _parse_json handles that.
        """
        text = self._call(prompt, temperature, num_predict, json_mode=True)
        return self._parse_json(text)

    def generate_text(self, prompt, temperature=0.5, num_predict=800):
        return self._call(prompt, temperature, num_predict, json_mode=False)

    def _call(self, prompt, temperature, num_predict, json_mode):
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": num_predict,
            },
        }
        if json_mode:
            payload["format"] = "json"

        try:
            response = requests.post(
                f"{self.host}/api/generate",
                json=payload,
                timeout=REQUEST_TIMEOUT_SECONDS,
            )
        except requests.exceptions.ConnectionError:
            raise OllamaNotAvailableError(
                f"Couldn't reach Ollama at {self.host}. Make sure it's running "
                f"(`ollama serve`, or just open the Ollama app) and that the model "
                f"is pulled (`ollama pull {self.model}`)."
            )
        except requests.exceptions.Timeout:
            raise OllamaNotAvailableError(
                "Ollama took too long to respond. On CPU-only machines, longer "
                "generations (like full course content) can take a few minutes - "
                "try again, or switch to a smaller model like phi3:mini."
            )

        if response.status_code == 404:
            raise OllamaNotAvailableError(
                f"Model '{self.model}' isn't pulled yet. Run: ollama pull {self.model}"
            )
        response.raise_for_status()

        return response.json().get("response", "")

    @staticmethod
    def _parse_json(text):
        text = text.strip()
        if text.startswith("```"):
            text = text.strip("`").strip()
            if text.lower().startswith("json"):
                text = text[4:].strip()
        try:
            return json.loads(text)
        except Exception:
            return {"raw_response": text}