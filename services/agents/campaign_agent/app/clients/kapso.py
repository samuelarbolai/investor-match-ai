import os
import httpx

MIDDLEWARE_BASE_URL = os.environ.get("KAPSO_MIDDLEWARE_BASE_URL")
USE_KAPSO_FAKE = os.environ.get("KAPSO_USE_FAKE", "false").lower() == "true"
DIRECT_BASE_URL = os.environ.get("KAPSO_BASE_URL", "https://app.kapso.ai/api/meta/")
DIRECT_API_KEY = os.environ.get("KAPSO_API_KEY", "")


def _use_middleware() -> bool:
    return bool(MIDDLEWARE_BASE_URL) and not USE_KAPSO_FAKE


def _internal_url(path: str) -> str:
    return f"{MIDDLEWARE_BASE_URL.rstrip('/')}{path}"


async def send_text(phone_number_id: str, to: str, body: str) -> dict:
    payload = {
        "phone_number_id": phone_number_id,
        "to": to,
        "body": body,
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        if USE_KAPSO_FAKE:
            return {"id": "mock-message", **payload}
        elif _use_middleware():
            resp = await client.post(_internal_url("/internal/send-message"), json=payload)
        else:
            resp = await client.post(
                f"{DIRECT_BASE_URL}messages",
                headers={"X-API-Key": DIRECT_API_KEY},
                json={
                    "phoneNumberId": phone_number_id,
                    "to": to,
                    "type": "text",
                    "text": {"body": body},
                },
            )
        resp.raise_for_status()
        return resp.json()


async def fetch_conversation(conversation_id: str) -> dict:
    async with httpx.AsyncClient(timeout=10.0) as client:
        if USE_KAPSO_FAKE:
            return {"conversation_id": conversation_id, "messages": []}
        elif _use_middleware():
            resp = await client.get(_internal_url(f"/internal/conversations/{conversation_id}"))
        else:
            resp = await client.get(
                f"{DIRECT_BASE_URL}conversations/{conversation_id}",
                headers={"X-API-Key": DIRECT_API_KEY},
            )
        resp.raise_for_status()
        return resp.json()
