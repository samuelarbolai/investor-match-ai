# Investor Match API

[![Test Suite](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/test.yml/badge.svg)](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/test.yml)
[![Deploy to Cloud Run](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/deploy.yml/badge.svg)](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/deploy.yml)

Graph-based founder-investor matching system using Firestore as a cost-optimized graph database.

## Architecture

**Monolithic Service:** All functionality consolidated into `investor-match-api` for optimal performance and simplicity.

**Core Features:**
- Contact CRUD operations with validation
- Intelligent matching algorithm using reverse indexes
- Real-time reverse index synchronization
- Comprehensive testing suite (86% coverage)
- Production-ready API with error handling and logging

## Setup

1. Install dependencies:
```bash
cd services/investor-match-api
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

3. Test Firebase connection:
```bash
npm run dev
# In another terminal:
npx ts-node scripts/test-firebase.ts
```

4. Start development server:
```bash
npm run dev
```

## Deployment

Deploy to Google Cloud Run:
```bash
cd services/investor-match-api
gcloud run deploy investor-match-api --source . --platform managed --region us-east1 --allow-unauthenticated
```

## API Endpoints

- `GET /health` - Health check
- `POST /v1/contacts` - Create contact
- `GET /v1/contacts/:id` - Get contact
- `PATCH /v1/contacts/:id` - Update contact
- `GET /v1/contacts/:id/matches` - Find matches for contact

## Project Structure

```
services/investor-match-api/
├── src/
│   ├── config/          # Firebase and constants
│   ├── models/          # Type definitions
│   ├── services/        # Business logic (matching, sync, etc.)
│   ├── handlers/        # Request handlers
│   ├── validators/      # Input validation
│   ├── middleware/      # Express middleware
│   └── utils/           # Utilities
├── tests/               # Unit, integration, and load tests
└── Dockerfile           # Container configuration
```
