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

## Chat UI
Open `http://localhost:8080/chat.html`, send messages; conversationId persists after first send.

## Judge (manual)
```bash
node scripts/run_judge.js --conversation-id <ID> --threshold 0.6
```
Reads conversation/messages from Supabase and calls OpenAI with a rubric; fails if no data.

## Tests
```bash
npm test   # supertest health check
```

## Notes
- Supabase schema (agents, conversations, messages, agent_prompts) is unchanged; agent_prompts is now the source of truth for prompts.
- No fallbacks: missing prompt rows will cause 500s on `/messages`. Add rows in `agent_prompts` for each agent (`onboarding`, `campaign`, `feedback`, `setter`) with `prompt_type='system'`.
