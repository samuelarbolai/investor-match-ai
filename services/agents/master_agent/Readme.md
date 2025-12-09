# Master Agent (Node/Express) — Supabase Prompt–Backed

Rebuilt master_agent as a Node/Express service. Loads system prompts from Supabase (`agent_prompts`), stores conversations/messages in Supabase, and exposes a simple REST + chat UI.

## Stack
- Node 18+, Express
- Supabase JS client
- OpenAI SDK

## Endpoints
- `GET /health` — health check.
- `POST /messages` — send a message; body: `{ "content": "Hi", "conversationId": "<optional>", "agentSlug": "<optional, default onboarding>" }`. Returns `{ conversationId, reply }`.
- `GET /conversations/:id` — fetch conversation + messages.
- Static chat UI: `/chat.html` (served from `public/`).
- `/agents/whatsapp/inbound` — normalized Kapso-style ingress; triggers chat reply and (when conditions are met) parser handoff.

## Prompt loading (fail hard)
- Reads from Supabase table `agent_prompts` with columns: `agent_name`, `prompt_type`, `language`, `content`, `updated_at`.
- For `/messages`, it loads the latest row where `agent_name = <agentSlug>` and `prompt_type = 'system'` (no fallback). If missing, the request fails.

## Setup
```bash
cd services/agents/master_agent
npm install
node server.js
```
Env required in `.env` (preserved):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- Optional: `OPENAI_MODEL` (default `gpt-4o-mini`), `PORT` (default 8080)
- `PARSER_URL` (required in non-test env): endpoint of conversation_parser; process fails fast if missing. Parser is invoked only when onboarding is complete (see below).

## Chat UI
Open `http://localhost:8080/chat.html`, send messages; conversationId persists after first send.

## Judge (manual)
```bash
node scripts/run_judge.js --conversation-id <ID> --threshold 0.6
```
Reads conversation/messages from Supabase and calls OpenAI with a rubric; fails if no data.

## Tests
```bash
npm test                      # run all tests
npm test -- inbound.test.js  # run inbound tests (includes race condition test)
```

### Test Coverage
- **Health check**: basic endpoint validation
- **Conversation reuse**: verifies existing conversations are found correctly
- **Parser gating**: confirms parser is only called when onboarding completes
- **Race condition handling**: validates concurrent requests with same agent+phone don't cause duplicate key errors

## Notes
- Supabase schema (agents, conversations, messages, agent_prompts) is unchanged; agent_prompts is now the source of truth for prompts.
- No fallbacks: missing prompt rows will cause 500s on `/messages`. Add rows in `agent_prompts` for each agent (`onboarding`, `campaign`, `feedback`, `setter`) with `prompt_type='system'`.
- Parser handoff is gated: parser is called only when `flow=onboarding` AND the agent's reply explicitly signals completion (phrases like "onboarding is complete", "all information has been gathered", "all set with your details", etc.). Otherwise parser is skipped.
- Tool planner + cache: a lightweight tool-planner LLM decides per turn whether to pick an agent or end the conversation; a per-instance cache keeps prompt/history hot and defers DB writes, flushing to Supabase on end signals (completion, goodbye/close, or explicit tool).
- Agent lookup now resolves by `agent_name`/`name`/`slug` to match Supabase schema (if you only have `agent_name`, it will still find the agent).

## Recent Changes

### Race Condition Fix (2025-12-09)
**Problem**: Concurrent webhook requests for the same `agent_id` + `phone_number` caused duplicate key violations on the unique constraint `conversations_agent_id_phone_number_key`.

**Solution**: Replaced check-then-insert pattern with atomic upsert:
- Added `upsertConversationByAgentAndPhone()` in `lib/state.js`
- Updated `routes/inbound.js` to use upsert instead of `createConversation()` with error recovery
- Database now handles conflicts atomically, eliminating race conditions

**Logging improvements**:
- Added structured logging with request IDs for complete request tracing
- `[conversation-upsert]`, `[conversation-upserted]` - track upsert operations
- `[parser-decision]`, `[parser-calling]`, `[parser-success]`, `[parser-skipped]` - detailed parser flow visibility
- `[cache-hit]`, `[cache-miss]` - cache state tracking
- `[agent-switch]` - agent transitions via tool planner
- `[race-detected]` removed (no longer occurs with upsert)

**Files modified**:
- `lib/state.js`: Added `upsertConversationByAgentAndPhone()`
- `routes/inbound.js`: Replaced race-prone conversation creation logic, added comprehensive logging
- `tests/inbound.test.js`: Added concurrent request test to verify fix
