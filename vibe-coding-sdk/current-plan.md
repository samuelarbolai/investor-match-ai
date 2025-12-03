# Investor Match Backend — Current Plan (Template-Aligned)

## Plan Summary
Add backend support to exclude contacts by tag so frontend can omit `coverage`/`test` (or any provided tags) across all contact list and match endpoints, only when `exclude_tags` is provided.

## Plan Architecture (Flow)
1) Contract: add `exclude_tags` input to endpoints; contacts store a single `tag` string (e.g., `coverage`, `test`).  
2) Validation: extend Joi schemas to accept `exclude_tags` where applicable.  
3) Logic: filter out contacts whose `tag` matches any `exclude_tags` in list and match flows.  
4) Docs/Tests: update Swagger blocks and add unit tests for exclusion.

## Plan Structure (Directories & Files)
- Validators: `services/investor-match-api/src/validators/contact.validator.ts` (query/body schemas for list/filter/match).  
- Handlers: `services/investor-match-api/src/handlers/contact.handler.ts` (`GET /v1/contacts`, `POST /v1/contacts/filter`, `GET /v1/contacts/{id}/matches`, plus campaign contacts if present).  
- Services: `services/investor-match-api/src/services/matching.service.ts` (filtering/matching logic).  
- Docs: Swagger JSDoc blocks in handlers (or `src/config/swagger.ts` if centralized).  
- Tests: extend/add unit tests near matching service/handlers.

## Modifications (phased, with file targets)
### Phase 1 – Contract
- Add optional `exclude_tags` (array of strings) to request contract for all contact list/match endpoints.  
- Clarify tags model: use `tag` string on contact docs; exclusion checks `contact.tag` against provided values.

### Phase 2 – Validation
- Update relevant Joi schemas to accept optional `exclude_tags` array (query or body per endpoint).

### Phase 3 – Logic
- In list/filter/match flows, skip any contact whose `tag` is in `exclude_tags`.  
- Apply to all endpoints returning contact lists/matches (including campaign contacts if handler exists).

### Phase 4 – Docs & Tests
- Update Swagger blocks with `exclude_tags` parameter examples.  
- Add/extend unit tests to cover exclusion in filter/matching.

## Notes / Confirmed Inputs
- Endpoints: all should support exclusion.  
- Behavior: only exclude when `exclude_tags` is provided (no default exclusion).  
- Matches: exclusion applies to candidates in matches.  
- Tag model: contacts carry single `tag` string (e.g., `coverage`, `test`).
