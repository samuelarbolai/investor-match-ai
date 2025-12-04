# Investor Match Backend — Current Plan (Template-Aligned)

## Plan Summary
Fix missing Firestore contacts by ensuring the master-agent always forwards conversations to the conversation_parser: make `PARSER_URL` mandatory at startup, surface version/revision in logs, and update docs so deployments configure the parser endpoint.

## Plan Architecture (Flow)
1) Startup guard: master-agent process refuses to start if `PARSER_URL` is absent (except tests).  
2) Observability: request/startup logs include package version and revision to confirm the running build, and parser proxy uses the configured endpoint.  
3) Documentation: record the env requirement and flow so deploys include the parser URL.

## Plan Structure (Directories & Files)
- App bootstrap/logging: `services/agents/master_agent/server.js`.  
- Parser proxy: `services/agents/master_agent/routes/parser.js`.  
- Agent context/docs: `vibe-coding-sdk/context-for-code-agent.md`.

## Modifications (phased, with file targets)
### Phase 1 – Guard + logging
- Add startup check for `PARSER_URL` (skip only in tests) and include `version`/`revision` in per-request and startup logs.

### Phase 2 – Parser proxy alignment
- Require configured parser URL in `/parser` proxy (remove silent fallback).

### Phase 3 – Docs
- Update agent context to note the required parser env and startup guard for ingestion.

## Notes / Confirmed Inputs
- Expected ingestion path: master-agent → conversation_parser → investor-match-api → Firestore.  
- Current issue: `PARSER_URL` missing in deployed master-agent, so parser never called and contacts stay out of Firestore.  
- Logging should help verify the deployed revision matches the latest build.
