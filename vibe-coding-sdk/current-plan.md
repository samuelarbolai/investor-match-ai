# Investor Match Backend — Current Plan (Template-Aligned)

## Plan Summary
Add conversation state caching so the heavy prompt load + history stitching happens once at conversation start, and persist/flush to Supabase only on explicit end signals. Blend deterministic signals (inactivity, explicit close) with an LLM “tool planner” that selects tools each turn (end-conversation, pick-agent). A default “triage” prompt handles the very first turn before an agent is picked. Keep parser gating and retries intact.

Status note: work in progress — investigating Supabase agent lookup and parser URL env issues; master-agent at version 1.0.2; next session continue debugging deployment/env and confirm prompts/agents exist.

## Plan Architecture (Flow)
1) Startup guard: master-agent process refuses to start if `PARSER_URL` is absent (except tests).  
2) Observability: request/startup logs include package version and revision to confirm the running build, and parser proxy uses the configured endpoint.  
3) Conversation reuse: master-agent reuses existing conversations per agent+phone and handles unique-key races gracefully.  
4) Parser gating: parser is invoked only for onboarding flows after the agent explicitly signals completion in its reply.  
5) Parser resiliency: parser adds idempotent key, timeout, retries, and payload normalization (`company_name` → `name`) when calling the Investor Match API.  
6) Conversation caching: cache prompt + conversation state in-process for the active conversation to avoid reloading every turn; Supabase remains source of truth (reload on cache miss), and we flush/persist to Supabase when a conversation end event is detected.  
7) Tool planner: per-turn LLM that sees the same context as the chat LLM and picks tools (`end_conversation`, `pick_agent`); deterministic signals (inactivity, explicit close) run alongside.  
8) Default triage prompt: before any agent is picked, use a neutral prompt to learn intent and gather clues for agent selection.  
9) Documentation: record the env requirement, gating, resiliency, caching/end rules, and tool planner behavior.

## Plan Structure (Directories & Files)
- App bootstrap/logging: `services/agents/master_agent/server.js`.  
- Parser proxy: `services/agents/master_agent/routes/parser.js`.  
- Conversation reuse + tests: `services/agents/master_agent/routes/inbound.js`, `services/agents/master_agent/lib/state.js`, `services/agents/master_agent/tests/inbound.test.js`.  
- Parser resiliency: `services/conversation_parser/app/services.py`.  
- Caching/end signals: `services/agents/master_agent/routes/inbound.js`, `services/agents/master_agent/lib/state.js` (flush), `services/agents/master_agent/lib/cache.js` (new).  
- Tool planner: `services/agents/master_agent/lib/tools.js` (tool definitions), `services/agents/master_agent/lib/tool-planner.js` (LLM tool selector).  
- Prompts (Supabase seed needed): default triage prompt + agent system prompts (`onboarding` already exists; add `campaign`, `feedback`, `setter`).  
- Agent context/docs: `vibe-coding-sdk/context-for-code-agent.md`, `services/agents/master-agent-bootcamp.md`.

## Modifications (phased, with file targets)
### Phase 1 – Guard + logging
- Add startup check for `PARSER_URL` (skip only in tests) and include `version`/`revision` in per-request and startup logs.

### Phase 2 – Parser proxy alignment
- Require configured parser URL in `/parser` proxy (remove silent fallback).

### Phase 3 – Conversation reuse
- Reuse existing conversations per agent+phone; handle unique constraint races; add regression test.

### Phase 4 – Parser gating
- Trigger parser only when onboarding replies explicitly signal completion; skip otherwise.

### Phase 5 – Parser resiliency
- Add idempotent key, timeout, retry/backoff, and payload normalization (e.g., `company_name` → `name`) when parser calls Investor Match API to avoid transient failures and validation errors.

### Phase 6 – Conversation caching + end signals
- Implement an in-memory cache (map) keyed by `conversationId`:
  - Store: `prompt`, `promptVersion`, `agentId`, `agentSlug`, `phoneNumber`, `ownerId`, `contactId`, `messages` (array of `{ role, content, sequence, metadata }`), `lastTouchedAt`, `parserSentAt` (optional), `status` (`active`/`closed`).
  - TTL: evict entries if inactive > 30m (configurable).
  - Priming: on first inbound (no cache entry), fetch prompt + conversation/messages from Supabase, populate cache, and continue as today.
  - Hot path: on subsequent messages, reuse cached prompt + messages, append user/assistant turns in cache, and delay DB writes.
- End signals (trigger flush + optional parser):
  - Onboarding completion phrase (existing detector).
  - User goodbye intent (e.g., “bye”, “thanks, bye”, “good night”, “talk later”).
  - Inactivity timeout (no messages for >30m): flush on next touch or via periodic sweep.
  - Explicit agent/system close intent (e.g., assistant reply contains “conversation closed”, “ending now”).
  - Terminal errors (LLM/parser fatal error): flush and close to avoid data loss.
  - Flush logic:
    - Persist: upsert conversation (ensure IDs match) and insert any cached messages not yet persisted (track `persistedSequence` to know the last stored message).
    - Call parser if onboarding completion was reached and parser not already sent for this conversation state (guard with `parserSentAt` timestamp).
    - Clear cache entry after successful flush/close.
  - Tests:
    - Parser is not called before end signals; called after onboarding completion.
    - Cache reuse: second message avoids prompt reload (verify prompt loader called once).
    - Flush on goodbye intent and inactivity timeout.
    - Messages persisted correctly with sequences on flush.

### Phase 7 – Tool planner (LLM tools + deterministic signals)
- Introduce a per-turn “tool planner” LLM (separate cheap model with a tiny prompt) that receives the same transcript/context as the chat LLM and returns which tool to run (or none). Tools:  
  - `pick_agent`: decide which agent prompt to load (`onboarding`, `campaign`, `feedback`, `setter`). Uses a default triage prompt before selection.  
  - `end_conversation`: signal to flush + close (can also trigger parser if onboarding done).  
- Deterministic signals remain in parallel: inactivity timeout, explicit close phrases, hard errors.
- Wire inbound flow to:  
  1) Ensure cache entry exists (prime if new).  
  2) Run tool planner with transcript + metadata.  
  3) If tool output is `pick_agent` and no agent chosen yet, switch agent prompt in cache.  
  4) If tool output is `end_conversation`, flush/close.  
  5) Then run chat LLM with the (possibly updated) agent prompt, append messages to cache, and apply end signals.  
- Keep parser gating: only call parser when onboarding is complete (completion phrase) AND end conditions or explicit send.

#### Planned code changes (by file)

`services/agents/master_agent/lib/cache.js` (new)
```js
const CACHE_TTL_MS = parseInt(process.env.CACHE_TTL_MS || '1800000', 10); // 30m default
const store = new Map();

export function getCached(id) { /* TTL check */ }
export function setCached(id, data) { /* store with lastTouchedAt */ }
export function touch(id) { /* update lastTouchedAt */ }
export function deleteCached(id) { store.delete(id); }
export function sweep() { /* evict stale entries */ }
```

`services/agents/master_agent/lib/state.js` (augment)
```js
export async function upsertConversation(convo) { /* insert or update by id */ }
export async function insertMessagesBulk(messages) { /* bulk insert new messages */ }
```

`services/agents/master_agent/lib/tools.js` (new)
```js
export const TOOL_DEFS = [
  {
    name: 'pick_agent',
    description: 'Choose the best agent based on user intent: onboarding vs campaign vs feedback vs setter.',
    schema: { type: 'object', properties: { agent: { enum: ['onboarding','campaign','feedback','setter'] } }, required: ['agent'] }
  },
  {
    name: 'end_conversation',
    description: 'Signal that the conversation is complete or should be closed (goodbye, task done, or onboarding finished).',
    schema: { type: 'object', properties: { reason: { type: 'string' } }, required: ['reason'] }
  }
];
```

`services/agents/master_agent/lib/tool-planner.js` (new)
```js
import OpenAI from 'openai';
import { TOOL_DEFS } from './tools.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_TOOL_MODEL || 'gpt-4o-mini';

export async function planTools({ transcript, metadata, agentSlug, hasAgent }) {
  const messages = [
    { role: 'system', content: 'You are a tool selector. Return at most one tool call: pick_agent or end_conversation. If no tool needed, return none.' },
    { role: 'user', content: JSON.stringify({ transcript, metadata, agentSlug, hasAgent }) },
  ];
  const res = await client.chat.completions.create({
    model: MODEL,
    messages,
    tools: TOOL_DEFS.map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.schema
      }
    })),
  });
  const choice = res.choices?.[0];
  const toolCall = choice?.message?.tool_calls?.[0];
  if (!toolCall) return null;
  return { name: toolCall.function.name, args: JSON.parse(toolCall.function.arguments || '{}') };
}
```

`services/agents/master_agent/routes/inbound.js`
- Prime cache (as in Phase 6), but add:
  - Default triage prompt if no agent chosen yet (new Supabase row `agent_name=default_triage`, `prompt_type=system`).
  - Run `planTools` before chat; if it returns `pick_agent`, set `cache.agentSlug` and load that prompt into cache. If `end_conversation`, flush/close immediately.
- After chat reply, still evaluate end signals (completion phrase, goodbye intent, explicit close). Parser call stays gated on onboarding completion and not already sent.
- Ensure cached `prompt` reflects the chosen agent after `pick_agent` tool.

`services/agents/master_agent/tests/*`
- Add tests to validate:
  - Tool planner output triggers agent switch (mocked `planTools` to return `pick_agent` → prompt loader called for new agent, not for onboarding).
  - `end_conversation` tool triggers flush and cache eviction.
  - Deterministic inactivity still flushes when planner returns null.

Prompts (Supabase)
- Need system prompts for: `default_triage`, `campaign`, `feedback`, `setter` in `agent_prompts` (existing `onboarding` stays). We cannot seed without Supabase creds in this environment; provide SQL/JSON seed instructions separately.

### Phase 8 – Docs
- Update agent context and bootcamp to explain caching, end-of-conversation signals (LLM tool + deterministic), and agent selection via tool planner and default triage prompt.

#### Planned code changes (by file)

`services/agents/master_agent/lib/cache.js` (new)
```js
const CACHE_TTL_MS = parseInt(process.env.CACHE_TTL_MS || '1800000', 10); // 30m default
const store = new Map();

export function getCached(id) {
  const entry = store.get(id);
  if (!entry) return null;
  if (Date.now() - entry.lastTouchedAt > CACHE_TTL_MS) {
    store.delete(id);
    return null;
  }
  return entry;
}

export function setCached(id, data) {
  store.set(id, { ...data, lastTouchedAt: Date.now() });
}

export function touch(id) {
  const entry = store.get(id);
  if (entry) entry.lastTouchedAt = Date.now();
}

export function deleteCached(id) {
  store.delete(id);
}

export function sweep() {
  const now = Date.now();
  for (const [id, entry] of store.entries()) {
    if (now - entry.lastTouchedAt > CACHE_TTL_MS) {
      store.delete(id);
    }
  }
}
```

`services/agents/master_agent/lib/state.js` (augment)
```js
// add upsert and bulk insert helpers for flush
export async function upsertConversation(convo) { /* insert or update by id */ }
export async function insertMessagesBulk(messages) { /* insert array with conflict ignore on id or sequence */ }
```

`services/agents/master_agent/routes/inbound.js`
- Prime cache on first request:
```js
let cache = getCached(conversationId);
if (!cache) {
  // load prompt, agent, conversation, messages
  cache = {
    conversationId: conversation.id,
    agentId: agent?.id || null,
    agentSlug,
    prompt: systemPrompt,
    promptVersion,
    phoneNumber: event.phoneNumber,
    ownerId: event.ownerId,
    contactId: event.contactId,
    messages: history, // from DB
    persistedSequence: history.length ? Math.max(...history.map(m => m.sequence)) : 0,
    parserSentAt: null,
    status: 'active',
    lastTouchedAt: Date.now(),
  };
  setCached(conversation.id, cache);
}
```
- Use cached prompt/history on subsequent requests:
```js
const history = cache.messages;
const systemPrompt = cache.prompt;
```
- Append messages to cache (no immediate DB write):
```js
const seq = (cache.messages[cache.messages.length - 1]?.sequence || 0) + 1;
cache.messages.push({ role: 'user', content, sequence: seq, metadata: event.metadata || null });
// after LLM
cache.messages.push({ role: 'assistant', content: reply, sequence: seq + 1 });
touch(cache.conversationId);
```
- End-signal detection:
```js
const isOnboardingComplete = onboardingComplete(reply);
const isGoodbye = isGoodbyeIntent(content, reply);
const isCloseIntent = agentCloseIntent(reply);
const isInactive = Date.now() - cache.lastTouchedAt > INACTIVITY_MS; // checked in sweep or on touch
const shouldFlush = isOnboardingComplete || isGoodbye || isCloseIntent;
```
- Flush function (same file or helper):
```js
async function flushConversation(cacheEntry, { forceParser }) {
  await upsertConversation({...}); // ensure conversation row is current
  const newMessages = cacheEntry.messages.filter(m => m.sequence > cacheEntry.persistedSequence);
  if (newMessages.length) await insertMessagesBulk(newMessages.map(m => ({ ...m, conversation_id: cacheEntry.conversationId })));
  cacheEntry.persistedSequence = cacheEntry.messages[cacheEntry.messages.length - 1]?.sequence || cacheEntry.persistedSequence;
  if (forceParser || isOnboardingComplete) { /* call parser if not already sent; set parserSentAt */ }
  deleteCached(cacheEntry.conversationId);
}
```
- Parser call guard:
```js
if (parserUrl && isOnboardingComplete && !cache.parserSentAt) {
  // build transcript from cache.messages and call parser; set parserSentAt = Date.now()
}
```
- Inactivity sweep (cron-like):
```js
setInterval(async () => {
  for (const entry of store.values()) {
    if (Date.now() - entry.lastTouchedAt > INACTIVITY_MS) {
      await flushConversation(entry, { forceParser: false });
    }
  }
}, SWEEP_INTERVAL_MS);
```

`services/agents/master_agent/tests/*`
- Add tests that:
  - Mock prompt loader and ensure it’s called once when two messages arrive in same conversation.
  - Verify parser not called before completion phrase; called after.
  - Verify flush on goodbye intent triggers insert bulk.
  - Verify cache eviction on inactivity (simulate time jump).

### Phase 7 – Docs
- Update agent context and bootcamp to explain caching, end-of-conversation signals, and when Supabase is flushed.

## Notes / Confirmed Inputs
- Expected ingestion path: master-agent → conversation_parser → investor-match-api → Firestore.  
- Caching goal: reduce prompt/history reload per turn; persist only on end signals.  
- End signals: onboarding completion (LLM tool + phrase check), goodbye intent (LLM tool + phrase check), inactivity timeout, explicit close intent, or terminal errors.  
- Parser call still gated by onboarding completion; retries and idempotency remain.
