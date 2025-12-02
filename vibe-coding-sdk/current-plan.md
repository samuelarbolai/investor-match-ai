# Investor Match Backend — Current Plan (Template-Aligned)

## Plan Summary
Rebuild `services/agents/master_agent` in JavaScript (Node/Express-style) using the chat-agent-api pattern from `Documents/30X/chat-agent-api`, removing langgraph and old Python flow code but preserving Supabase client/schema, `.env`, and LLM-as-judge (to rewire later). Deliver a bootcamp-style, copy/paste-ready guide.

## Plan Architecture (Flow)
1) State: Supabase holds conversations/messages; service loads prior messages + system prompt and streams LLM reply; writes user/assistant messages back; updates conversation meta.  
2) API: Node/Express (or minimal server) with routes: `POST /messages` (send message, auto-create conversation), `GET /conversations/:id/messages`, optional `GET /conversations`.  
3) LLM: OpenAI (env-driven model); assemble `[system, history..., user]`; stream response; log AI events to Supabase.  
4) Judge: keep existing LLM-as-judge module; rewire later to new message store.

## Plan Structure (Directories & Files)
- New service skeleton in `services/agents/master_agent` (JS):  
  - `server.js` (Express app)  
  - `routes/messages.js`, `routes/conversations.js`  
  - `lib/supabase.js` (reuse env + client)  
  - `lib/prompt.js` (onboarding system prompt)  
  - `lib/llm.js` (OpenAI client + stream helper)  
  - `lib/state.js` (conversation/message CRUD, sequence, meta)  
- Preserve: `.env` files, `app/clients/supabase.py` (for reference), Supabase schema.  
- Remove/ignore: langgraph-specific files (`app/graph*.py`, `app/flows/*`, `app/evals/run_onboarding_judge.py` wiring will be adapted later), dev configs for langgraph.

## Modifications (phased, with file targets)
### Phase 1 – Scaffold JS service (replace Python/langgraph)
- Add `server.js`:
```js
import express from 'express';
import messagesRouter from './routes/messages.js';
import conversationsRouter from './routes/conversations.js';
const app = express();
app.use(express.json());
app.use('/messages', messagesRouter);
app.use('/conversations', conversationsRouter);
app.get('/health', (_req, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 8080, () => console.log('master-agent listening'));
export default app;
```
- Add `lib/supabase.js` (reuse env):
```js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase creds missing');
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```
- Add `lib/prompt.js` with onboarding system prompt (ported from chat-agent-api style, but tailored to onboarding fields).
- Add `lib/llm.js`:
```js
import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function streamChat(messages, model = process.env.OPENAI_MODEL || 'gpt-4o-mini') {
  return client.chat.completions.create({ model, messages, stream: true });
}
```
- Add `lib/state.js`:
```js
import { supabase } from './supabase.js';

export async function getConversationById(id) {
  const { data, error } = await supabase.from('conversations').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
export async function createConversation({ agentSlug, title, promptVersion }) {
  const { data, error } = await supabase.from('conversations').insert({
    agent_id: null, external_conversation_id: null, phone_number: null,
    title, prompt_version: promptVersion, created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    agent_slug: agentSlug,
  }).select('*').single();
  if (error) throw error;
  return data;
}
export async function listMessages(conversationId) {
  const { data, error } = await supabase.from('messages')
    .select('role,content,sequence,metadata')
    .eq('conversation_id', conversationId)
    .order('sequence', { ascending: true });
  if (error) throw error;
  return data || [];
}
export async function insertMessage({ conversationId, role, content, sequence, metadata }) {
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    role, content, sequence,
    metadata: metadata || null,
    created_at: new Date().toISOString(),
  });
  if (error) throw error;
}
export async function nextSequence(conversationId) {
  const { data, error } = await supabase.from('messages')
    .select('sequence').eq('conversation_id', conversationId)
    .order('sequence', { ascending: false }).limit(1);
  if (error) throw error;
  const current = data && data[0] ? data[0].sequence : 0;
  return (current || 0) + 1;
}
```
- Add `routes/messages.js` (core flow):
```js
import express from 'express';
import { supabase } from '../lib/supabase.js';
import { getConversationById, createConversation, listMessages, insertMessage, nextSequence } from '../lib/state.js';
import { streamChat } from '../lib/llm.js';
import { onboardingPrompt } from '../lib/prompt.js';

const router = express.Router();
router.post('/', async (req, res) => {
  try {
    const { conversationId, content } = req.body || {};
    if (!content || typeof content !== 'string' || !content.trim()) return res.status(400).json({ error: 'Message content is required.' });
    let convo = conversationId ? await getConversationById(conversationId) : null;
    if (!convo) {
      convo = await createConversation({ agentSlug: 'onboarding', title: content.slice(0, 80), promptVersion: 'v1' });
    }
    const history = await listMessages(convo.id);
    const seq = await nextSequence(convo.id);
    await insertMessage({ conversationId: convo.id, role: 'user', content: content.trim(), sequence: seq });
    const assembled = [
      { role: 'system', content: onboardingPrompt },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: content.trim() },
    ];
    const stream = await streamChat(assembled);
    const chunks = [];
    for await (const part of stream) {
      const delta = part.choices?.[0]?.delta?.content;
      if (delta) chunks.push(delta);
    }
    const reply = chunks.join('');
    const replySeq = seq + 1;
    await insertMessage({ conversationId: convo.id, role: 'assistant', content: reply, sequence: replySeq });
    await supabase.from('conversations').update({ updated_at: new Date().toISOString(), last_message_at: new Date().toISOString() }).eq('id', convo.id);
    return res.json({ conversationId: convo.id, reply });
  } catch (err) {
    console.error('messages error', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
});
export default router;
```
- Add `routes/conversations.js`:
```js
import express from 'express';
import { getConversationById, listMessages } from '../lib/state.js';
const router = express.Router();
router.get('/:id', async (req, res) => {
  try {
    const convo = await getConversationById(req.params.id);
    const messages = await listMessages(req.params.id);
    res.json({ conversation: convo, messages });
  } catch (err) {
    res.status(404).json({ error: 'Conversation not found' });
  }
});
export default router;
```
- package.json snippet (add to master_agent):
```json
{
  "type": "module",
  "scripts": { "dev": "node server.js" },
  "dependencies": {
    "express": "^4.19.2",
    "@supabase/supabase-js": "^2.45.0",
    "openai": "^4.57.0",
    "dotenv": "^16.4.5"
  }
}
```

### Phase 2 – Remove/retire langgraph Python code
- Archive or delete: `app/graph.py`, `app/graph_entry.py`, `app/graph_wrapper.py`, `app/flows/*`, `app/evals/run_onboarding_judge.py` wiring (judge kept for later), langgraph configs.  
- Keep `.env`, `app/clients/supabase.py` (for reference), and Supabase schema.

### Phase 3 – Tests/smoke
- Add minimal Jest or supertest-based checks (JS) for `/messages`:
```bash
PORT=8080 SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... OPENAI_API_KEY=... npm test
```
- Smoke: `node server.js` then `curl -X POST localhost:8080/messages -H "Content-Type: application/json" -d '{"content":"Hi, I am Alex"}'`

### Phase 4 – Judge rewire (later)
- Add JS judge script that reads Supabase conversations/messages and calls OpenAI with a rubric; keep Python judge for reference until superseded.

## Testing Phase (per change set)
- JS service: add Jest/supertest for `/messages` (happy path + missing content).  
- Smoke locally with real Supabase/LLM: `node server.js` + `curl` above.  
- Judge: `node scripts/run_judge.js --conversation-id <id> --threshold 0.6` (reads from Supabase; OpenAI model from `ONBOARDING_JUDGE_MODEL` or `OPENAI_MODEL`).

## Update READMEs (per service)
- Master agent: add README explaining the new JS service, routes, env vars, Supabase expectations, and how state is loaded (system prompt + full history + new user message). Note that LLM judge exists but will be rewired later.

## Specification of what should not be modified (for this plan)
- Do not change Supabase schema or `.env` contents.  
- Do not remove `app/clients/supabase.py` (reference) or LLM judge files; they will be rewired later.  
- Do not touch other services in the repo.

## Ready-to-use snippets (copy/paste)
- Install deps (inside `services/agents/master_agent`):
```bash
npm install express @supabase/supabase-js openai dotenv
```
- Start server:
```bash
node server.js
```
- Send a message:
```bash
curl -X POST http://localhost:8080/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"Hi, I am Alex"}'
```
- Run judge:
```bash
node scripts/run_judge.js --conversation-id <CONVO_ID> --threshold 0.6
```

## Current Priorities
1) Scaffold JS service (server, routes, lib helpers) using chat-agent-api pattern.  
2) Remove langgraph/Python flow files; preserve Supabase client/env/schema.  
3) Add minimal tests and smoke with real Supabase/LLM.  
4) Plan rewire of judge after JS service is live.

## Status
- JS master_agent deployed/configured with Kapso routes, Supabase prompt loader, parser integration, and version logging.
- Conversation parser prompt loader now requires `agent_prompts` entries (system/user) and fails fast; Supabase creds added to `.env`.
- Docs + readmes updated to reflect the new stack; tests (health) pass and final E2E was recorded.
