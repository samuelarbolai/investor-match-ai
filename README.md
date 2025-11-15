# Investor Match API

[![Test Suite](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/test.yml/badge.svg)](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/test.yml)
[![Deploy to Cloud Run](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/deploy.yml/badge.svg)](https://github.com/samuelarbolai/investor-match-ai/actions/workflows/deploy.yml)

Graph-based founder-investor matching system using Firestore as a cost-optimized graph database.

## Setup

1. Install dependencies:
```bash
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
gcloud run deploy investor-match-30x --source . --platform managed --region us-central1 --allow-unauthenticated
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/v1/contacts` - Create contact
- `GET /api/v1/contacts/:id` - Get contact

## Project Structure

```
src/
├── config/          # Firebase and constants
├── models/          # Type definitions
├── services/        # Business logic
├── controllers/     # Request handlers
├── routes/          # API routes
├── middleware/      # Express middleware
└── utils/           # Utilities
```
