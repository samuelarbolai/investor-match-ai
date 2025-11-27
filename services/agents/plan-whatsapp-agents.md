# WhatsApp Agent System – FastAPI + LangGraph Build Plan

This document is the bootcamp-style checklist for implementing the new Kapso-driven WhatsApp automation layer. Follow it **exactly**—you can reproduce the entire stack line-by-line without having to infer any missing steps.

---

## 1. Architecture Recap

1. **Transport Layer** – `services/kapso_middleware` verifies Kapso webhooks, normalizes payloads, and calls the appropriate agent HTTP endpoint.
2. **LangGraph Agents** – Each service under `services/agents/*` runs FastAPI + LangGraph:
   - `onboarding_agent`: handles onboarding flows + campaign proposals.
   - `campaign_agent`: pushes campaign proposal updates (new prospects, stage change to `outreached`).
   - `feedback_agent`: ingests replies, stores feedback summaries, responds contextually.
   - `setter_agent`: scaffold only (future meeting handling).
3. **Persistence** – Supabase (managed Postgres) stores:
   - `user_id`
   - `user_phone_number`
   - `conversation_summary`
   - `last_conversation_id`
   - Additional fields described below (feedback payloads, proposal history).
4. **Kapso Access** – All outbound WhatsApp messages (and conversation lookups) go through a new internal API exposed by `kapso_middleware` (`/internal/send-message`, `/internal/conversations/:id`). Agents never talk to Kapso directly, so the middleware remains the single place the Kapso API key lives.
5. **Investor Match API** – Agents call existing API endpoints (`/v1/introductions/*`, `/v1/contacts`, etc.) when they need to mutate campaign data.
6. **Deployment** – Each agent service runs as its own Cloud Run deployment with Dockerfiles similar to other FastAPI services.

---

## 2. Repository Layout

Add the following directories under `investor-match-api/services/`:

```
services/
├── agents/
│   ├── onboarding_agent/
│   ├── campaign_agent/
│   ├── feedback_agent/
│   └── setter_agent/
├── kapso_middleware/
└── conversation_parser/ (existing)
```

Each agent service mirrors the same structure:

```
services/agents/<agent_name>/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── graph.py
│   ├── routers/
│   │   └── inbound.py
│   ├── clients/
│   │   ├── kapso.py
│   │   └── supabase.py
│   ├── models/
│   │   └── payloads.py
│   └── llm/
│       └── prompts.py
├── tests/
│   └── test_graph.py
├── pyproject.toml
├── requirements.txt
└── Dockerfile
```

---

## 3. Supabase Setup

### 3.1 Provision
1. Create a new Supabase project via the dashboard.
2. Capture:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` (not for backend use)
   - `SUPABASE_SERVICE_ROLE_KEY` (use this for server-side agents).

### 3.2 Schema (run in Supabase SQL editor)

```sql
create table if not exists whatsapp_users (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  user_phone_number text not null unique,
  last_conversation_id text,
  conversation_summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists campaign_proposals (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references whatsapp_users(user_id),
  proposal_payload jsonb not null,
  sent_at timestamptz default now(),
  status text default 'pending', -- pending | accepted | rejected
  feedback_summary text
);

create table if not exists campaign_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references whatsapp_users(user_id),
  kapso_conversation_id text not null,
  kapso_message_id text not null,
  raw_message text not null,
  parsed_sentiment text, -- approve | reject | neutral
  parsed_content jsonb,
  created_at timestamptz default now()
);

create trigger set_timestamp
before update on whatsapp_users
for each row
execute procedure trigger_set_timestamp();
```

> **Note:** `trigger_set_timestamp` exists in every Supabase project; if missing, create it with `create extension if not exists pgcrypto; create function trigger_set_timestamp() returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;`.

### 3.3 Environment Variables

Add the following to each Cloud Run service (or `.env` for local dev):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_SCHEMA=public`
- `KAPSO_MIDDLEWARE_BASE_URL` (e.g., `https://kapso-middleware-xxx.a.run.app`)
- `KAPSO_USE_FAKE` (set to `true` locally to bypass Kapso and use built-in mocks)

---

## 4. Shared Python Template

Create the following files first, then copy them into each agent service (customize per agent in later sections).

### 4.1 `pyproject.toml`

```toml
[project]
name = "whatsapp-agent"
version = "0.1.0"
description = "FastAPI + LangGraph service for Kapso automations"
requires-python = ">=3.11"
dependencies = [
  "fastapi==0.110.2",
  "uvicorn[standard]==0.29.0",
  "langchain==0.1.17",
  "langgraph==0.0.50",
  "pydantic==2.7.1",
  "httpx==0.27.0",
  "supabase==2.3.3",
  "python-dotenv==1.0.1"
]

[project.optional-dependencies]
dev = [
  "pytest==8.2.0",
  "pytest-asyncio==0.23.6",
  "respx==0.21.1"
]

[build-system]
requires = ["setuptools", "wheel"]
build-backend = "setuptools.build_meta"
```

### 4.2 `requirements.txt`

```
fastapi==0.110.2
uvicorn[standard]==0.29.0
langchain==0.1.17
langgraph==0.0.50
pydantic==2.7.1
httpx==0.27.0
supabase==2.3.3
python-dotenv==1.0.1
pytest==8.2.0
pytest-asyncio==0.23.6
respx==0.21.1
```

### 4.3 `Dockerfile`

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### 4.4 `app/main.py`

```python
from fastapi import FastAPI
from app.routers import inbound

app = FastAPI(title="WhatsApp Agent Service")

app.include_router(inbound.router)

@app.get("/healthz")
async def healthcheck():
    return {"status": "ok"}
```

### 4.5 `app/routers/inbound.py`

```python
from fastapi import APIRouter, HTTPException
from app.graph import run_flow
from app.models.payloads import KapsoEvent

router = APIRouter(prefix="/agents", tags=["agents"])

@router.post("/inbound")
async def inbound(event: KapsoEvent):
    try:
        result = await run_flow(event)
        return {"status": "ok", "output": result}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
```

### 4.6 `app/models/payloads.py`

```python
from pydantic import BaseModel
from typing import Optional, Dict, Any

class KapsoMessage(BaseModel):
    id: str
    body: str
    type: str
    created_at: str

class KapsoEvent(BaseModel):
    event_type: str
    conversation_id: str
    owner_id: str
    contact_id: str
    phone_number: str
    messages: list[KapsoMessage]
    metadata: Optional[Dict[str, Any]] = None
```

### 4.7 `app/clients/kapso.py`

```python
import httpx
import os

KAPSO_BASE_URL = os.environ.get("KAPSO_BASE_URL", "https://app.kapso.ai/api/meta/")
KAPSO_API_KEY = os.environ["KAPSO_API_KEY"]

async def send_text(phone_number_id: str, to: str, body: str) -> dict:
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(
            f"{KAPSO_BASE_URL}messages",
            headers={"X-API-Key": KAPSO_API_KEY},
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
        resp = await client.get(
            f"{KAPSO_BASE_URL}conversations/{conversation_id}",
            headers={"X-API-Key": KAPSO_API_KEY},
        )
        resp.raise_for_status()
        return resp.json()
```

### 4.8 `app/clients/supabase.py`

```python
import os
from supabase import create_client, Client

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

def get_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)

SUPABASE = get_client()
```

### 4.9 `app/graph.py` (base template)

```python
from typing import Any, Dict
from langchain.schema import SystemMessage, HumanMessage
from langchain.chat_models import ChatOpenAI
from langgraph.graph import MessageGraph, END
from app.models.payloads import KapsoEvent

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

async def build_context(event: KapsoEvent) -> str:
    latest = event.messages[-1].body if event.messages else ""
    return f"Owner {event.owner_id} contact {event.contact_id}: {latest}"

async def agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    context = state["context"]
    response = await llm.apredict_messages(
        [
            SystemMessage(content=state["system_prompt"]),
            HumanMessage(content=context),
        ]
    )
    return {"reply": response.content}

async def run_flow(event: KapsoEvent) -> Dict[str, Any]:
    graph = MessageGraph()
    graph.add_node("agent", agent_node)
    graph.set_entry_point("agent")
    graph.add_edge("agent", END)

    workflow = graph.compile()
    context = await build_context(event)
    result = await workflow.ainvoke(
        {
            "context": context,
            "system_prompt": "Default prompt – override in each agent",
        }
    )
    return result
```

### 4.10 `tests/test_graph.py`

```python
import pytest
from app.graph import run_flow
from app.models.payloads import KapsoEvent, KapsoMessage

@pytest.mark.asyncio
async def test_run_flow_returns_reply(monkeypatch):
    async def fake_predict_messages(messages):
        class Res:
            content = "ok"
        return Res()

    from app.graph import llm
    monkeypatch.setattr(llm, "apredict_messages", fake_predict_messages)

    event = KapsoEvent(
        event_type="test",
        conversation_id="conv",
        owner_id="owner",
        contact_id="contact",
        phone_number="+123",
        messages=[KapsoMessage(id="1", body="hello", type="text", created_at="2024-01-01T00:00:00Z")],
    )

    result = await run_flow(event)
    assert result["reply"] == "ok"
```

You now have a functioning template. Each agent customizes `graph.py`, `routers/inbound.py`, and adds additional modules per the sections below.

### 4.11 Mock Data Fixtures (Required Before Any Integration)

Create `tests/data/sample_event.json` so every agent can run deterministic tests without Kapso or OpenAI:

```json
{
  "event_type": "whatsapp.message.received",
  "conversation_id": "conv_sample",
  "owner_id": "owner_sample",
  "contact_id": "contact_sample",
  "phone_number": "+15555550123",
  "messages": [
    {
      "id": "msg_sample",
      "body": "Hi team, thanks for reaching out!",
      "type": "text",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "metadata": {
    "phone_number_id": "pn_sample",
    "prospects": []
  }
}
```

If a flow needs additional metadata (e.g., proposal lists or feedback payloads) add more JSON files under `tests/data/` such as `sample_proposal_event.json` or `sample_feedback_event.json`.

### 4.12 Offline Runner Script

Before connecting to Kapso or OpenAI, run flows locally using a CLI harness. Create `scripts/run_local_event.py` in each agent folder:

```python
#!/usr/bin/env python3
import asyncio
import json
from pathlib import Path
from app.graph import run_flow
from app.models.payloads import KapsoEvent

FIXTURE = Path(__file__).resolve().parent.parent / "tests" / "data" / "sample_event.json"

async def main():
    event_data = json.loads(FIXTURE.read_text())
    event = KapsoEvent(**event_data)

    # Monkeypatch the LLM so tests stay deterministic
    from app import graph
    async def fake_predict_messages(messages):
        class Res:
            content = "MOCKED RESPONSE"
        return Res()
    graph.llm.apredict_messages = fake_predict_messages  # type: ignore

    output = await run_flow(event)
    print(output)

if __name__ == "__main__":
    asyncio.run(main())
```

Make it executable: `chmod +x scripts/run_local_event.py`. Run `./scripts/run_local_event.py` before touching any external dependency; you should see `{"reply": "MOCKED RESPONSE"}` or the relevant status payload.

---

## 5. Onboarding Agent

### 5.1 Purpose
- Handles initial contact onboarding when a user first messages us.
- Sends welcome messages and collects data needed to create/update contacts in Investor Match.
- Triggers Supabase writes to keep `conversation_summary` and `last_conversation_id` up to date.

### 5.2 Incoming Route
- `kapso_middleware` calls `POST https://<onboarding-agent>/agents/onboarding/inbound`.
- Request body = normalized `KapsoEvent`.

### 5.3 Customize Files

1. **`app/routers/inbound.py`**
   ```python
   from fastapi import APIRouter
   from app.graph import run_flow
   from app.models.payloads import KapsoEvent

   router = APIRouter(prefix="/agents/onboarding", tags=["onboarding"])

   @router.post("/inbound")
   async def inbound(event: KapsoEvent):
       return await run_flow(event)
   ```

2. **`app/graph.py`**
   ```python
   from typing import Dict, Any
   from langchain.schema import SystemMessage, HumanMessage
   from langchain.chat_models import ChatOpenAI
   from langgraph.graph import StateGraph, END
   from app.models.payloads import KapsoEvent
   from app.clients import supabase

   llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

   async def load_user(event: KapsoEvent) -> Dict[str, Any]:
       record = supabase.SUPABASE.table("whatsapp_users").select("*").eq("user_phone_number", event.phone_number).single(execute=True)
       data = record.data if record else None
       return {"user_record": data}

   async def summarize(event: KapsoEvent, state: Dict[str, Any]) -> Dict[str, Any]:
       latest = event.messages[-1].body if event.messages else ""
       summary_prompt = f"Summarize onboarding conversation so far. Latest: {latest}"
       summary = await llm.apredict_messages([SystemMessage(content="Summarize conversations"), HumanMessage(content=summary_prompt)])
       return {"conversation_summary": summary.content}

   async def generate_reply(event: KapsoEvent, state: Dict[str, Any]) -> Dict[str, Any]:
       prompt = f"""
       You are the onboarding assistant. User phone: {event.phone_number}.
       Latest message: {event.messages[-1].body if event.messages else ""}
       Conversation summary so far: {state.get('conversation_summary', '')}
       Ask for missing data (company, role) if not captured yet.
       """
       reply = await llm.apredict_messages([SystemMessage(content="Onboarding assistant"), HumanMessage(content=prompt)])
       return {"reply": reply.content}

   async def persist(event: KapsoEvent, state: Dict[str, Any]) -> Dict[str, Any]:
       payload = {
           "user_id": event.contact_id,
           "user_phone_number": event.phone_number,
           "last_conversation_id": event.conversation_id,
           "conversation_summary": state["conversation_summary"],
       }
       supabase.SUPABASE.table("whatsapp_users").upsert(payload).execute()
       return {}

   async def run_flow(event: KapsoEvent) -> Dict[str, Any]:
       workflow = StateGraph(dict)
       workflow.add_node("load_user", lambda state: load_user(event))
       workflow.add_node("summarize", lambda state: summarize(event, state))
       workflow.add_node("reply", lambda state: generate_reply(event, state))
       workflow.add_node("persist", lambda state: persist(event, state))

       workflow.set_entry_point("load_user")
       workflow.add_edge("load_user", "summarize")
       workflow.add_edge("summarize", "reply")
       workflow.add_edge("reply", "persist")
       workflow.add_edge("persist", END)

       compiled = workflow.compile()
       result = await compiled.ainvoke({})
       return {"reply": result["reply"]}
   ```

3. **`app/main.py`** – update FastAPI title to “Onboarding Agent”.

4. **Tests** – add cases ensuring `persist` writes to Supabase (mock `SUPABASE.table`).

### 5.4 Outgoing Kapso Messages
- After `run_flow` returns, `kapso_middleware` reads the `reply` string and calls Kapso `messages.sendText`.
- Alternatively, make `run_flow` call `kapso_client.send_text` directly if you need per-agent control.

### 5.5 Mock-First Test Suite

Create `tests/test_onboarding_flow.py`:

```python
import json
import pytest
from pathlib import Path
from app.graph import run_flow, llm
from app.models.payloads import KapsoEvent

FIXTURE = Path(__file__).parent / "data" / "sample_event.json"

@pytest.mark.asyncio
async def test_onboarding_flow_persists_summary(monkeypatch):
    data = json.loads(FIXTURE.read_text())
    event = KapsoEvent(**data)

    class FakeLLM:
        async def apredict_messages(self, messages):
            class R:
                content = "SUMMARY"
            return R()
    monkeypatch.setattr(llm, "apredict_messages", FakeLLM().apredict_messages)

    class FakeTable:
        def upsert(self, payload):
            assert payload["user_id"] == "contact_sample"
            assert payload["conversation_summary"] == "SUMMARY"
            class Exec:
                def execute(self): return None
            return Exec()
    monkeypatch.setattr("app.graph.supabase.SUPABASE.table", lambda name: FakeTable())

    result = await run_flow(event)
    assert result["reply"]
```

Run `pytest tests/test_onboarding_flow.py` and `./scripts/run_local_event.py` before pointing the agent at Kapso.

---

## 6. Campaign Agent

### 6.1 Triggers
- Stage-change events (`stage.changed`, `stage.bulk_changed`) from Pub/Sub cause the campaign agent to send proposals whenever:
  - A contact becomes a new prospect.
  - A prospect stage transitions to `outreached`.

### 6.2 Entry Point
- Expose `POST /agents/campaign/proposals`.
- Body: `{ "owner_id": "...", "contact_id": "...", "prospects": [...], "kapso": { ... } }`.
- `kapso_middleware` posts here after it detects a stage event + needs to deliver WhatsApp updates.

### 6.3 `app/graph.py`

```python
from langgraph.graph import StateGraph, END
from app.models.payloads import KapsoEvent
from app.clients import kapso, supabase
from langchain.schema import SystemMessage, HumanMessage
from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

async def build_proposal(event: KapsoEvent, state):
    prospects = event.metadata.get("prospects", [])
    bullet_list = "\n".join([f"- {p['full_name']} ({p['headline']})" for p in prospects])
    prompt = f"""You are Investor Match campaign assistant. Owner {event.owner_id} has {len(prospects)} fresh prospects.
Summaries:
{bullet_list}
Craft a concise WhatsApp proposal asking for approval."""
    response = await llm.apredict_messages(
        [SystemMessage(content="Campaign proposal assistant"), HumanMessage(content=prompt)]
    )
    return {"proposal_text": response.content}

async def store_proposal(event: KapsoEvent, state):
    supabase.SUPABASE.table("campaign_proposals").insert(
        {
            "user_id": event.contact_id,
            "proposal_payload": event.metadata.get("prospects", []),
        }
    ).execute()
    return {}

async def send(event: KapsoEvent, state):
    await kapso.send_text(
        phone_number_id=event.metadata["phone_number_id"],
        to=event.phone_number,
        body=state["proposal_text"],
    )
    return {"reply": "sent"}

async def run_flow(event: KapsoEvent):
    workflow = StateGraph(dict)
    workflow.add_node("build", lambda state: build_proposal(event, state))
    workflow.add_node("store", lambda state: store_proposal(event, state))
    workflow.add_node("send", lambda state: send(event, state))
    workflow.set_entry_point("build")
    workflow.add_edge("build", "store")
    workflow.add_edge("store", "send")
    workflow.add_edge("send", END)
    compiled = workflow.compile()
    await compiled.ainvoke({})
    return {"status": "sent"}
```

### 6.4 Testing
- Mock `kapso.send_text` and `SUPABASE.table(...).insert`.
- Verify proposals are persisted before sending.

Create `tests/test_campaign_flow.py`:

```python
import json
import pytest
from pathlib import Path
from app.graph import run_flow, llm
from app.models.payloads import KapsoEvent

FIXTURE = Path(__file__).parent / "data" / "sample_proposal_event.json"

@pytest.mark.asyncio
async def test_campaign_flow_builds_and_sends(monkeypatch):
    data = json.loads(FIXTURE.read_text())
    event = KapsoEvent(**data)

    async def fake_llm(messages):
        class Res:
            content = "Mock proposal"
        return Res()
    monkeypatch.setattr(llm, "apredict_messages", fake_llm)

    inserted = {}
    class FakeTable:
        def insert(self, payload):
            inserted.update(payload)
            class Exec:
                def execute(self): return None
            return Exec()
    monkeypatch.setattr("app.graph.supabase.SUPABASE.table", lambda name: FakeTable())

    sent_messages = {}
    async def fake_send_text(**kwargs):
        sent_messages.update(kwargs)
        return {"id": "kapso-msg"}
    monkeypatch.setattr("app.graph.kapso.send_text", fake_send_text)

    result = await run_flow(event)
    assert result["status"] == "sent"
    assert inserted["proposal_payload"]
    assert sent_messages["body"] == "Mock proposal"
```

Add `tests/data/sample_proposal_event.json` with at least two mock prospects to drive this test.

---

## 7. Feedback Agent

### 7.1 Responsibilities
- Triggered by Kapso replies (owner feedback on proposals).
- If reply arrives >24h after last conversation, pull full conversation context first.
- Store feedback payload in Supabase, update `campaign_proposals.status`, and send acknowledgement.

### 7.2 Workflow Nodes
1. **Load user + last conversation** from Supabase.
2. **Check timestamp** – if current message `created_at` minus stored `updated_at` > 24h, call `kapso.fetch_conversation`.
3. **Summarize feedback** via LLM.
4. **Persist** to `campaign_feedback`.
5. **Send response** (Kapso text) and call Investor Match API to move stage if necessary.

### 7.3 Code Snippet (`app/graph.py`)

```python
from datetime import datetime, timezone
from langgraph.graph import StateGraph, END
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from app.clients import kapso, supabase
import httpx

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

async def load_user(event):
    res = supabase.SUPABASE.table("whatsapp_users").select("*").eq("user_phone_number", event.phone_number).single().execute()
    return res.data if res.data else {}

def needs_context(user_record, event):
    if not user_record or not user_record.get("updated_at"):
        return True
    last = datetime.fromisoformat(user_record["updated_at"].replace("Z", "+00:00"))
    latest_ts = datetime.fromisoformat(event.messages[-1].created_at.replace("Z", "+00:00"))
    return (latest_ts - last).total_seconds() > 86400

async def summarize_feedback(event, conversation):
    prompt = f"""
    Summarize this WhatsApp feedback. Latest message: {event.messages[-1].body}
    Conversation context: {conversation}
    Identify approval/rejection and key notes.
    Output JSON with fields approval (approve|reject|neutral) and notes.
    """
    response = await llm.apredict_messages(
        [SystemMessage(content="Feedback summarizer"), HumanMessage(content=prompt)]
    )
    return response.content

async def persist_feedback(event, summary_json):
    supabase.SUPABASE.table("campaign_feedback").insert(
        {
            "user_id": event.contact_id,
            "kapso_conversation_id": event.conversation_id,
            "kapso_message_id": event.messages[-1].id,
            "raw_message": event.messages[-1].body,
            "parsed_content": summary_json,
        }
    ).execute()

async def notify_api(event, summary_json):
    async with httpx.AsyncClient(timeout=10.0) as client:
        await client.post(
            f"{os.environ['IM_API_BASE_URL']}/v1/feedback",
            headers={"x-api-key": os.environ.get("IM_API_KEY", "")},
            json={"contactId": event.contact_id, "feedback": summary_json},
        )

async def send_ack(event, summary_json):
    summary = summary_json.get("notes", "Thanks for the update!")
    await kapso.send_text(
        phone_number_id=event.metadata["phone_number_id"],
        to=event.phone_number,
        body=f"Thanks! Logged your feedback: {summary}",
    )

async def run_flow(event: KapsoEvent):
    user_record = await load_user(event)
    conversation = ""
    if needs_context(user_record, event):
        conversation = await kapso.fetch_conversation(event.conversation_id)
    summary_json = json.loads(await summarize_feedback(event, conversation))
    await persist_feedback(event, summary_json)
    await notify_api(event, summary_json)
    await send_ack(event, summary_json)
    return {"status": "processed", "summary": summary_json}
```

> Remember to `import json` and `import os` at the top.

### 7.4 Tests
- Mock Kapso + Supabase + Investor Match API using `respx`.
- Assert 24h logic triggers the conversation fetch.

Create `tests/test_feedback_flow.py`:

```python
import json
import pytest
import respx
from httpx import Response
from pathlib import Path
from app.graph import run_flow, llm
from app.models.payloads import KapsoEvent

FIXTURE = Path(__file__).parent / "data" / "sample_feedback_event.json"

@pytest.mark.asyncio
async def test_feedback_flow_stores_and_calls_api(monkeypatch):
    data = json.loads(FIXTURE.read_text())
    event = KapsoEvent(**data)

    async def fake_llm(messages):
        class Res:
            content = '{"approval":"approve","notes":"Looks great"}'
        return Res()
    monkeypatch.setattr(llm, "apredict_messages", fake_llm)

    class FakeSelect:
        def eq(self, *_args, **_kwargs): return self
        def single(self): return self
        def execute(self):
            return type("R", (), {"data": {"updated_at": "2023-12-31T00:00:00Z"}})()

    class FakeTable:
        def select(self, *_args, **_kwargs): return FakeSelect()
        def insert(self, payload):
            self.payload = payload
            class Exec:
                def execute(_self): return None
            return Exec()
    fake_table = FakeTable()
    monkeypatch.setattr("app.graph.supabase.SUPABASE.table", lambda name: fake_table)

    @respx.mock
    async def inner():
        respx.post("https://api.example.com/v1/feedback").mock(return_value=Response(200, json={"ok": True}))
        monkeypatch.setenv("IM_API_BASE_URL", "https://api.example.com")
        result = await run_flow(event)
        assert result["status"] == "processed"
        assert fake_table.payload["parsed_content"]["approval"] == "approve"
    await inner()
```

Include `tests/data/sample_feedback_event.json` with `metadata.phone_number_id` and a recent message timestamp (>24h difference) so the context-fetch logic executes.

---

## 8. Setter Agent (Scaffold Only)

1. Copy the shared template.
2. Rename FastAPI title to “Setter Agent”.
3. Leave `graph.py` with TODO comments describing:
   - Inputs (meeting confirmations, scheduling intents).
   - Future nodes (check calendar availability, send scheduling link).
4. Expose `POST /agents/setter/inbound` returning `{"status":"not-yet-implemented"}` to keep integration tests simple.

Document this status in `kapso_middleware` README to avoid hooking it up prematurely.

---

## 9. Integration Steps

1. **Kapso Middleware Routing**
   - Update `.env` with:
     - `ONBOARDING_AGENT_URL`
     - `CAMPAIGN_AGENT_URL`
     - `FEEDBACK_AGENT_URL`
     - `SETTER_AGENT_URL`
   - In the middleware router, branch based on event type:
     ```python
     if event.type == "whatsapp.message.received" and metadata["flow"] == "onboarding":
         await forward(ONBOARDING_AGENT_URL, normalized_event)
     elif metadata["flow"] == "campaign_proposal":
         await forward(CAMPAIGN_AGENT_URL, normalized_event)
     elif metadata["flow"] == "feedback":
         await forward(FEEDBACK_AGENT_URL, normalized_event)
     ```

2. **Investor Match API Hooks**
   - Use existing endpoints for stage updates; no schema changes required.
   - Agents that need stage data can call `/v1/introductions/stage?ownerId=...&targetId=...`.

3. **Cloud Run Deployment**
   ```bash
   cd investor-match-api/services/agents/onboarding_agent
   gcloud run deploy onboarding-agent --source . --set-env-vars SUPABASE_URL=...,SUPABASE_SERVICE_ROLE_KEY=...,KAPSO_API_KEY=...,IM_API_BASE_URL=...
   ```
   Repeat for campaign + feedback agents.

4. **Secrets Management**
   - Store Supabase + Kapso keys in Secret Manager.
   - Mount them as environment variables for each service.

---

## 10. Testing & Validation

1. **Unit Tests**
   - `pytest` inside each agent folder.
   - Mock Kapso + Supabase clients; verify graph nodes produce expected outputs.

2. **Integration Tests**
   - Spin up a local Supabase (Docker `supabase start`) or use Supabase test project.
   - Use `respx` to mock Kapso HTTP endpoints during CI.
   - Add GitHub Actions workflow mirroring `conversation_parser` tests.

3. **Manual QA**
   - Configure Kapso sandbox numbers to hit `kapso_middleware`.
   - Use `curl` to simulate normalized events hitting agent endpoints.
   - Verify Supabase rows are created/updated and responses post to Kapso.

4. **Observability**
   - Emit structured logs per agent (`[OnboardingAgent]`, `[CampaignAgent]`, etc.).
   - Create log-based metrics: `onboarding_messages_processed`, `campaign_proposals_sent`, `feedback_logged`.

5. **Rollback Plan**
   - Each agent is independent; redeploy the previous stable revision via `gcloud run revisions`.
   - Kapso middleware can pause forwarding (feature flag) to disable problematic agents without touching Kapso webhooks.

---

## 11. Open Questions for Future Iterations

1. How will the setter agent coordinate with calendar systems (Calendly, Google Calendar)?
2. Do we need multilingual support? If so, extend prompts and Supabase schema to track preferred language.
3. Should proposals/feedback be exposed via the main API? Consider adding `/v1/campaign/proposals` endpoints once data stabilizes.

Keep this document updated whenever the LangGraph architecture changes.
