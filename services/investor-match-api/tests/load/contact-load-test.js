/**
 * 📚 LOAD TESTING WITH K6
 * This script simulates many users hitting our API at the same time
 * 
 * To run: k6 run contact-load-test.js
 * To install k6: brew install k6 (on macOS)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// 📚 LESSON: Custom metrics to track our specific goals
const errorRate = new Rate('errors');

// 📚 LESSON: Load test configuration
export const options = {
  stages: [
    { duration: '30s', target: 5 },   // Ramp up to 5 users over 30s
    { duration: '1m', target: 10 },   // Stay at 10 users for 1 minute
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users for 1 minute
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    // 📚 LESSON: Performance requirements
    http_req_duration: ['p(95)<2000'], // 95% of requests must be under 2s
    http_req_failed: ['rate<0.1'],     // Error rate must be under 10%
    errors: ['rate<0.1'],              // Custom error rate under 10%
  },
};

// 📚 LESSON: Base URL - change this to your deployed service
const BASE_URL = 'https://investor-match-api-23715448976.us-east1.run.app';
const ownerPool = [];
const investorPool = [];

// 📚 LESSON: Test data templates
const founderTemplate = {
  full_name: 'Load Test Founder',
  headline: 'CEO & Founder',
  contact_type: 'founder',
  skills: ['javascript', 'leadership', 'product_management'],
  industries: ['fintech', 'saas'],
  verticals: ['b2b'],
  product_types: ['saas'],
  funding_stages: ['seed'],
  company_headcount_ranges: ['1-10'],
  engineering_headcount_ranges: ['1-5'],
  target_domains: ['enterprise'],
  roles: ['ceo']
};

const investorTemplate = {
  full_name: 'Load Test Investor',
  headline: 'Investment Partner',
  contact_type: 'investor',
  skills: ['finance', 'due_diligence', 'javascript'],
  industries: ['fintech', 'enterprise_software'],
  verticals: ['b2b'],
  product_types: ['saas'],
  funding_stages: ['seed', 'series_a'],
  company_headcount_ranges: ['1-10', '11-50'],
  engineering_headcount_ranges: ['1-5'],
  target_domains: ['enterprise'],
  roles: ['investor']
};

export default function () {
  // 📚 LESSON: Each virtual user runs this function repeatedly
  const userId = Math.floor(Math.random() * 10000);
  
  // Test 1: Create a contact (70% of requests)
  if (Math.random() < 0.7) {
    const isFounder = Math.random() < 0.5;
    const contactData = isFounder ? 
      { ...founderTemplate, full_name: `${founderTemplate.full_name} ${userId}` } :
      { ...investorTemplate, full_name: `${investorTemplate.full_name} ${userId}` };
    
    const createResponse = http.post(`${BASE_URL}/v1/contacts`, JSON.stringify(contactData), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    const createSuccess = check(createResponse, {
      'contact creation status is 201': (r) => r.status === 201,
      'contact creation response time < 3s': (r) => r.timings.duration < 3000,
      'contact has ID': (r) => JSON.parse(r.body).id !== undefined,
    });
    
    errorRate.add(!createSuccess);
    
    // If contact created successfully, test retrieval
    if (createResponse.status === 201) {
      const body = JSON.parse(createResponse.body);
      const contactId = body.id;

      if (isFounder) {
        ownerPool.push(contactId);
      } else {
        investorPool.push(contactId);
      }
      
      sleep(0.5); // Brief pause between operations
      
      // Test 2: Get the contact
      const getResponse = http.get(`${BASE_URL}/v1/contacts/${contactId}`);
      
      const getSuccess = check(getResponse, {
        'contact retrieval status is 200': (r) => r.status === 200,
        'contact retrieval response time < 1s': (r) => r.timings.duration < 1000,
      });
      
      errorRate.add(!getSuccess);
      
      sleep(0.5);
      
      // Simulate pipeline updates between founders & investors
      if (ownerPool.length > 0 && investorPool.length > 0) {
        const ownerId = ownerPool[Math.floor(Math.random() * ownerPool.length)];
        const targetId = investorPool[Math.floor(Math.random() * investorPool.length)];
        const stageResponse = http.post(`${BASE_URL}/v1/introductions/stage`, JSON.stringify({
          ownerId,
          targetId,
          stage: Math.random() > 0.5 ? 'lead' : 'prospect'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        errorRate.add(stageResponse.status !== 201);
      }

      if (ownerPool.length >= 1 && Math.random() < 0.4) {
        const ownerId = ownerPool[Math.floor(Math.random() * ownerPool.length)];
        const summaryResponse = http.get(`${BASE_URL}/v1/introductions/stage/summary?ownerId=${ownerId}`);
        errorRate.add(summaryResponse.status !== 200);
      }

      if (ownerPool.length >= 1 && investorPool.length >= 2 && Math.random() < 0.3) {
        const ownerId = ownerPool[Math.floor(Math.random() * ownerPool.length)];
        const updates = investorPool.slice(-2).map(targetId => ({
          targetId,
          stage: Math.random() > 0.5 ? 'met' : 'to-meet'
        }));
        const bulkResponse = http.post(`${BASE_URL}/v1/introductions/stages/bulk-update`, JSON.stringify({
          ownerId,
          updates
        }), { headers: { 'Content-Type': 'application/json' } });
        errorRate.add(bulkResponse.status !== 204);
      }

      if (ownerPool.length > 0 && Math.random() < 0.2) {
        const ownerId = ownerPool[Math.floor(Math.random() * ownerPool.length)];
        const recomputeResponse = http.post(`${BASE_URL}/v1/introductions/stage/recompute`, JSON.stringify({ ownerId }), {
          headers: { 'Content-Type': 'application/json' }
        });
        errorRate.add(recomputeResponse.status !== 200);
      }

      // Test 3: Find matches (30% chance)
      if (Math.random() < 0.3) {
        const targetType = isFounder ? 'investor' : 'founder';
        const matchResponse = http.get(`${BASE_URL}/v1/contacts/${contactId}/matches?targetType=${targetType}&limit=5`);
        
        const matchSuccess = check(matchResponse, {
          'matching status is 200': (r) => r.status === 200,
          'matching response time < 5s': (r) => r.timings.duration < 5000,
          'matching returns candidates': (r) => JSON.parse(r.body).candidates !== undefined,
        });
        
        errorRate.add(!matchSuccess);
      }
    }
  }
  
  // Test 4: Health check (10% of requests)
  if (Math.random() < 0.1) {
    const healthResponse = http.get(`${BASE_URL}/health`);
    
    const healthSuccess = check(healthResponse, {
      'health check status is 200': (r) => r.status === 200,
      'health check response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    errorRate.add(!healthSuccess);
  }
  
  // 📚 LESSON: Random sleep between 1-3 seconds to simulate real user behavior
  sleep(Math.random() * 2 + 1);
}

/**
 * 📚 WHAT THIS LOAD TEST DOES:
 * 
 * 1. **Simulates Real Users**: Creates contacts, retrieves them, finds matches
 * 2. **Gradual Load Increase**: Starts with 5 users, goes up to 20 users
 * 3. **Performance Monitoring**: Tracks response times and error rates
 * 4. **Success Criteria**: 
 *    - 95% of requests under 2 seconds
 *    - Error rate under 10%
 *    - Matching queries under 5 seconds
 * 
 * 5. **Real Scenarios**:
 *    - 70% contact creation
 *    - 30% matching queries  
 *    - 10% health checks
 * 
 * This tells us if our API can handle real-world traffic! 🚀
 */
