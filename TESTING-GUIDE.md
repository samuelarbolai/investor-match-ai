# 🧪 Testing Guide - Investor Match AI API

## 📋 **Overview**

This guide explains how to test our founder-investor matching system at different levels and when to run each type of test.

## 🎯 **Testing Strategy**

### **When to Run Tests**

| Test Type | When to Run | Purpose |
|-----------|-------------|---------|
| **Unit Tests** | Every code change | Verify individual functions work |
| **Integration Tests** | Before deployment | Verify full API workflows |
| **Load Tests** | Weekly / Before major releases | Verify performance under load |
| **Manual Tests** | New features | Verify user experience |

---

## 🔧 **Setup Requirements**

### **Prerequisites**
```bash
# Install dependencies
cd services/contact-service
npm install

# Install k6 for load testing (macOS)
brew install k6

# Install Firebase CLI for emulator
npm install -g firebase-tools
```

### **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase project ID
FIREBASE_PROJECT_ID=investor-match-ai
```

---

## 🧪 **Unit Tests**

### **What They Test**
- Individual functions (matching algorithm, validation, utilities)
- Business logic without external dependencies
- Error handling and edge cases

### **How to Run**
```bash
# Run all unit tests
npm run test:unit

# Run with coverage report
npm run test:coverage

# Run in watch mode (during development)
npm run test:watch
```

### **Coverage Targets**
- **Minimum**: 80% statement coverage
- **Goal**: 90%+ for critical business logic
- **Current**: 86% matching service, 100% utilities

### **When to Run**
- ✅ Before every commit
- ✅ During development (watch mode)
- ✅ In CI/CD pipeline

---

## 🔗 **Integration Tests**

### **What They Test**
- Full API endpoints with real HTTP requests
- Database operations with Firestore emulator
- End-to-end workflows (create → read → match → delete)
- Request validation and error responses

### **How to Run**

#### **Step 1: Start Firestore Emulator**
```bash
# Terminal 1: Start emulator
npm run emulator:start

# Wait for: "All emulators ready! It is now safe to connect."
```

#### **Step 2: Run Integration Tests**
```bash
# Terminal 2: Run tests against emulator
npm run test:integration:emulator
```

#### **Alternative: Manual Setup**
```bash
# Start emulator manually
firebase emulators:start --only firestore --project test-project

# In another terminal
FIRESTORE_EMULATOR_HOST=localhost:8080 npm run test:integration
```

### **What Gets Tested**
- ✅ POST /v1/contacts (contact creation)
- ✅ GET /v1/contacts/:id (contact retrieval)
- ✅ GET /v1/contacts/:id/matches (matching algorithm)
- ✅ Request validation (400 errors)
- ✅ Not found handling (404 errors)

### **When to Run**
- ✅ Before deployment
- ✅ After major feature changes
- ✅ Weekly regression testing

---

## ⚡ **Load Tests**

### **What They Test**
- API performance under concurrent load
- Response times under stress
- Error rates at scale
- Real-world usage patterns

### **How to Run**

#### **Basic Load Test**
```bash
# Test with 5-20 concurrent users
k6 run tests/load/contact-load-test.js
```

#### **Performance Benchmark**
```bash
# Detailed performance metrics
k6 run tests/load/performance-benchmark.js
```

#### **Custom Load Test**
```bash
# Override base URL for different environments
k6 run -e BASE_URL=https://your-service-url.run.app tests/load/contact-load-test.js
```

### **Performance Targets**
| Operation | 95th Percentile | 50th Percentile |
|-----------|----------------|----------------|
| Contact Creation | < 3 seconds | < 1.5 seconds |
| Contact Retrieval | < 1 second | < 0.5 seconds |
| Matching Query | < 5 seconds | < 2 seconds |
| Health Check | < 0.5 seconds | < 0.2 seconds |

### **Success Criteria**
- ✅ Error rate < 10%
- ✅ 95% of requests meet performance targets
- ✅ System handles 20 concurrent users
- ✅ No memory leaks or crashes

### **When to Run**
- ✅ Before major releases
- ✅ Weekly performance monitoring
- ✅ After infrastructure changes
- ✅ When adding new features

---

## 🎯 **Manual Testing**

### **Production API Testing**

#### **Service URL**
```
https://investor-match-ai-contact-service-23715448976.us-central1.run.app
```

#### **Health Check**
```bash
curl https://investor-match-ai-contact-service-23715448976.us-central1.run.app/health
```

#### **Create Contact**
```bash
curl -X POST https://investor-match-ai-contact-service-23715448976.us-central1.run.app/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "headline": "Engineer",
    "contact_type": "founder",
    "skills": ["javascript"],
    "industries": ["fintech"]
  }'
```

#### **Find Matches**
```bash
# Replace {CONTACT_ID} with actual ID from creation
curl "https://investor-match-ai-contact-service-23715448976.us-central1.run.app/v1/contacts/{CONTACT_ID}/matches?targetType=investor&limit=5"
```

### **When to Run Manual Tests**
- ✅ After deployment
- ✅ New feature validation
- ✅ Bug reproduction
- ✅ User acceptance testing

---

## 🚀 **CI/CD Integration**

### **Recommended Pipeline**
```yaml
# Example GitHub Actions workflow
name: Test and Deploy
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:coverage
      
  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: firebase emulators:exec --only firestore "npm run test:integration"
      
  deploy:
    needs: [test, integration]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: gcloud run deploy...
```

---

## 📊 **Test Results Interpretation**

### **Unit Test Results**
```bash
✓ should create MatchingService instance
✓ should handle contact with no matching attributes  
✓ should validate input parameters

Test Suites: 1 passed
Tests: 3 passed
Coverage: 86% statements, 75% branches
```

### **Integration Test Results**
```bash
✓ should create a contact successfully
✓ should validate required fields
✓ should retrieve a contact by ID
✓ should find matches between contacts

Test Suites: 1 passed
Tests: 4 passed
```

### **Load Test Results**
```bash
✓ contact creation status is 201
✓ matching response time < 5s
✓ error rate < 10%

checks.........................: 95.2% ✓ 1428 ✗ 72
http_req_duration..............: avg=1.2s min=245ms med=987ms max=4.8s p(95)=2.1s
http_req_failed................: 4.8% ✓ 72 ✗ 1428
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Unit Tests Failing**
```bash
# Clear Jest cache
npm test -- --clearCache

# Run specific test file
npm test -- matching.service.test.ts
```

#### **Integration Tests Can't Connect**
```bash
# Check if emulator is running
curl http://localhost:8080

# Restart emulator
firebase emulators:start --only firestore --project test-project
```

#### **Load Tests Timing Out**
```bash
# Check service is accessible
curl https://your-service-url.run.app/health

# Reduce concurrent users
# Edit tests/load/contact-load-test.js: target: 5 (instead of 20)
```

#### **Firebase Permission Errors**
```bash
# Re-authenticate
gcloud auth login
gcloud config set project investor-match-ai
```

---

## 📈 **Monitoring & Metrics**

### **Key Metrics to Track**
- **Test Coverage**: Aim for 80%+ overall
- **Test Execution Time**: Unit tests < 30s, Integration < 2min
- **Load Test Performance**: Meet targets above
- **Deployment Success Rate**: 95%+

### **Tools**
- **Jest**: Unit test coverage reports
- **k6**: Load test metrics and graphs
- **Cloud Run**: Production monitoring
- **Firebase**: Database performance metrics

---

## 🎯 **Best Practices**

### **Development Workflow**
1. **Write tests first** (TDD) or alongside code
2. **Run unit tests** during development
3. **Run integration tests** before committing
4. **Run load tests** before major releases

### **Test Maintenance**
- **Update tests** when changing business logic
- **Remove obsolete tests** when removing features
- **Keep tests simple** and focused on one thing
- **Use descriptive test names** that explain what's being tested

### **Performance Optimization**
- **Monitor trends** in load test results
- **Optimize slow endpoints** identified in testing
- **Scale infrastructure** based on load test findings
- **Cache frequently accessed data**

---

## 📞 **Getting Help**

### **Test Issues**
- Check this guide first
- Review error messages carefully
- Run tests in isolation to identify problems
- Check service logs for deployment issues

### **Performance Issues**
- Run load tests to identify bottlenecks
- Check Cloud Run metrics
- Review Firestore query performance
- Consider caching strategies

**Remember**: Testing is not just about finding bugs - it's about building confidence that your system works correctly under all conditions! 🚀
