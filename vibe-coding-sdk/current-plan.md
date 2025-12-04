# Investor Match Backend — Current Plan (Template-Aligned)

## Plan Summary
Fix ingestion gaps by enforcing parser forwarding from master-agent and hardening parser → API calls: require `PARSER_URL` at startup, log version/revision, reuse conversations by agent+phone, and add idempotent retries + timeouts on parser calls to the Investor Match API.

## Plan Architecture (Flow)
1) Startup guard: master-agent process refuses to start if `PARSER_URL` is absent (except tests).  
2) Observability: request/startup logs include package version and revision to confirm the running build, and parser proxy uses the configured endpoint.  
3) Conversation reuse: master-agent reuses existing conversations per agent+phone and handles unique-key races gracefully.  
4) Parser resiliency: parser adds idempotent key, timeout, and retries when calling the Investor Match API to reduce transient failures.  
5) Documentation: record the env requirement and flow so deploys include the parser URL.

## Plan Structure (Directories & Files)
- App bootstrap/logging: `services/agents/master_agent/server.js`.  
- Parser proxy: `services/agents/master_agent/routes/parser.js`.  
- Conversation reuse + tests: `services/agents/master_agent/routes/inbound.js`, `services/agents/master_agent/lib/state.js`, `services/agents/master_agent/tests/inbound.test.js`.  
- Parser resiliency: `services/conversation_parser/app/services.py`.  
- Agent context/docs: `vibe-coding-sdk/context-for-code-agent.md`.

## Modifications (phased, with file targets)
### Phase 1 – Guard + logging
- Add startup check for `PARSER_URL` (skip only in tests) and include `version`/`revision` in per-request and startup logs.

### Phase 2 – Parser proxy alignment
- Require configured parser URL in `/parser` proxy (remove silent fallback).

### Phase 3 – Conversation reuse
- Reuse existing conversations per agent+phone; handle unique constraint races; add regression test.

### Phase 4 – Parser resiliency
- Add idempotent key, timeout, and retry/backoff when parser calls Investor Match API to avoid transient 500s.

### Phase 5 – Docs
- Update agent context to note the required parser env, startup guard, and resiliency steps for ingestion.

## Notes / Confirmed Inputs
- Expected ingestion path: master-agent → conversation_parser → investor-match-api → Firestore.  
- Current issue: missing parser URL previously blocked forwarding; remaining risk was parser timeouts hitting the API (now mitigated with retries/idempotency/timeout).  
- Logging should help verify the deployed revision matches the latest build.
