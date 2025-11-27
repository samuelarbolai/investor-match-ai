import json
import time
from importlib import reload

import pytest
from httpx import ASGITransport, AsyncClient

import app.config as config
import app.idempotency as idempotency
import app.routers.shared as shared
import app.routers.webhooks as webhooks
from app.main import create_app
from app.utils.signature import compute_signature


def _sample_payload() -> str:
    payload = {
        "type": "whatsapp.message.received",
        "data": [
            {
                "message": {
                    "id": "wamid.HBgLNTE1",
                    "type": "text",
                    "text": {"body": "Hello Kapso"},
                    "kapso": {"direction": "inbound"},
                    "timestamp": "1733186400",
                },
                "conversation": {
                    "id": "conv-123",
                    "phone_number": "+15555550123",
                    "metadata": {
                        "owner_id": "owner-1",
                        "contact_id": "contact-42",
                        "flow": "campaign",
                    },
                },
                "phone_number_id": "pn-123",
                "is_new_conversation": False,
            }
        ],
    }
    return json.dumps(payload)


def _setup_env(monkeypatch):
    monkeypatch.setenv("KAPSO_API_KEY", "test-api-key")
    monkeypatch.setenv("KAPSO_WEBHOOK_SECRET", "super-secret")
    monkeypatch.setenv("AGENT_CAMPAIGN_URL", "https://campaign-agent.test")
    monkeypatch.setenv("AGENT_ONBOARDING_URL", "https://onboarding-agent.test")
    monkeypatch.setenv("AGENT_FEEDBACK_URL", "https://feedback-agent.test")
    monkeypatch.setenv("AGENT_SETTER_URL", "https://setter-agent.test")
    monkeypatch.setenv("FORWARD_TO_PARSER", "false")


async def _build_app():
    reload(config)
    reload(shared)
    reload(webhooks)
    from app import main

    reload(main)
    await idempotency.reset_store()
    return main.create_app()


@pytest.mark.anyio("asyncio")
async def test_webhook_flow(monkeypatch):
    _setup_env(monkeypatch)
    calls = []

    class DummyResponse:
        status_code = 200
        content = b'{"ok": true}'

        def json(self):
            return {"ok": True}

        def raise_for_status(self):
            return None

    class DummyAsyncClient:
        def __init__(self, *args, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *args):
            return False

        async def post(self, url, json=None, headers=None):
            calls.append({"url": url, "payload": json})
            return DummyResponse()

    monkeypatch.setattr(shared.httpx, "AsyncClient", DummyAsyncClient)

    app = await _build_app()

    payload = _sample_payload()
    timestamp = str(int(time.time()))
    signature = compute_signature("super-secret", payload.encode("utf-8"), timestamp)

    headers = {
        "X-Webhook-Signature": signature,
        "X-Webhook-Timestamp": timestamp,
        "X-Webhook-Event": "whatsapp.message.received",
        "X-Idempotency-Key": "idem-abc",
        "Content-Type": "application/json",
    }

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/webhooks/kapso", content=payload, headers=headers)
        assert resp.status_code == 200
        assert resp.json()["status"] == "queued"
        assert calls[0]["url"] == "https://campaign-agent.test/"

        # Duplicate idempotency key short-circuits.
        resp_dup = await client.post("/webhooks/kapso", content=payload, headers=headers)
        assert resp_dup.status_code == 200
        assert resp_dup.json()["status"] == "already-processed"
