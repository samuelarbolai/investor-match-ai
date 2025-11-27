from importlib import reload
from unittest.mock import AsyncMock

import pytest
from httpx import ASGITransport, AsyncClient

import app.config as config
import app.routers.internal as internal_router
from app import kapso_client


def _setup_env(monkeypatch):
    monkeypatch.setenv("KAPSO_API_KEY", "test-api-key")
    monkeypatch.setenv("KAPSO_WEBHOOK_SECRET", "secret")
    monkeypatch.setenv("AGENT_ONBOARDING_URL", "https://onboarding-agent.test")
    monkeypatch.setenv("INTERNAL_ACCESS_TOKEN", "test-token")


async def _build_app():
    reload(config)
    reload(internal_router)
    from app import main

    reload(main)
    return main.create_app()


@pytest.mark.anyio("asyncio")
async def test_internal_send_message_requires_token(monkeypatch):
    _setup_env(monkeypatch)
    send_mock = AsyncMock(return_value={"ok": True})
    fetch_mock = AsyncMock(return_value={"conversation": "ok"})
    monkeypatch.setattr(kapso_client, "send_text", send_mock)
    monkeypatch.setattr(kapso_client, "fetch_conversation", fetch_mock)

    app = await _build_app()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post(
            "/internal/send-message",
            json={"phone_number_id": "pn", "to": "+1", "body": "hi"},
        )
        assert resp.status_code == 401

        resp_auth = await client.post(
            "/internal/send-message",
            json={"phone_number_id": "pn", "to": "+1", "body": "hi"},
            headers={"X-Internal-Token": "test-token"},
        )
        assert resp_auth.status_code == 200
        send_mock.assert_called_once()

        resp_conv = await client.get(
            "/internal/conversations/abc",
            headers={"X-Internal-Token": "test-token"},
        )
        assert resp_conv.status_code == 200
        fetch_mock.assert_called_once_with("abc")
