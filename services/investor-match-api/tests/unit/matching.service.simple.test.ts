/**
 * 📚 SIMPLIFIED MATCHING SERVICE TESTS
 * These tests focus on testing individual functions rather than the complex full flow
 */

import { MatchingService } from '../../src/services/matching.service';

// Simple mock that always works
jest.mock('../../src/config/firebase', () => {
  const mockContact = {
    id: 'test123',
    full_name: 'Test User',
    contact_type: 'founder',
    skills: ['javascript'],
    industries: ['fintech'],
    job_to_be_done: [],
    verticals: [],
    product_types: [],
    funding_stages: [],
    company_headcount_ranges: [],
    engineering_headcount_ranges: [],
    founder_roles: [],
    investor_roles: [],
    target_domains: [],
    roles: [],
    seniority_levels: [],
    past_companies: [],
    stage_preferences: [],
    check_size_range: [],
    team_size_preferences: [],
    founder_seniority_preferences: [],
    engineering_headcount_preferences: [],
    revenue_model_preferences: [],
    risk_tolerance_preferences: [],
    distribution_capability_ids: [],
    distribution_capability_labels: [],
    distribution_quality_bucket_ids: [],
    experiences: [],
    current_company: null,
    current_role: null,
    location_city: null,
    location_country: null,
    linkedin_url: null,
    email: null,
    headline: 'Test',
    created_at: { _seconds: 123 } as any,
    updated_at: { _seconds: 123 } as any
  };

  return {
    collections: {
      contacts: () => ({
        doc: (id?: string) => ({
          get: jest.fn().mockResolvedValue(
            id
              ? {
                  exists: true,
                  data: () => mockContact
                }
              : { exists: false }
          )
        })
      }),
      skills: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) }) }),
      industries: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) }) }),
      verticals: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) }) }),
      productTypes: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) }) }),
      fundingStages: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) }) }),
      companyHeadcountRanges: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) }) }),
      engineeringHeadcountRanges: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) }) }),
      targetDomains: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) }) }),
      roles: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) }) }),
      jobToBeDone: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ exists: false }) }) })
    }
  };
});

describe('MatchingService - Simple Tests', () => {
  let matchingService: MatchingService;

  beforeEach(() => {
    matchingService = new MatchingService();
  });

  test('should create MatchingService instance', () => {
    // 📚 LESSON: This tests that our class can be instantiated
    expect(matchingService).toBeInstanceOf(MatchingService);
  });

  test('should handle contact with no matching attributes', async () => {
    // 📚 LESSON: This tests the "no matches found" scenario
    const result = await matchingService.matchContact('test123', 'investor', 5);
    
    expect(result).toBeDefined();
    expect(result.candidates).toEqual([]);
    expect(result.totalMatches).toBe(0);
    expect(result.seedContact.id).toBe('test123');
  });

  test('should validate input parameters', async () => {
    // 📚 LESSON: This tests error handling for invalid inputs
    await expect(
      matchingService.matchContact('', 'investor', 5)
    ).rejects.toThrow();
  });
});

/**
 * 📚 WHAT WE LEARNED:
 * 
 * 1. **Start Simple**: Complex mocks are hard to get right
 * 2. **Test One Thing**: Each test should verify one specific behavior  
 * 3. **Mock Minimally**: Only mock what you need for each test
 * 4. **Iterate**: It's normal to fix tests multiple times
 * 
 * These simple tests give us confidence that:
 * - Our class can be created ✅
 * - It handles empty results ✅  
 * - It validates inputs ✅
 */
