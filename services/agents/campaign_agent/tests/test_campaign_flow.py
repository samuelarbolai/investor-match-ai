import json
from pathlib import Path
import pytest

from app.graph import run_flow, llm
from app.models.payloads import KapsoEvent

FIXTURE = Path(__file__).parent / "data" / "sample_proposal_event.json"


@pytest.mark.asyncio
async def test_campaign_flow_builds_and_sends(monkeypatch):
    data = json.loads(FIXTURE.read_text())
    event = KapsoEvent(**data)

    async def fake_llm(self, messages):
        class Res:
            content = "Mock proposal"

        return Res()

    monkeypatch.setattr(type(llm), "apredict_messages", fake_llm)

    inserted = {}

    class FakeTable:
        def upsert(self, payload):
            self.upsert_payload = payload

            class Exec:
                def execute(self):
                    return None

            return Exec()

        def insert(self, payload):
            inserted.update(payload)

            class Exec:
                def execute(self):
                    return None

            return Exec()

    class FakeSupabase:
        def table(self, _name):
            return FakeTable()

    monkeypatch.setattr("app.graph.supabase.SUPABASE", FakeSupabase(), raising=False)

    monkeypatch.setattr("app.graph.kapso.USE_KAPSO_FAKE", True)
    result = await run_flow(event)
    assert result["status"] == "sent"
    assert inserted["proposal_payload"]
