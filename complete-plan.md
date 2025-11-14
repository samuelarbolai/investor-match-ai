# Founder-Investor Matching System
## Implementation Plan

---

## Executive Summary

**Project:** Graph-based founder-investor matching system using Firestore as a cost-optimized graph database  
**Tech Stack:** Node.js/Express, Firestore, Cloud Run  
**Initial Scale:** 2,000 contacts  
**Timeline:** 6-8 weeks (phased delivery)

---

## Phase 1: Project Foundation (Week 1)

### Milestone 1.1: Project Setup
**Goal:** Initialize repository with proper structure and tooling

**Tasks:**
- [ ] Initialize Git repository with `.gitignore`
- [ ] Set up Node.js project with `package.json`
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Set up ESLint and Prettier
- [ ] Create `.env.example` for environment variables
- [ ] Initialize Firebase Admin SDK configuration

**Deliverables:**
- Working development environment
- Project README with setup instructions

**Testing:**
- Verify `npm install` and `npm run dev` work
- Confirm Firebase connection with test script

---

### Milestone 1.2: Project Structure
**Goal:** Establish clean architecture following separation of concerns

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

## Phase 2: Data Layer (Week 2)

### Schema Reference (Complete)

#### Collections (12 total)
All collections use lowerCamelCase, pluralized:
- contacts, jobToBeDone, skills, industries, verticals, productTypes, fundingStages, companyHeadcountRanges, engineeringHeadcountRanges, targetDomains, roles, companies (optional)

#### Contact Document Fields (Complete)
```
/contacts/{contactId}
- id: string
- full_name: string
- headline: string
- contact_type: string  // founder | investor | both
- location_city: string | null
- location_country: string | null
- job_to_be_done: string[]
- current_company: string | null
- current_role: string | null
- past_companies: string[]
- roles: string[]
- skills: string[]
- seniority_levels: string[]
- industries: string[]
- verticals: string[]
- product_types: string[]
- funding_stages: string[]
- company_headcount_ranges: string[]
- engineering_headcount_ranges: string[]
- founder_roles: string[]
- investor_roles: string[]
- target_domains: string[]
- stage_preferences: string[]
- check_size_range: string[]
- team_size_preferences: string[]
- founder_seniority_preferences: string[]
- engineering_headcount_preferences: string[]
- revenue_model_preferences: string[]
- risk_tolerance_preferences: string[]
- experiences: Experience[]  // embedded objects array
- linkedin_url: string | null
- email: string | null
- created_at: timestamp
- updated_at: timestamp
```

#### Experience Object (Embedded)
```
{
  company_name: string,
  company_id: string | null,
  role: string,
  seniority: string,
  start_date: string,      // YYYY-MM format
  end_date: string | null, // YYYY-MM or null
  current: boolean,
  description: string | null,
  location_city: string | null,
  location_country: string | null
}
```

#### AttributeDocument (Reverse Index)
```
/{collection}/{valueId}
{
  id: string,
  label: string,
  contact_ids: string[],  // must always be array, never null
  updated_at: timestamp
}
```

#### Reverse Index Mapping Table
| Contact Field | Firestore Collection | Edge Name |
|---------------|---------------------|-----------|
| job_to_be_done[] | jobToBeDone | _FOCUSED_ON |
| skills[] | skills | _HAS_SKILL |
| industries[] | industries | _IN_INDUSTRY |
| verticals[] | verticals | _IN_VERTICAL |
| product_types[] | productTypes | _PRODUCES |
| funding_stages[] | fundingStages | _HAS_RAISED |
| company_headcount_ranges[] | companyHeadcountRanges | _HAS_HEADCOUNT |
| engineering_headcount_ranges[] | engineeringHeadcountRanges | _HAS_ENGINEERING_HEADCOUNT |
| target_domains[] | targetDomains | _TARGETS_DOMAIN |
| roles[] | roles | _HAS_ROLE |

#### Write Rules (Required)
1. **Forward edges**: Update Contact document with all field changes
2. **Reverse indexes**: Synchronize contact_ids arrays in attribute documents
3. **Missing docs**: Auto-create attribute documents if they don't exist
4. **Timestamps**: Update contact.updated_at and attribute.updated_at
5. **Arrays**: Replace atomically, never merge
6. **Uniqueness**: Ensure contact_ids arrays contain unique values only

---

### Milestone 2.1: Schema-Compliant Type Definitions
**Goal:** Create exact TypeScript interfaces matching schema above

**Tasks:**
- [ ] Create Contact interface with all 33 fields and exact types
- [ ] Create Experience interface for embedded objects
- [ ] Create AttributeDocument interface for reverse indexes
- [ ] Create ContactType enum: 'founder' | 'investor' | 'both'
- [ ] Ensure all arrays are string[], never null
- [ ] Ensure nullable fields use string | null
- [ ] Add JSDoc comments with Firestore field mappings

**Files to create:**
- `src/models/contact.model.ts`
- `src/models/experience.model.ts` 
- `src/models/attribute.model.ts`

**Validation:**
- TypeScript compilation passes
- All fields match schema exactly
- No any types used

---

### Milestone 2.2: Firestore Schema Configuration
**Goal:** Set up collections and constants per schema

**Tasks:**
- [ ] Define all 12 collection name constants
- [ ] Create reverse index mapping object from table above
- [ ] Implement document ID normalization (URL-safe slugs)
- [ ] Create collection reference helpers
- [ ] Set up Firebase Admin SDK configuration

**Files to create:**
- `src/config/firestore-collections.ts` (12 collection constants)
- `src/config/reverse-index-mapping.ts` (10 field mappings)
- `src/config/firebase.ts` (Admin SDK setup)
- `src/utils/document-id.ts` (ID normalization)

**Requirements:**
- Collection names exactly match schema
- Mapping table implemented as TypeScript object
- Document IDs are URL-safe strings

---

### Milestone 2.3: Write Synchronization Service
**Goal:** Implement required write rules from schema

**Tasks:**
- [ ] Implement forward edge writes (Contact updates)
- [ ] Implement reverse index synchronization for all 10 attribute arrays
- [ ] Auto-create missing attribute documents with schema structure
- [ ] Handle atomic array replacements (not merges)
- [ ] Update timestamps on contact and touched attributes
- [ ] Ensure contact_ids uniqueness in reverse indexes
- [ ] Use Firestore batch writes for efficiency

**Files to create:**
- `src/services/write-sync.service.ts`

**Key functions needed:**
- `syncReverseIndexes(contactId, oldContact, newContact)`
- `createMissingAttributeDocs(values, collection)`
- `updateContactTimestamp(contactId, updates)`
- `ensureUniqueContactIds(attributeDoc)`

**Requirements:**
- All write rules from schema implemented
- Transaction-safe operations
- Batch writes for performance
- Proper error handling

---

## Phase 3: Core Services (Weeks 3-4)

### Milestone 3.1: Flattening Service
**Goal:** Transform raw contact data into flattened contact documents

**Tasks:**
- [ ] Implement `flattenContact()` function
- [ ] Extract current vs past companies from experiences
- [ ] Normalize roles across all experiences
- [ ] Extract unique seniority levels
- [ ] Merge declared attributes (skills, industries, etc.)
- [ ] Handle edge cases (missing fields, null values)

**Deliverables:**
- `src/services/flattening.service.ts`
- Unit tests for flattening logic

**Testing:**
- Test with complete contact data
- Test with minimal contact data
- Test with malformed experiences
- Verify all arrays are deduplicated

---

### Milestone 3.2: Reverse Index Service
**Goal:** Maintain bidirectional relationships between contacts and attributes

**Tasks:**
- [ ] Implement `updateReverseIndexes()` function
- [ ] Handle batch updates for multiple attributes
- [ ] Implement add contact to attribute's `contact_ids[]`
- [ ] Implement remove contact from attribute's `contact_ids[]`
- [ ] Handle attribute document creation if doesn't exist
- [ ] Implement transaction-safe updates

**Key Algorithm:**
```typescript
async updateReverseIndexes(
  contactId: string, 
  oldContact: Contact | null, 
  newContact: Contact
): Promise<void> {
  // For each attribute collection:
  // 1. Find removed values (in old but not in new)
  // 2. Find added values (in new but not in old)
  // 3. Remove contactId from removed values' docs
  // 4. Add contactId to added values' docs
  // 5. Use batch writes for efficiency
}
```

**Deliverables:**
- `src/services/reverse-index.service.ts`
- Unit tests for add/remove operations

**Testing:**
- Test adding new contact (all adds)
- Test updating contact (mixed adds/removes)
- Test deleting contact (all removes)
- Verify batch write efficiency

---

### Milestone 3.3: Contact Service (CRUD)
**Goal:** Implement core contact operations

**Tasks:**
- [ ] Implement `createContact()`
  - Flatten input
  - Write to `/contacts/{id}`
  - Update reverse indexes
- [ ] Implement `getContact(id)`
- [ ] Implement `updateContact(id, partial)`
  - Re-flatten
  - Diff old vs new
  - Update reverse indexes
- [ ] Implement `deleteContact(id)` (optional for MVP)
- [ ] Add transaction support for atomic operations

**Deliverables:**
- `src/services/contact.service.ts`
- Integration tests with Firestore emulator

**Testing:**
- Test full CRUD lifecycle
- Verify reverse indexes are updated correctly
- Test concurrent updates (race conditions)

---

### Milestone 3.4: Matching Service
**Goal:** Implement the core matching algorithm

**Tasks:**
- [ ] Implement `matchContact()` function
- [ ] Load seed contact from Firestore
- [ ] For each attribute type, load reverse index docs
- [ ] Aggregate candidate scores in-memory
- [ ] Rank candidates by score
- [ ] Build overlap summary (which attributes matched)
- [ ] Implement filtering by `contact_type` (founder/investor)
- [ ] Add limit and pagination support

**Algorithm:**
```typescript
async matchContact(
  seedId: string, 
  targetType: 'founder' | 'investor', 
  limit: number = 20
): Promise<MatchResult> {
  const seed = await getContact(seedId);
  
  const attributeCollections = [
    'jobToBeDone', 'skills', 'industries', 
    'verticals', 'productTypes', 'fundingStages',
    'companyHeadcountRanges', 'engineeringHeadcountRanges',
    'targetDomains', 'roles'
  ];
  
  const scores: Map<string, number> = new Map();
  const overlaps: Map<string, string[]> = new Map();
  
  for (const collection of attributeCollections) {
    const seedValues = seed[collection] || [];
    
    for (const value of seedValues) {
      const attrDoc = await getAttributeDoc(collection, value);
      
      for (const candidateId of attrDoc.contact_ids) {
        if (candidateId === seedId) continue;
        
        scores.set(candidateId, (scores.get(candidateId) || 0) + 1);
        
        if (!overlaps.has(candidateId)) {
          overlaps.set(candidateId, []);
        }
        overlaps.get(candidateId).push(`${collection}:${value}`);
      }
    }
  }
  
  // Sort and filter by targetType
  const ranked = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  
  return { candidates: ranked, overlaps };
}
```

**Deliverables:**
- `src/services/matching.service.ts`
- Unit tests with mock data

**Testing:**
- Test with contacts sharing multiple attributes
- Test with contacts sharing no attributes
- Test filtering by contact_type
- Test pagination
- Benchmark performance with 2K contacts

---

## Phase 4: API Layer (Week 5)

### Milestone 4.1: Controllers & Routes
**Goal:** Expose services via REST API

**Tasks:**
- [ ] Implement `POST /v1/contacts` controller
- [ ] Implement `GET /v1/contacts/:id` controller
- [ ] Implement `PATCH /v1/contacts/:id` controller
- [ ] Implement `GET /v1/match` controller
- [ ] Implement `POST /v1/match/preview` controller
- [ ] Set up Express router with all endpoints
- [ ] Add request validation middleware (Joi or Zod)
- [ ] Add error handling middleware
- [ ] Add request logging

**Deliverables:**
- `src/controllers/*.ts`
- `src/routes/*.ts`
- OpenAPI/Swagger documentation

**Testing:**
- Integration tests for each endpoint
- Test error responses (400, 404, 500)
- Test request validation

---

### Milestone 4.2: Validation & Error Handling
**Goal:** Robust input validation and error responses

**Tasks:**
- [ ] Define Joi/Zod schemas for contact creation
- [ ] Define schemas for contact updates
- [ ] Define schemas for match queries
- [ ] Implement validation middleware
- [ ] Implement global error handler
- [ ] Implement custom error classes (NotFoundError, ValidationError)
- [ ] Add structured logging (Winston or Pino)

**Deliverables:**
- `src/validators/*.ts`
- `src/middleware/error.middleware.ts`
- Consistent error response format

**Testing:**
- Test invalid payloads
- Test missing required fields
- Verify error messages are helpful

---

## Phase 5: Testing & Quality Assurance (Week 6)

### Milestone 5.1: Unit Tests
**Goal:** Achieve >80% code coverage

**Tasks:**
- [ ] Unit tests for flattening service
- [ ] Unit tests for reverse index service
- [ ] Unit tests for matching algorithm
- [ ] Unit tests for normalization utilities
- [ ] Set up Jest with TypeScript
- [ ] Set up code coverage reporting

**Deliverables:**
- `tests/unit/*.test.ts`
- Coverage report

**Testing:**
- Run `npm test` and verify all pass
- Check coverage with `npm run coverage`

---

### Milestone 5.2: Integration Tests
**Goal:** Verify end-to-end workflows

**Tasks:**
- [ ] Set up Firestore emulator for tests
- [ ] Test full contact creation flow
- [ ] Test contact update with reverse index sync
- [ ] Test matching with real Firestore queries
- [ ] Test API endpoints with supertest
- [ ] Create test fixtures (sample contacts)

**Deliverables:**
- `tests/integration/*.test.ts`
- `tests/fixtures/*.json`

**Testing:**
- Run integration tests against emulator
- Verify no side effects between tests

---

### Milestone 5.3: Load Testing
**Goal:** Validate performance with 2K contacts

**Tasks:**
- [ ] Seed 2,000 test contacts into Firestore
- [ ] Measure match query performance
- [ ] Measure contact creation performance
- [ ] Identify bottlenecks (Firestore reads, computation)
- [ ] Optimize if needed (caching, batching)

**Deliverables:**
- Load testing script (k6 or Artillery)
- Performance benchmarks document

**Testing:**
- Match query completes in <2s for 2K dataset
- API can handle 10 concurrent requests

---

## Phase 6: Deployment (Week 7)

### Milestone 6.1: Containerization
**Goal:** Build production-ready Docker image

**Tasks:**
- [ ] Create Dockerfile with multi-stage build
- [ ] Optimize image size
- [ ] Add health check endpoint (`/health`)
- [ ] Configure environment variables
- [ ] Test local Docker build

**Deliverables:**
- `Dockerfile`
- `.dockerignore`
- Health check endpoint

**Testing:**
- Build image locally: `docker build -t founder-investor-api .`
- Run container: `docker run -p 8080:8080 founder-investor-api`
- Hit health endpoint

---

### Milestone 6.2: Cloud Run Deployment
**Goal:** Deploy to GCP Cloud Run

**Tasks:**
- [ ] Set up GCP project
- [ ] Enable Cloud Run API
- [ ] Configure service account with Firestore access
- [ ] Build and push image to Artifact Registry
- [ ] Deploy to Cloud Run
- [ ] Configure environment variables
- [ ] Set up Cloud Run invoker permissions (public for now)
- [ ] Configure memory and CPU limits

**Deliverables:**
- Deployed Cloud Run service
- Public API endpoint URL

**Testing:**
- Test all API endpoints on production URL
- Monitor Cloud Run logs
- Verify Firestore reads/writes

---

### Milestone 6.3: CI/CD Pipeline
**Goal:** Automate testing and deployment

**Tasks:**
- [ ] Set up GitHub Actions (or Cloud Build)
- [ ] Create workflow for running tests on PR
- [ ] Create workflow for building Docker image
- [ ] Create workflow for deploying to Cloud Run on main branch
- [ ] Add status badges to README

**Deliverables:**
- `.github/workflows/*.yml`
- Automated deployment on merge to main

**Testing:**
- Create test PR and verify tests run
- Merge to main and verify auto-deploy

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