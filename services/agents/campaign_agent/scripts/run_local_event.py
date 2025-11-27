#!/usr/bin/env python3
import asyncio
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

os.environ.setdefault("OPENAI_API_KEY", "test-openai")
os.environ.setdefault("SUPABASE_URL", "https://supabase.local")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "service_role_dummy")
os.environ.setdefault("SUPABASE_ALLOW_MOCKS", "true")
os.environ.setdefault("KAPSO_API_KEY", "test_kapso")
os.environ.setdefault("KAPSO_BASE_URL", "https://kapso.local/")
os.environ.setdefault("IM_API_BASE_URL", "https://api.local")

from app.graph import run_flow, llm, supabase
from app.clients import kapso
from app.models.payloads import KapsoEvent

FIXTURE = ROOT / "tests" / "data" / "sample_proposal_event.json"


class FakeTable:
    def insert(self, payload):
        class Exec:
            def execute(self):
                return None

        return Exec()


class FakeSupabase:
    def table(self, _name):
        return FakeTable()


supabase.SUPABASE = FakeSupabase()


async def fake_send_text(**kwargs):
    return {"id": "mock-message", **kwargs}


kapso.send_text = fake_send_text


async def main():
    event_data = json.loads(FIXTURE.read_text())
    event = KapsoEvent(**event_data)

    async def fake_predict_messages(self, _messages):
        class Res:
            content = "MOCK PROPOSAL"

        return Res()

    setattr(type(llm), "apredict_messages", fake_predict_messages)

    output = await run_flow(event)
    print(output)


if __name__ == "__main__":
    asyncio.run(main())
