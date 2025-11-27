import json
from pathlib import Path
import pytest

from app.graph import run_flow, llm
from app.models.payloads import KapsoEvent

FIXTURE = Path(__file__).parent / "data" / "sample_event.json"


@pytest.mark.asyncio
async def test_onboarding_flow_persists_summary(monkeypatch):
    data = json.loads(FIXTURE.read_text())
    event = KapsoEvent(**data)

    async def fake_llm(self, messages):
        class Res:
            content = "SUMMARY"

        return Res()

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
            assert payload["conversation_summary"] == "SUMMARY"

            class Exec:
                def execute(self):
                    return None

            return Exec()

    class FakeSupabase:
        def table(self, _name):
            return FakeTable()

    monkeypatch.setattr("app.graph.supabase.SUPABASE", FakeSupabase(), raising=False)

    result = await run_flow(event)
    assert result["reply"]
