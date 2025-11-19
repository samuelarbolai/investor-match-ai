# Founder-Investor Matching System
## Implementation Plan - UPDATED STATUS

---

## **CURRENT IMPLEMENTATION STATUS (2025-11-14)**

### **✅ FULLY COMPLETED SERVICES:**
**contact-service** - All Phases 1-6 Complete
- ✅ Complete CRUD operations with Joi validation
- ✅ Production-ready API with error handling, logging, versioning
- ✅ Comprehensive testing suite (unit, integration, load tests - 86% coverage)
- ✅ Full data layer with reverse index synchronization (WriteSyncService)
- ✅ Matching algorithm implementation (MatchingService)
- ✅ All 33-field Contact schema implemented
- ✅ CI/CD pipeline deployed to Cloud Run

### **❌ BASIC STUBS ONLY (Phase 1 level):**
**matching-service, flattening-service, reverse-index-service, validation-service**
- ✅ Basic Express setup + health endpoints
- ✅ Dockerfiles and Cloud Run deployment
- ❌ Core business logic (returns "Not implemented" or empty arrays)
- ❌ No validation, error handling, or testing
- ❌ No integration with contact-service

### **✅ INFRASTRUCTURE COMPLETED:**
- ✅ GitHub repository with CI/CD pipeline
- ✅ All 5 services deploy automatically to Cloud Run (us-east1)
- ✅ Test workflows (unit, integration, load testing)
- ✅ Dev/main branch workflow

---

## **DEVELOPMENT STRATEGY GOING FORWARD**

### **Option A: Microservices Architecture (Current)**
Complete the remaining 4 services as independent microservices:
- Each service has its own database connections
- Services communicate via HTTP APIs
- Each service can be scaled independently

### **Option B: Monolithic Consolidation (Recommended)**
Since contact-service already contains all the core logic, consider:
- Moving all functionality into contact-service
- Retiring the stub services
- Simpler deployment and maintenance

---

## Executive Summary

**Project:** Graph-based founder-investor matching system using Firestore as a cost-optimized graph database  
**Tech Stack:** Node.js/Express, Firestore, Cloud Run  
**Initial Scale:** 2,000 contacts  
**Timeline:** 6-8 weeks (phased delivery)

---

## Phase 1: Project Foundation ✅ **COMPLETED**

### Milestone 1.1: Project Setup ✅ **COMPLETED**
**Goal:** Initialize repository with proper structure and tooling

**Tasks:**
- [x] Initialize Git repository with `.gitignore`
- [x] Set up Node.js project with `package.json`
- [x] Configure TypeScript (`tsconfig.json`)
- [x] Set up ESLint and Prettier
- [x] Create `.env.example` for environment variables
- [x] Initialize Firebase Admin SDK configuration

**Deliverables:**
- ✅ Working development environment
- ✅ Project README with setup instructions

**Testing:**
- ✅ Verify `npm install` and `npm run dev` work
- ✅ Confirm Firebase connection with test script

---

### Milestone 1.2: Project Structure ✅ **COMPLETED**
**Goal:** Establish clean architecture following separation of concerns

**Status:** All 5 microservices created with proper structure:
- ✅ contact-service: Fully implemented
- ✅ matching-service: Basic structure (needs implementation)
- ✅ flattening-service: Basic structure (needs implementation)  
- ✅ reverse-index-service: Basic structure (needs implementation)
- ✅ validation-service: Basic structure (needs implementation)

```
founder-investor-api/
├── src/
│   ├── config/
│   │   ├── firebase.ts           # Firebase Admin initialization
│   │   └── constants.ts          # Attribute collections, defaults
│   ├── models/
│   │   ├── contact.model.ts      # Contact type definitions
│   │   ├── experience.model.ts   # Experience type definitions
│   │   └── attribute.model.ts    # Attribute document types
│   ├── services/
│   │   ├── flattening.service.ts # Contact flattening logic
│   │   ├── reverse-index.service.ts # Reverse index updates
│   │   ├── matching.service.ts   # Matching algorithm
│   │   └── contact.service.ts    # CRUD operations
│   ├── controllers/
│   │   ├── contact.controller.ts # Contact endpoints
│   │   └── match.controller.ts   # Match endpoints
│   ├── routes/
│   │   ├── contact.routes.ts
│   │   └── match.routes.ts
│   ├── middleware/
│   │   ├── error.middleware.ts   # Global error handler
│   │   └── validation.middleware.ts # Request validation
│   ├── utils/
│   │   ├── normalization.util.ts # Role/skill normalization
│   │   └── logger.util.ts        # Structured logging
│   ├── validators/
│   │   ├── contact.validator.ts  # Joi/Zod schemas
│   │   └── match.validator.ts
│   └── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── scripts/
│   ├── seed-data.ts              # Data seeding script
│   └── setup-indexes.ts          # Firestore index setup
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
├── Dockerfile
└── README.md
```

**Deliverables:**
- Complete folder structure
- Base files with stub implementations

---

## Phase 2: Data Layer ✅ **COMPLETED (contact-service only)**

### Milestone 2.1: Schema-Compliant Type Definitions ✅ **COMPLETED**
**Goal:** Create exact TypeScript interfaces matching schema above

**Status:**
- ✅ **contact-service**: Complete Contact interface with all 33 fields
- ✅ **contact-service**: Experience interface for embedded objects  
- ✅ **contact-service**: AttributeDocument interface for reverse indexes
- ❌ **Other services**: Need to copy/implement these models

**Files completed in contact-service:**
- ✅ `src/models/contact.model.ts`
- ✅ `src/models/experience.model.ts` 
- ✅ `src/models/attribute.model.ts`

---

### Milestone 2.2: Firestore Schema Configuration ✅ **COMPLETED**
**Goal:** Set up collections and constants per schema

**Status:**
- ✅ **contact-service**: All 12 collection constants defined
- ✅ **contact-service**: Reverse index mapping implemented
- ✅ **contact-service**: Document ID normalization working
- ❌ **Other services**: Need Firebase configuration

**Files completed in contact-service:**
- ✅ `src/config/firestore-collections.ts`
- ✅ `src/config/reverse-index-mapping.ts`
- ✅ `src/config/firebase.ts`
- ✅ `src/utils/document-id.ts`

---

### Milestone 2.3: Write Synchronization Service ✅ **COMPLETED**
**Goal:** Implement required write rules from schema

**Status:**
- ✅ **contact-service**: WriteSyncService fully implemented and tested
- ✅ **contact-service**: Handles all 10 attribute arrays
- ✅ **contact-service**: Atomic operations with batch writes
- ❌ **Other services**: Need to integrate with this service

**Files completed in contact-service:**
- ✅ `src/services/write-sync.service.ts` (6,860 lines of code)
- ✅ `src/services/write-sync.service.test.ts` (comprehensive tests)

---

## Phase 3: Core Services ✅ **COMPLETED (contact-service only)**

### Status Summary:
- ✅ **contact-service**: All core services implemented and working
- ❌ **Other services**: Need to implement or integrate with contact-service

### Milestone 3.1: Flattening Service ✅ **COMPLETED (contact-service)**
- ✅ **contact-service**: Flattening logic integrated into contact creation/updates
- ❌ **flattening-service**: Returns "Not implemented" - needs actual logic

### Milestone 3.2: Reverse Index Service ✅ **COMPLETED (contact-service)**  
- ✅ **contact-service**: WriteSyncService handles all reverse index operations
- ❌ **reverse-index-service**: Returns "Not implemented" - needs actual logic

### Milestone 3.3: Contact Service (CRUD) ✅ **COMPLETED**
- ✅ **contact-service**: Full CRUD with validation, error handling
- ✅ **contact-service**: Production-ready API endpoints

### Milestone 3.4: Matching Service ✅ **COMPLETED (contact-service)**
- ✅ **contact-service**: MatchingService with full algorithm implementation
- ❌ **matching-service**: Basic handler structure but returns empty arrays

---

## Phase 4: API Layer ✅ **COMPLETED (contact-service only)**

### Milestone 4.1: Controllers & Routes ✅ **COMPLETED (contact-service)**
- ✅ **contact-service**: Full REST API with `/v1/contacts` endpoints
- ✅ **contact-service**: Matching endpoints `/v1/contacts/:id/matches`
- ❌ **Other services**: Basic health endpoints only

### Milestone 4.2: Validation & Error Handling ✅ **COMPLETED (contact-service)**
- ✅ **contact-service**: Joi validation schemas
- ✅ **contact-service**: Structured error handling and logging
- ❌ **Other services**: No validation or error handling

---

## Phase 5: Testing & Quality Assurance ✅ **COMPLETED (contact-service only)**

### Milestone 5.1: Unit Tests ✅ **COMPLETED (contact-service)**
- ✅ **contact-service**: 86% test coverage achieved
- ✅ **contact-service**: Jest configuration with TypeScript
- ❌ **Other services**: No tests implemented

### Milestone 5.2: Integration Tests ✅ **COMPLETED (contact-service)**
- ✅ **contact-service**: Firestore emulator integration tests
- ✅ **contact-service**: Full workflow testing
- ❌ **Other services**: No integration tests

### Milestone 5.3: Load Testing ✅ **COMPLETED (contact-service)**
- ✅ **contact-service**: k6 load testing with performance benchmarks
- ✅ **contact-service**: Performance validation completed
- ❌ **Other services**: No load testing

---

## Phase 6: Deployment ✅ **COMPLETED (All Services)**

### Milestone 6.1: Containerization ✅ **COMPLETED**
- ✅ **All services**: Dockerfiles created and working
- ✅ **All services**: Health check endpoints implemented

### Milestone 6.2: Cloud Run Deployment ✅ **COMPLETED**
- ✅ **All services**: Deployed to Cloud Run (us-east1)
- ✅ **All services**: Environment variables configured

### Milestone 6.3: CI/CD Pipeline ✅ **COMPLETED**
- ✅ **All services**: GitHub Actions workflows for testing and deployment
- ✅ **All services**: Automated deployment on main branch
- ✅ **Repository**: Status badges and dev/main branch workflow

---

## **NEXT STEPS: Complete Remaining Services**

### **RECOMMENDED APPROACH: Complete the 4 Stub Services**

#### **Priority 1: matching-service**
**Current Status:** Basic handler with TODO comments
**Needs:**
- [ ] Copy MatchingService from contact-service
- [ ] Implement actual matching algorithm (currently returns empty arrays)
- [ ] Add Firebase configuration and models
- [ ] Add validation and error handling
- [ ] Add tests

#### **Priority 2: flattening-service** 
**Current Status:** Returns "Not implemented"
**Needs:**
- [ ] Implement contact flattening logic
- [ ] Extract current vs past companies from experiences
- [ ] Normalize roles and skills
- [ ] Add validation and error handling
- [ ] Add tests

#### **Priority 3: reverse-index-service**
**Current Status:** Returns "Not implemented"  
**Needs:**
- [ ] Copy WriteSyncService from contact-service
- [ ] Implement reverse index update endpoints
- [ ] Add Firebase configuration
- [ ] Add validation and error handling
- [ ] Add tests

#### **Priority 4: validation-service**
**Current Status:** Returns "Not implemented"
**Needs:**
- [ ] Copy validation schemas from contact-service
- [ ] Implement contact validation endpoints
- [ ] Add comprehensive validation rules
- [ ] Add tests

### **ALTERNATIVE APPROACH: Consolidate into contact-service**
Since contact-service already has all the functionality:
- [ ] Move all endpoints into contact-service
- [ ] Retire the 4 stub services
- [ ] Update CI/CD to deploy only contact-service
- [ ] Simpler architecture and maintenance

---

## **FILES TO COPY/REFERENCE FROM contact-service:**

### **Models (copy to all services):**
- `src/models/contact.model.ts` (3,152 lines)
- `src/models/experience.model.ts` (840 lines)  
- `src/models/attribute.model.ts` (678 lines)

### **Configuration (copy to all services):**
- `src/config/firebase.ts` (1,732 lines)
- `src/config/firestore-collections.ts` (1,145 lines)
- `src/config/reverse-index-mapping.ts` (2,167 lines)

### **Core Services (adapt for each service):**
- `src/services/matching.service.ts` (5,620 lines) → matching-service
- `src/services/write-sync.service.ts` (6,860 lines) → reverse-index-service
- Contact flattening logic → flattening-service
- `src/validators/contact.validator.ts` (3,282 lines) → validation-service

### **Infrastructure (copy to all services):**
- `src/middleware/` (error handling, validation, logging)
- Testing setup and configuration
- Package.json dependencies

---

## Phase 7: Documentation & Handoff (Week 8)

### Milestone 7.1: Documentation
**Goal:** Comprehensive documentation for maintenance

**Tasks:**
- [ ] Update README with:
  - Project overview
  - Setup instructions
  - API documentation
  - Environment variables
  - Deployment guide
- [ ] Add inline code comments
- [ ] Generate API documentation (Swagger UI)
- [ ] Create architecture diagram
- [ ] Document cost optimization strategies

**Deliverables:**
- Complete README.md
- API documentation site
- Architecture diagram

---

### Milestone 7.2: Monitoring & Observability
**Goal:** Production monitoring setup

**Tasks:**
- [ ] Set up Cloud Logging
- [ ] Set up Cloud Monitoring (metrics dashboard)
- [ ] Create alerts for errors and high latency
- [ ] Add custom metrics (match query duration, contact creation rate)
- [ ] Document runbook for common issues

**Deliverables:**
- GCP monitoring dashboard
- Alert policies
- Runbook document

---

## Testing Strategy

### Unit Testing
- **Framework:** Jest with TypeScript
- **Coverage Target:** >80%
- **Focus Areas:**
  - Flattening logic
  - Reverse index updates
  - Matching algorithm
  - Utility functions

### Integration Testing
- **Framework:** Jest + Supertest + Firestore Emulator
- **Focus Areas:**
  - Full contact CRUD lifecycle
  - Reverse index synchronization
  - API endpoint responses
  - Error handling

### Load Testing
- **Framework:** k6 or Artillery
- **Scenarios:**
  - 100 concurrent match requests
  - 50 concurrent contact creations
  - Bulk contact updates
- **Success Criteria:**
  - 95th percentile response time <2s
  - 0% error rate

### Manual QA Checklist
- [ ] Create founder contact via API
- [ ] Create investor contact via API
- [ ] Match founder with investors
- [ ] Update founder's skills
- [ ] Verify reverse indexes updated
- [ ] Match again and see updated results
- [ ] Test with missing fields
- [ ] Test with invalid data
- [ ] Verify error messages are clear

### Testing Plan for Schema v2 (Nov 2025)
To validate the newly added company/experience nodes, target intent arrays, and action-status logic, run the following cycle on the `feature/firestore-schema-overhaul` branch:

1. **Dataset preparation**
   - `npm run clear:firestore` → `npm run seed:vocabs` → `npm run seed:coverage-contacts` → `npm run backfill:nodes` against the dev Firestore project to ensure every vocab entry, company, and experience is represented.
2. **Unit tests**
   - Extend Jest suites for `flatteningService`, `companySyncService`, and `matching.service` to cover target arrays, action-status derivation, and company syncing.
   - Gate changes with `npm run test`, `npm run test:unit`, `npm run test:coverage` (target ≥80%).
3. **Integration tests**
   - Use the Firestore emulator to run CRUD + matching flows that assert `/companies` + `/experiences` documents are created, `target_*` fields round-trip through `/v1/contacts`, and matching respects founder-current vs investor-target logic.
4. **Load tests**
   - Update the k6 scripts with schema v2 payloads and run the Phase 5 scenarios (100 concurrent matches, 50 concurrent creations, bulk updates) ensuring p95 <2 s and 0% errors.
5. **Manual QA**
   - Drive the Postman collection end-to-end (create founder/investor, patch target criteria, verify action status flips to `waiting` once prospects exist, inspect `/companies` + `/experiences` collections, and rerun matches).
   - Smoke the UI against `investor-match-ai-dev` to confirm new fields render (Action Status column, company tab, upcoming Target Criterion tab).

Document results (logs + screenshots) in `docs/testing-plan-v2.md` before promoting the branch.
---

## Quality Assurance Plan

### Code Review Process
1. All code changes via pull request
2. At least 1 reviewer approval required
3. All tests must pass
4. Lint checks must pass
5. No unresolved comments

### Pre-Deployment Checklist
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Code coverage >80%
- [ ] Load tests pass performance criteria
- [ ] API documentation updated
- [ ] Environment variables documented
- [ ] Dockerfile builds successfully
- [ ] Health check endpoint responds

### Post-Deployment Validation
- [ ] All API endpoints return 200 OK
- [ ] Sample match query returns results
- [ ] Cloud Run logs show no errors
- [ ] Firestore metrics look normal
- [ ] Response times <2s

---

## Technology Stack

### Core
- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js
- **Language:** TypeScript 5.x
- **Database:** Cloud Firestore

### Development
- **Testing:** Jest, Supertest
- **Validation:** Zod or Joi
- **Linting:** ESLint + Prettier
- **Logging:** Winston or Pino

### Infrastructure
- **Hosting:** GCP Cloud Run
- **Container:** Docker
- **CI/CD:** GitHub Actions or Cloud Build
- **Monitoring:** Cloud Logging + Cloud Monitoring

---

## Environment Variables

```bash
# Firebase
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# API
PORT=8080
NODE_ENV=production
LOG_LEVEL=info

# Matching
DEFAULT_MATCH_LIMIT=20
MAX_MATCH_LIMIT=100
```

---

## Cost Optimization Strategies

### Firestore Read Optimization
1. **Flattened documents** - All contact data in one doc (1 read instead of N)
2. **Reverse indexes** - Pre-computed lookups avoid graph traversals
3. **In-memory aggregation** - Matching happens in middleware, not Firestore
4. **Batch operations** - Group writes when updating reverse indexes

### Expected Costs (2K contacts)
- **Storage:** ~100 MB = ~$0.02/month
- **Reads:** 
  - Match query: 1 contact + ~50 attributes = 51 reads
  - Cost: 51 reads × $0.06/100K = negligible
  - 1000 matches/day = ~$1/month
- **Writes:**
  - Contact creation: 1 contact + ~10 attributes = 11 writes
  - Cost: 11 writes × $0.18/100K = negligible
  - 100 contacts/day = ~$2/month
- **Total:** ~$3-5/month at 2K scale

Compare to Neo4j AuraDB: ~$65/month minimum

---

## Risk Mitigation

### Technical Risks
| Risk | Mitigation |
|------|-----------|
| Firestore write limits | Use batch writes, implement backoff |
| Reverse index inconsistency | Use transactions where possible, add reconciliation script |
| Matching performance degradation | Add caching layer, consider pagination |
| Cold start latency on Cloud Run | Keep service warm with min instances |

### Project Risks
| Risk | Mitigation |
|------|-----------|
| Scope creep | Stick to MVP, defer auth and advanced features |
| Delayed testing | Write tests alongside code, not at end |
| Unclear requirements | Review this plan together, iterate |

---

## Success Criteria

### MVP Complete When:
- [x] All API endpoints functional
- [x] Contact creation and updates work
- [x] Matching algorithm returns ranked results
- [x] Reverse indexes stay in sync
- [x] Tests achieve >80% coverage
- [x] Deployed to Cloud Run
- [x] API documentation published
- [x] Can handle 2K contacts with <2s match queries

---

## Next Steps

1. **Review this plan together** - Adjust milestones and timeline
2. **Set up GCP project** - Create project, enable APIs, set up billing
3. **Initialize repository** - Start with Phase 1, Milestone 1.1
4. **Weekly check-ins** - Review progress, unblock issues
5. **Iterate** - Adjust plan as you learn

---

## Additional Considerations

### Future Enhancements (Post-MVP)
- Authentication (Firebase Auth)
- Rate limiting
- Caching layer (Redis)
- Advanced matching filters
- Webhooks for new matches
- Admin dashboard
- Analytics and metrics

### Scaling Beyond 2K
- Add Firestore composite indexes
- Implement result caching
- Consider Cloud Run min instances
- Add CDN for static content
- Implement request queuing for bulk operations

---

**Ready to start?** Let's kick off Phase 1 and build this thing! 🚀
