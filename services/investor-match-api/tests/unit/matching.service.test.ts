import { MatchingService } from '../../src/services/matching.service';
import { Contact, ContactType } from '../../src/models/contact.model';

// Mock Firebase collections - Proper way
const mockGet = jest.fn();
const mockDoc = jest.fn(() => ({ get: mockGet }));

jest.mock('../../src/config/firebase', () => ({
  collections: {
    contacts: () => ({ doc: mockDoc }),
    skills: () => ({ doc: mockDoc }),
    industries: () => ({ doc: mockDoc }),
    verticals: () => ({ doc: mockDoc }),
    productTypes: () => ({ doc: mockDoc }),
    fundingStages: () => ({ doc: mockDoc }),
    companyHeadcountRanges: () => ({ doc: mockDoc }),
    engineeringHeadcountRanges: () => ({ doc: mockDoc }),
    targetDomains: () => ({ doc: mockDoc }),
    roles: () => ({ doc: mockDoc }),
    jobToBeDone: () => ({ doc: mockDoc })
  }
}));

describe('MatchingService', () => {
  let matchingService: MatchingService;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    matchingService = new MatchingService();
  });

  describe('matchContact', () => {
    const mockSeedContact: Contact = {
      id: 'seed123',
      full_name: 'Alice Founder',
      headline: 'CEO',
      contact_type: 'founder',
      location_city: null,
      location_country: null,
      job_to_be_done: ['build_product'],
      skills: ['javascript', 'python'],
      industries: ['fintech'],
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
      experiences: [],
      current_company: null,
      current_role: null,
      linkedin_url: null,
      email: null,
      created_at: { _seconds: 123456789 } as any,
      updated_at: { _seconds: 123456789 } as any
    };

    const mockInvestorContact: Contact = {
      ...mockSeedContact,
      id: 'investor123',
      full_name: 'Bob Investor',
      contact_type: 'investor',
      skills: ['python', 'finance'],
      industries: ['fintech']
    };

    test('should find matching contacts successfully', async () => {
      // 📚 LESSON: This test checks if our matching algorithm works
      
      // Mock seed contact retrieval
      mockGet
        .mockResolvedValueOnce({
          exists: true,
          data: () => mockSeedContact
        })
        // Mock attribute document (skills/javascript)
        .mockResolvedValueOnce({
          exists: true,
          data: () => ({
            id: 'javascript',
            label: 'JavaScript',
            contact_ids: ['investor123']
          })
        })
        // Mock attribute document (skills/python)  
        .mockResolvedValueOnce({
          exists: true,
          data: () => ({
            id: 'python',
            label: 'Python',
            contact_ids: ['investor123']
          })
        })
        // Mock candidate contact retrieval
        .mockResolvedValueOnce({
          exists: true,
          data: () => mockInvestorContact
        });

      const result = await matchingService.matchContact('seed123', 'investor', 5);

      // Verify results
      expect(result.candidates).toHaveLength(1);
      expect(result.candidates[0].contact.full_name).toBe('Bob Investor');
      expect(result.candidates[0].score).toBeGreaterThan(0);
      expect(result.seedContact.id).toBe('seed123');
    });

    test('should handle contact not found', async () => {
      // 📚 LESSON: This tests error handling
      
      mockGet.mockResolvedValueOnce({
        exists: false
      });

      await expect(
        matchingService.matchContact('nonexistent', 'investor', 5)
      ).rejects.toThrow('Contact nonexistent not found');
    });

    test('should handle empty results gracefully', async () => {
      // 📚 LESSON: This tests edge cases
      
      const contactWithNoSkills = { ...mockSeedContact, skills: [], industries: [] };
      
      mockGet.mockResolvedValueOnce({
        exists: true,
        data: () => contactWithNoSkills
      });

      const result = await matchingService.matchContact('seed123', 'investor', 5);

      expect(result.candidates).toHaveLength(0);
      expect(result.totalMatches).toBe(0);
    });
  });
});
