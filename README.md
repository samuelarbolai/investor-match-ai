# Investor Match API

[![Test Suite](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/test.yml/badge.svg)](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/test.yml)
[![Deploy to Cloud Run](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/deploy.yml/badge.svg)](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/deploy.yml)

Graph-based founder-investor matching system using Firestore as a cost-optimized graph database. Intelligently connects founders with relevant investors based on shared attributes like industries, skills, funding stages, and more.

## 🚀 Live API

**Production URL:** `https://investor-match-api-23715448976.us-east1.run.app`

**API Documentation:** [Swagger UI](https://investor-match-api-23715448976.us-east1.run.app/api-docs)

## 📋 Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Setup & Development](#setup--development)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Cost Optimization](#cost-optimization)
- [Contributing](#contributing)

## 🏗️ Architecture

**Monolithic Service:** All functionality consolidated into `investor-match-api` for optimal performance and simplicity.

### Core Components:
- **Contact Management:** CRUD operations with validation
- **Matching Algorithm:** Graph-based matching using reverse indexes
- **Reverse Index Sync:** Real-time bidirectional relationship maintenance
- **Data Validation:** Comprehensive input validation with Joi schemas
- **Error Handling:** Structured error responses with logging

### Technology Stack:
- **Runtime:** Node.js 18 LTS
- **Framework:** Express.js with TypeScript
- **Database:** Cloud Firestore (graph-optimized)
- **Hosting:** Google Cloud Run (serverless)
- **CI/CD:** GitHub Actions
- **Testing:** Jest with 86% coverage

## ✨ Features

### 🎯 Intelligent Matching
- **Graph-based algorithm** using reverse indexes for O(1) lookups
- **Multi-attribute scoring** across 10 different contact attributes
- **Contact type filtering** (founder ↔ investor matching)
- **Ranked results** with overlap summaries

### 📊 Data Management
- **33-field contact schema** with embedded experiences
- **Automatic data flattening** from raw input to normalized format
- **Real-time reverse index sync** for bidirectional relationships
- **Atomic operations** ensuring data consistency

### 🛡️ Production Ready
- **Comprehensive validation** with detailed error messages
- **Structured logging** with request/response tracking
- **Error handling** with proper HTTP status codes
- **Load tested** for 2K+ contacts with <2s response times

## 🔗 API Endpoints

### Contact Management
```http
POST   /v1/contacts           # Create new contact
GET    /v1/contacts/:id       # Get contact by ID
PATCH  /v1/contacts/:id       # Update contact
DELETE /v1/contacts/:id       # Delete contact (optional)
```

### Matching
```http
GET    /v1/contacts/:id/matches?type=investor&limit=20  # Find matches
```

### System
```http
GET    /health                # Health check
GET    /api-docs              # Swagger documentation
```

### Example Request
```bash
curl -X POST https://investor-match-api-23715448976.us-east1.run.app/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Founder",
    "contact_type": "founder",
    "headline": "Building the future of fintech",
    "skills": ["javascript", "product-management"],
    "industries": ["fintech", "saas"],
    "funding_stages": ["seed", "series-a"]
  }'
```

### Example Response
```json
{
  "id": "jane-founder-abc123",
  "full_name": "Jane Founder",
  "contact_type": "founder",
  "headline": "Building the future of fintech",
  "skills": ["javascript", "product-management"],
  "industries": ["fintech", "saas"],
  "funding_stages": ["seed", "series-a"],
  "created_at": "2025-11-14T20:00:00Z",
  "updated_at": "2025-11-14T20:00:00Z"
}
```

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+ LTS
- npm or yarn
- Google Cloud account with Firestore enabled
- Firebase service account key

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/samuelarbolai/investor-match-ai.git
cd investor-match-ai-api
```

2. **Install dependencies:**
```bash
cd services/investor-match-api
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your Firebase credentials (see Environment Variables section)
```

4. **Test Firebase connection:**
```bash
npm run dev
# In another terminal:
npx ts-node scripts/test-firebase.ts
```

5. **Start development server:**
```bash
npm run dev
# Server runs on http://localhost:8080
```

6. **Run tests:**
```bash
npm test                    # All tests
npm run test:coverage       # With coverage report
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
```

## 🔧 Environment Variables

Create a `.env` file in `services/investor-match-api/`:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# API Configuration
PORT=8080
NODE_ENV=development
LOG_LEVEL=info

# Matching Configuration
DEFAULT_MATCH_LIMIT=20
MAX_MATCH_LIMIT=100

# Testing (optional)
FIRESTORE_EMULATOR_HOST=localhost:8080  # For integration tests
```

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Create a service account with Firestore permissions
4. Download the service account JSON key
5. Set `GOOGLE_APPLICATION_CREDENTIALS` to the key file path

## 🚀 Deployment

### Automatic Deployment (Recommended)
The project uses GitHub Actions for automatic deployment:

1. **Push to main branch** triggers automatic deployment to Cloud Run
2. **Create PR** triggers test suite validation
3. **Status badges** show current build/deployment status

### Manual Deployment
```bash
cd services/investor-match-api

# Deploy to Cloud Run
gcloud run deploy investor-match-api \
  --source . \
  --platform managed \
  --region us-east1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=your-project-id
```

### Docker Deployment
```bash
# Build image
docker build -t investor-match-api .

# Run locally
docker run -p 8080:8080 \
  -e FIREBASE_PROJECT_ID=your-project-id \
  -v /path/to/service-account.json:/app/service-account.json \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json \
  investor-match-api
```

## 🧪 Testing

### Test Coverage
- **Overall:** 86% coverage achieved
- **Matching Service:** 86% coverage
- **Utilities:** 100% coverage
- **Target:** 80% minimum coverage enforced

### Test Types

#### Unit Tests
```bash
npm run test:unit
```
- Individual function testing
- Mocked dependencies
- Fast execution (<5s)

#### Integration Tests
```bash
npm run test:integration
```
- End-to-end API testing
- Firestore emulator
- Real workflow validation

#### Load Tests
```bash
npm run test:load
```
- k6 performance testing
- 2K+ contact simulation
- <2s response time validation

### Test Commands
```bash
npm test                    # Run all tests
npm run test:coverage       # Generate coverage report
npm run test:watch          # Watch mode for development
npm run test:ci             # CI-optimized test run
```

## 📊 Monitoring

### Production Monitoring
- **Cloud Logging:** Structured request/response logs
- **Cloud Monitoring:** Performance metrics and dashboards
- **Error Tracking:** Automatic error alerting
- **Health Checks:** `/health` endpoint monitoring

### Key Metrics
- **Response Time:** 95th percentile <2s
- **Error Rate:** <1% target
- **Throughput:** Requests per minute
- **Match Quality:** Average matches per query

### Logs Access
```bash
# View recent logs
gcloud logs read "resource.type=cloud_run_revision" --limit=50

# Follow logs in real-time
gcloud logs tail "resource.type=cloud_run_revision"
```

## 💰 Cost Optimization

### Firestore Optimization
- **Flattened documents:** All contact data in single document (1 read vs N reads)
- **Reverse indexes:** Pre-computed lookups avoid expensive graph traversals
- **In-memory aggregation:** Matching computation happens in middleware
- **Batch operations:** Grouped writes for reverse index updates

### Expected Costs (2K contacts)
- **Storage:** ~100 MB ≈ $0.02/month
- **Reads:** ~51 reads per match query ≈ $1/month (1000 matches/day)
- **Writes:** ~11 writes per contact creation ≈ $2/month (100 contacts/day)
- **Total:** ~$3-5/month at 2K scale

**Cost Comparison:** Traditional Neo4j AuraDB would cost ~$65/month minimum

### Scaling Considerations
- **2K contacts:** Current optimized setup
- **10K contacts:** Add composite indexes
- **50K+ contacts:** Consider caching layer
- **100K+ contacts:** Implement result pagination

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Make changes** with tests
4. **Run test suite:** `npm test`
5. **Commit changes:** `git commit -m 'Add amazing feature'`
6. **Push to branch:** `git push origin feature/amazing-feature`
7. **Create Pull Request**

### Code Standards
- **TypeScript:** Strict mode enabled
- **ESLint:** Airbnb configuration
- **Prettier:** Automatic formatting
- **Tests:** Required for new features
- **Coverage:** Maintain 80%+ coverage

### Project Structure
```
services/investor-match-api/
├── src/
│   ├── config/          # Firebase and constants
│   ├── models/          # TypeScript interfaces
│   ├── services/        # Business logic
│   │   ├── contact.service.ts      # CRUD operations
│   │   ├── matching.service.ts     # Matching algorithm
│   │   └── write-sync.service.ts   # Reverse index sync
│   ├── handlers/        # Express route handlers
│   ├── validators/      # Joi validation schemas
│   ├── middleware/      # Express middleware
│   └── utils/           # Helper functions
├── tests/
│   ├── unit/           # Unit tests
│   ├── integration/    # API integration tests
│   └── load/           # Performance tests
├── docs/               # Additional documentation
└── Dockerfile          # Container configuration
```

## 📚 Additional Resources

- **API Documentation:** [Swagger UI](https://investor-match-api-23715448976.us-east1.run.app/api-docs)
- **Architecture Diagram:** [View Diagram](./docs/architecture-diagram.html)
- **Runbook:** [Operations Guide](./docs/RUNBOOK.md)
- **Firebase Console:** [Project Dashboard](https://console.firebase.google.com)
- **Cloud Run Console:** [Service Dashboard](https://console.cloud.google.com/run)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/samuelarbolai/investor-match-ai/issues)
- **Discussions:** [GitHub Discussions](https://github.com/samuelarbolai/investor-match-ai/discussions)
- **Email:** [Contact Support](mailto:support@example.com)

---

**Built with ❤️ for connecting founders and investors**
