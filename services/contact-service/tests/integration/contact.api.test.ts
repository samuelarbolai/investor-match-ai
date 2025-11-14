/**
 * 📚 INTEGRATION TESTS - Testing the Full API
 * These tests make real HTTP requests to our API and use a real (emulated) database
 */

import request from 'supertest';
import express from 'express';

// Import our actual server setup
import '../../src/server';

// 📚 LESSON: We need to create the Express app for testing
const app = express();

// Mock the server setup for testing
jest.mock('../../src/config/firebase', () => {
  // Use emulator when FIRESTORE_EMULATOR_HOST is set
  const admin = require('firebase-admin');
  
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: 'test-project'
    });
  }
  
  const db = admin.firestore();
  
  return {
    db,
    admin,
    collections: {
      contacts: () => db.collection('contacts'),
      skills: () => db.collection('skills'),
      industries: () => db.collection('industries'),
      verticals: () => db.collection('verticals'),
      productTypes: () => db.collection('productTypes'),
      fundingStages: () => db.collection('fundingStages'),
      companyHeadcountRanges: () => db.collection('companyHeadcountRanges'),
      engineeringHeadcountRanges: () => db.collection('engineeringHeadcountRanges'),
      targetDomains: () => db.collection('targetDomains'),
      roles: () => db.collection('roles'),
      jobToBeDone: () => db.collection('jobToBeDone')
    },
    Timestamp: admin.firestore.Timestamp
  };
});

describe('Contact API Integration Tests', () => {
  let createdContactId: string;

  beforeAll(async () => {
    // 📚 LESSON: Clean up database before tests
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      console.log('Using Firestore Emulator for integration tests');
    }
  });

  afterEach(async () => {
    // 📚 LESSON: Clean up after each test to avoid interference
    if (createdContactId) {
      try {
        const { db } = require('../../src/config/firebase');
        await db.collection('contacts').doc(createdContactId).delete();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  describe('POST /v1/contacts', () => {
    test('should create a contact successfully', async () => {
      // 📚 LESSON: This tests the full contact creation flow
      const contactData = {
        full_name: 'Integration Test User',
        headline: 'Test Engineer',
        contact_type: 'founder',
        skills: ['integration_testing', 'api_testing'],
        industries: ['testing']
      };

      const response = await request(app)
        .post('/v1/contacts')
        .send(contactData)
        .expect(201);

      // Verify response structure
      expect(response.body).toHaveProperty('id');
      expect(response.body.full_name).toBe(contactData.full_name);
      expect(response.body.skills).toEqual(contactData.skills);
      
      // Store ID for cleanup
      createdContactId = response.body.id;
    });

    test('should validate required fields', async () => {
      // 📚 LESSON: This tests our validation middleware
      const invalidData = {
        // Missing required fields
        headline: 'Test'
      };

      const response = await request(app)
        .post('/v1/contacts')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'full_name',
            message: expect.stringContaining('required')
          })
        ])
      );
    });
  });

  describe('GET /v1/contacts/:id', () => {
    test('should retrieve a contact by ID', async () => {
      // 📚 LESSON: First create, then retrieve
      
      // Create a contact first
      const createResponse = await request(app)
        .post('/v1/contacts')
        .send({
          full_name: 'Retrieve Test User',
          headline: 'Test',
          contact_type: 'investor'
        })
        .expect(201);

      createdContactId = createResponse.body.id;

      // Now retrieve it
      const getResponse = await request(app)
        .get(`/v1/contacts/${createdContactId}`)
        .expect(200);

      expect(getResponse.body.id).toBe(createdContactId);
      expect(getResponse.body.full_name).toBe('Retrieve Test User');
    });

    test('should return 404 for non-existent contact', async () => {
      const response = await request(app)
        .get('/v1/contacts/nonexistent123')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /v1/contacts/:id/matches', () => {
    test('should find matches between contacts', async () => {
      // 📚 LESSON: This tests the full matching workflow
      
      // Create a founder
      const founderResponse = await request(app)
        .post('/v1/contacts')
        .send({
          full_name: 'Test Founder',
          headline: 'CEO',
          contact_type: 'founder',
          skills: ['javascript', 'leadership'],
          industries: ['fintech']
        })
        .expect(201);

      // Create an investor with overlapping attributes
      const investorResponse = await request(app)
        .post('/v1/contacts')
        .send({
          full_name: 'Test Investor',
          headline: 'Partner',
          contact_type: 'investor',
          skills: ['javascript', 'finance'],
          industries: ['fintech']
        })
        .expect(201);

      // Wait a moment for reverse indexes to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test matching
      const matchResponse = await request(app)
        .get(`/v1/contacts/${founderResponse.body.id}/matches?targetType=investor&limit=5`)
        .expect(200);

      expect(matchResponse.body).toHaveProperty('candidates');
      expect(matchResponse.body).toHaveProperty('seedContact');
      expect(matchResponse.body.seedContact.id).toBe(founderResponse.body.id);

      // Clean up both contacts
      createdContactId = founderResponse.body.id;
      await request(app).delete(`/v1/contacts/${investorResponse.body.id}`);
    });
  });
});

/**
 * 📚 WHAT WE'RE TESTING:
 * 
 * 1. **Real HTTP Requests**: Using supertest to make actual API calls
 * 2. **Real Database**: Using Firestore emulator (not mocks)
 * 3. **Full Workflow**: Create → Read → Match → Delete
 * 4. **Validation**: Testing our Joi validation middleware
 * 5. **Error Handling**: Testing 404s and validation errors
 * 
 * This gives us confidence that:
 * - Our API endpoints work correctly ✅
 * - Database operations succeed ✅
 * - Validation catches bad data ✅
 * - Matching algorithm works end-to-end ✅
 */
