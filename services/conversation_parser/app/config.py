# config.py
from dotenv import load_dotenv
import os

load_dotenv()  # loads variables from .env

INVESTOR_MATCH_API_BASE = os.getenv(
    "INVESTOR_MATCH_API_BASE",
    "https://investor-match-api-23715448976.us-east1.run.app"
)

INVESTOR_MATCH_API_AUTH_TOKEN = os.getenv("INVESTOR_MATCH_API_AUTH_TOKEN", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

REST_SERVER_BASE = "http://localhost:8000"  

def get_default_headers() -> dict:
    """
    Default headers for calls to the Investor Match API.
    """
    headers = {
        "Content-Type": "application/json"
    }
    if INVESTOR_MATCH_API_AUTH_TOKEN:
        headers["Authorization"] = f"Bearer {INVESTOR_MATCH_API_AUTH_TOKEN}"
    return headers


    