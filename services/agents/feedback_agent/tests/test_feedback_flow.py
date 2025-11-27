import json
import pytest
import respx
from pathlib import Path
from httpx import Response

from app.graph import run_flow, llm
from app.models.payloads import KapsoEvent

FIXTURE = Path(__file__).parent / "data" / "sample_feedback_event.json"


@pytest.mark.asyncio
async def test_feedback_flow_stores_and_calls_api(monkeypatch):
    data = json.loads(FIXTURE.read_text())
    event = KapsoEvent(**data)

    async def fake_llm(self, messages):
        class Res:
            content = '{"approval":"approve","notes":"Looks great"}'

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

        def insert(self, payload):
            self.payload = payload

            class Exec:
                def execute(self):
                    return None

            return Exec()

    fake_table = FakeTable()

    class FakeSupabase:
        def table(self, _name):
            return fake_table

    monkeypatch.setattr("app.graph.supabase.SUPABASE", FakeSupabase(), raising=False)

    async def fake_fetch_conversation(conversation_id: str):
        return {"conversation_id": conversation_id, "messages": []}

    monkeypatch.setattr("app.graph.kapso.fetch_conversation", fake_fetch_conversation)

    sent = {}

    async def fake_send_text(**kwargs):
        sent.update(kwargs)
        return {"id": "kapso-msg"}

    monkeypatch.setattr("app.graph.kapso.send_text", fake_send_text)

    monkeypatch.setenv("IM_API_BASE_URL", "https://api.example.com")
    monkeypatch.setattr("app.graph.kapso.USE_KAPSO_FAKE", True, raising=False)

    with respx.mock:
        respx.post("https://api.example.com/v1/feedback").mock(return_value=Response(200, json={"ok": True}))
        result = await run_flow(event)

    assert result["status"] == "processed"
    assert fake_table.payload["parsed_content"]["approval"] == "approve"
    assert "Looks great" in sent["body"]
