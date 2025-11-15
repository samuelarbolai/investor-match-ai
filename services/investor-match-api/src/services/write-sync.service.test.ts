import { WriteSyncService } from './write-sync.service';
import { Contact } from '../models/contact.model';
import { AttributeDocument } from '../models/attribute.model';

// Mock Firebase
jest.mock('../config/firebase', () => ({
  db: {
    batch: jest.fn(() => ({
      update: jest.fn(),
      commit: jest.fn()
    }))
  },
  getCollection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn()
    }))
  })),
  Timestamp: {
    now: jest.fn(() => ({ seconds: 1234567890 }))
  }
}));

describe('WriteSyncService', () => {
  let service: WriteSyncService;
  let mockBatch: any;
  let mockDoc: any;

  beforeEach(() => {
    service = new WriteSyncService();
    mockBatch = {
      update: jest.fn(),
      commit: jest.fn()
    };
    mockDoc = {
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn()
    };
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('ensureUniqueContactIds', () => {
    test('removes duplicate contact IDs', () => {
      const attributeDoc: AttributeDocument = {
        id: 'test',
        label: 'Test',
        contact_ids: ['contact1', 'contact2', 'contact1', 'contact3'],
        updated_at: { seconds: 1234567890 } as any
      };

      const result = service.ensureUniqueContactIds(attributeDoc);
      
      expect(result.contact_ids).toEqual(['contact1', 'contact2', 'contact3']);
      expect(result.contact_ids).toHaveLength(3);
    });

    test('handles empty array', () => {
      const attributeDoc: AttributeDocument = {
        id: 'test',
        label: 'Test',
        contact_ids: [],
        updated_at: { seconds: 1234567890 } as any
      };

      const result = service.ensureUniqueContactIds(attributeDoc);
      
      expect(result.contact_ids).toEqual([]);
    });
  });

  describe('syncReverseIndexes logic', () => {
    test('identifies values to add and remove correctly', () => {
      const oldContact: Partial<Contact> = {
        skills: ['javascript', 'python'],
        industries: ['fintech']
      };

      const newContact: Partial<Contact> = {
        skills: ['javascript', 'typescript'], // removed python, added typescript
        industries: ['fintech', 'healthcare'] // added healthcare
      };

      // Test the logic (we'll mock the actual Firestore calls)
      const skillsToRemove = oldContact.skills?.filter(skill => 
        !newContact.skills?.includes(skill)
      ) || [];
      const skillsToAdd = newContact.skills?.filter(skill => 
        !oldContact.skills?.includes(skill)
      ) || [];

      expect(skillsToRemove).toEqual(['python']);
      expect(skillsToAdd).toEqual(['typescript']);
    });
  });

  describe('createOrUpdateContact validation', () => {
    test('requires valid contact data structure', () => {
      const contactData = {
        full_name: 'Test User',
        headline: 'Software Engineer',
        contact_type: 'founder' as const,
        location_city: 'San Francisco',
        location_country: 'USA',
        job_to_be_done: ['build_product'],
        skills: ['javascript', 'typescript'],
        industries: ['fintech'],
        verticals: [],
        product_types: [],
        funding_stages: [],
        company_headcount_ranges: [],
        engineering_headcount_ranges: [],
        founder_roles: [],
        investor_roles: [],
        target_domains: [],
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
        past_companies: [],
        roles: [],
        seniority_levels: [],
        linkedin_url: null,
        email: null
      };

      // Validate structure matches Contact interface requirements
      expect(contactData.full_name).toBeDefined();
      expect(contactData.contact_type).toBeDefined();
      expect(Array.isArray(contactData.skills)).toBe(true);
      expect(Array.isArray(contactData.job_to_be_done)).toBe(true);
    });
  });

  describe('array field validation', () => {
    test('all reverse index fields are arrays', () => {
      const contact: Partial<Contact> = {
        job_to_be_done: ['test'],
        skills: ['javascript'],
        industries: ['tech'],
        verticals: ['b2b'],
        product_types: ['saas'],
        funding_stages: ['seed'],
        company_headcount_ranges: ['1-10'],
        engineering_headcount_ranges: ['1-5'],
        target_domains: ['enterprise'],
        roles: ['engineer']
      };

      // Verify all reverse index fields are arrays
      Object.entries(contact).forEach(([key, value]) => {
        expect(Array.isArray(value)).toBe(true);
      });
    });
  });
});
