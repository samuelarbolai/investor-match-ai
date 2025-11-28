import json
from pathlib import Path
import pytest

from app.graph import run_flow
from app.flows.onboarding import llm
from app.models.payloads import KapsoEvent

FIXTURE = Path(__file__).parent / "data" / "sample_event.json"


@pytest.mark.asyncio
async def test_onboarding_flow_persists_summary(monkeypatch):
    data = json.loads(FIXTURE.read_text())
    event = KapsoEvent(**data)

    async def fake_llm(self, messages):
        system_prompt = messages[0].content

        class Res:
            def __init__(self, content):
                self.content = content

        if system_prompt.startswith("## Investor Match"):
            return Res("REPLY")
        if system_prompt.startswith("You evaluate whether"):
            return Res('{"complete": true}')
        if system_prompt.startswith("Create or update"):
            return Res("FINAL SUMMARY")
        return Res("REPLY")

    monkeypatch.setattr(type(llm), "apredict_messages", fake_llm)

    class FakeTable:
        def select(self, *_args, **_kwargs):
            return self

        def eq(self, *_args, **_kwargs):
            return self

        def single(self):
            return self

        def execute(self):
            return type("Res", (), {"data": None})()

        def upsert(self, payload, **_kwargs):
            assert payload["user_id"] == "contact_sample"
            assert payload["conversation_summary"] == "FINAL SUMMARY"

            class Exec:
                def execute(self):
                    return None

            return Exec()

    class FakeSupabase:
        def table(self, _name):
            return FakeTable()

    monkeypatch.setattr("app.flows.onboarding.supabase.SUPABASE", FakeSupabase(), raising=False)

    result = await run_flow(event)
    assert result["reply"]
    assert result["conversation_complete"] is True


@pytest.mark.asyncio
async def test_onboarding_flow_uses_fallback_ids(monkeypatch):
    data = json.loads(FIXTURE.read_text())
    data.pop("contact_id", None)
    event = KapsoEvent(**data)

    async def fake_llm(self, messages):
        system_prompt = messages[0].content

        class Res:
            def __init__(self, content):
                self.content = content

        if system_prompt.startswith("## Investor Match"):
            return Res("REPLY")
        if system_prompt.startswith("You evaluate whether"):
            return Res('{"complete": false}')
        if system_prompt.startswith("Create or update"):
            return Res("IGNORED")
        return Res("REPLY")

    monkeypatch.setattr(type(llm), "apredict_messages", fake_llm)

    captured = {}

    class FakeTable:
        def select(self, *_args, **_kwargs):
            return self

        def eq(self, *_args, **_kwargs):
            return self

        def single(self):
            return self

        def execute(self):
            return type("Res", (), {"data": None})()

        def upsert(self, payload, **_kwargs):
            captured["user_id"] = payload["user_id"]
            captured["summary"] = payload["conversation_summary"]

            class Exec:
                def execute(self):
                    return None

            return Exec()

    class FakeSupabase:
        def table(self, _name):
            return FakeTable()

    monkeypatch.setattr("app.flows.onboarding.supabase.SUPABASE", FakeSupabase(), raising=False)

    result = await run_flow(event)
    assert result["reply"]
    assert result["conversation_complete"] is False
    assert captured["user_id"] == data["phone_number"]
    assert captured["summary"] == ""
