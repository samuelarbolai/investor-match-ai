/**
 * 📚 PERFORMANCE BENCHMARKING
 * This script measures specific performance metrics for our API
 */

import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

// 📚 LESSON: Custom metrics for specific operations
const contactCreationTime = new Trend('contact_creation_duration');
const matchingTime = new Trend('matching_duration');
const contactRetrievalTime = new Trend('contact_retrieval_duration');

export const options = {
  scenarios: {
    // 📚 LESSON: Different test scenarios
    contact_creation_benchmark: {
      executor: 'constant-vus',
      vus: 5,
      duration: '2m',
      tags: { test_type: 'creation' },
    },
    matching_benchmark: {
      executor: 'constant-vus',
      vus: 3,
      duration: '2m',
      startTime: '2m',
      tags: { test_type: 'matching' },
    },
  },
  thresholds: {
    // 📚 LESSON: Performance benchmarks based on our requirements
    contact_creation_duration: ['p(95)<3000', 'p(50)<1500'], // 95% under 3s, 50% under 1.5s
    matching_duration: ['p(95)<5000', 'p(50)<2000'],         // 95% under 5s, 50% under 2s
    contact_retrieval_duration: ['p(95)<1000', 'p(50)<500'], // 95% under 1s, 50% under 0.5s
  },
};

const BASE_URL = 'https://investor-match-ai-contact-service-23715448976.us-central1.run.app';

// 📚 LESSON: Pre-created contacts for matching tests
let existingContacts = [];

export function setup() {
  // 📚 LESSON: Setup phase - create some contacts for matching tests
  console.log('Setting up test data...');
  
  for (let i = 0; i < 10; i++) {
    const contactData = {
      full_name: `Benchmark Contact ${i}`,
      headline: 'Test User',
      contact_type: i % 2 === 0 ? 'founder' : 'investor',
      skills: ['javascript', 'python', `skill_${i}`],
      industries: ['fintech', `industry_${i}`],
      verticals: ['b2b'],
      product_types: ['saas'],
      funding_stages: ['seed'],
      company_headcount_ranges: ['1-10'],
      engineering_headcount_ranges: ['1-5'],
      target_domains: ['enterprise'],
      roles: ['engineer']
    };
    
    const response = http.post(`${BASE_URL}/v1/contacts`, JSON.stringify(contactData), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.status === 201) {
      existingContacts.push(JSON.parse(response.body).id);
    }
  }
  
  console.log(`Created ${existingContacts.length} contacts for benchmarking`);
  return { contactIds: existingContacts };
}

export default function (data) {
  const testType = __ENV.K6_SCENARIO_NAME || 'contact_creation_benchmark';
  
  if (testType === 'contact_creation_benchmark') {
    // 📚 LESSON: Benchmark contact creation performance
    benchmarkContactCreation();
  } else if (testType === 'matching_benchmark') {
    // 📚 LESSON: Benchmark matching performance
    benchmarkMatching(data.contactIds);
  }
}

function benchmarkContactCreation() {
  const userId = Math.floor(Math.random() * 100000);
  
  const contactData = {
    full_name: `Performance Test User ${userId}`,
    headline: 'Benchmark User',
    contact_type: 'founder',
    skills: ['performance_testing', 'benchmarking'],
    industries: ['testing'],
    verticals: ['b2b'],
    product_types: ['saas'],
    funding_stages: ['seed'],
    company_headcount_ranges: ['1-10'],
    engineering_headcount_ranges: ['1-5'],
    target_domains: ['enterprise'],
    roles: ['engineer']
  };
  
  const startTime = Date.now();
  const response = http.post(`${BASE_URL}/v1/contacts`, JSON.stringify(contactData), {
    headers: { 'Content-Type': 'application/json' },
  });
  const endTime = Date.now();
  
  // 📚 LESSON: Record custom metrics
  contactCreationTime.add(endTime - startTime);
  
  const success = check(response, {
    'contact creation successful': (r) => r.status === 201,
    'response has contact ID': (r) => JSON.parse(r.body).id !== undefined,
  });
  
  if (success && response.status === 201) {
    const contactId = JSON.parse(response.body).id;
    
    // Also benchmark retrieval
    const retrievalStart = Date.now();
    const getResponse = http.get(`${BASE_URL}/v1/contacts/${contactId}`);
    const retrievalEnd = Date.now();
    
    contactRetrievalTime.add(retrievalEnd - retrievalStart);
    
    check(getResponse, {
      'contact retrieval successful': (r) => r.status === 200,
    });
  }
}

function benchmarkMatching(contactIds) {
  if (!contactIds || contactIds.length === 0) {
    console.log('No contacts available for matching benchmark');
    return;
  }
  
  const randomContactId = contactIds[Math.floor(Math.random() * contactIds.length)];
  const targetType = Math.random() < 0.5 ? 'founder' : 'investor';
  
  const startTime = Date.now();
  const response = http.get(`${BASE_URL}/v1/contacts/${randomContactId}/matches?targetType=${targetType}&limit=10`);
  const endTime = Date.now();
  
  // 📚 LESSON: Record matching performance
  matchingTime.add(endTime - startTime);
  
  check(response, {
    'matching request successful': (r) => r.status === 200,
    'matching returns results': (r) => {
      const body = JSON.parse(r.body);
      return body.candidates !== undefined && body.seedContact !== undefined;
    },
  });
}

export function teardown(data) {
  // 📚 LESSON: Cleanup phase - remove test data
  console.log('Cleaning up test data...');
  
  if (data.contactIds) {
    data.contactIds.forEach(contactId => {
      http.del(`${BASE_URL}/v1/contacts/${contactId}`);
    });
  }
}

/**
 * 📚 PERFORMANCE TARGETS:
 * 
 * **Contact Creation:**
 * - 95% under 3 seconds
 * - 50% under 1.5 seconds
 * 
 * **Matching Queries:**
 * - 95% under 5 seconds  
 * - 50% under 2 seconds
 * 
 * **Contact Retrieval:**
 * - 95% under 1 second
 * - 50% under 0.5 seconds
 * 
 * **Why These Targets?**
 * - Users expect fast responses
 * - Matching is complex, so 2-5s is acceptable
 * - Simple operations should be sub-second
 * 
 * Run with: k6 run performance-benchmark.js
 */
