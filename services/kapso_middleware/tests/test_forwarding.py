import pytest
from importlib import reload
from typing import Optional

import app.config as config
import app.routers.shared as shared
from app.models import NormalizedKapsoEvent


def _normalized_event(flow: Optional[str] = None) -> NormalizedKapsoEvent:
    metadata = {}
    if flow:
        metadata["kapso_type"] = flow
    return NormalizedKapsoEvent(
        event_type=flow or "",
        metadata=metadata,
        headers={},
        messages=[],
    )


def test_pick_agent_url_defaults(monkeypatch):
    monkeypatch.setenv("AGENT_ONBOARDING_URL", "https://onboarding.test")
    monkeypatch.setenv("AGENT_CAMPAIGN_URL", "https://campaign.test")
    monkeypatch.setenv("AGENT_FEEDBACK_URL", "https://feedback.test")
    monkeypatch.setenv("AGENT_SETTER_URL", "https://setter.test")
    reload(config)
    reload(shared)
    event = _normalized_event("feedback:event")
    assert shared.pick_agent_url(event) == config.settings.agent_feedback_url
    event = _normalized_event("stage:changed")
    assert shared.pick_agent_url(event) == config.settings.agent_campaign_url
    event = _normalized_event("setter_flow")
    assert shared.pick_agent_url(event) == config.settings.agent_setter_url
    event = _normalized_event("random")
    assert shared.pick_agent_url(event) == config.settings.agent_onboarding_url


@pytest.mark.anyio("asyncio")
async def test_forward_to_agent(monkeypatch):
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
            calls.append({"url": url, "headers": headers, "payload": json})
            return DummyResponse()

    monkeypatch.setattr(shared.httpx, "AsyncClient", DummyAsyncClient)
    monkeypatch.setenv("AGENT_ONBOARDING_URL", "https://onboarding.test")
    payload = _normalized_event("foo").model_dump()
    await shared.forward_to_agent("https://onboarding.test", payload, idempotency_key="abc")
    assert calls[0]["url"] == "https://onboarding.test"
    assert calls[0]["headers"]["X-Idempotency-Key"] == "abc"
