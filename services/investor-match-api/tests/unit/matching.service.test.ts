import { MatchingService } from '../../src/services/matching.service';
import { Contact } from '../../src/models/contact.model';

type AttributeStore = Record<string, Record<string, string[]>>;

jest.mock('../../src/config/firebase', () => {
  const attributeCollections = [
    'skills',
    'industries',
    'verticals',
    'productTypes',
    'fundingStages',
    'companyHeadcountRanges',
    'engineeringHeadcountRanges',
    'targetDomains',
    'roles',
    'raisedCapitalRanges',
    'distributionCapabilities',
    'targetCriteria',
    'companies',
    'jobToBeDone'
  ] as const;
  const contactStore: Record<string, Contact> = {};
  const attributeStore: AttributeStore = {};

  const resetAttributes = () => {
    attributeCollections.forEach(collection => {
      attributeStore[collection] = {};
    });
  };

  resetAttributes();

  const createAttributeCollection = (collection: typeof attributeCollections[number]) => () => ({
    doc: (id: string) => ({
      get: jest.fn().mockResolvedValue(
        attributeStore[collection][id]
          ? { exists: true, data: () => ({ contact_ids: attributeStore[collection][id] }) }
          : { exists: false }
      )
    })
  });

  return {
    collections: {
      contacts: () => ({
        doc: (id: string) => ({
          get: jest.fn().mockResolvedValue(
            contactStore[id]
              ? { exists: true, data: () => contactStore[id] }
              : { exists: false }
          )
        }),
        limit: () => ({
          get: jest.fn().mockResolvedValue({
            docs: Object.keys(contactStore).map(id => ({ id }))
          })
        })
      }),
      skills: createAttributeCollection('skills'),
      industries: createAttributeCollection('industries'),
      verticals: createAttributeCollection('verticals'),
      productTypes: createAttributeCollection('productTypes'),
      fundingStages: createAttributeCollection('fundingStages'),
      companyHeadcountRanges: createAttributeCollection('companyHeadcountRanges'),
      engineeringHeadcountRanges: createAttributeCollection('engineeringHeadcountRanges'),
      targetDomains: createAttributeCollection('targetDomains'),
      roles: createAttributeCollection('roles'),
      raisedCapitalRanges: createAttributeCollection('raisedCapitalRanges'),
      distributionCapabilities: createAttributeCollection('distributionCapabilities'),
      targetCriteria: createAttributeCollection('targetCriteria'),
      companies: createAttributeCollection('companies'),
      jobToBeDone: createAttributeCollection('jobToBeDone')
    },
    __setMockContact: (id: string, contact: Contact) => {
      contactStore[id] = contact;
    },
    __setMockAttributeDoc: (collection: string, id: string, contactIds: string[]) => {
      if (!attributeStore[collection]) {
        attributeStore[collection] = {};
      }
      attributeStore[collection][id] = contactIds;
    },
    __resetMockStores: () => {
      Object.keys(contactStore).forEach(key => delete contactStore[key]);
      resetAttributes();
    }
  };
});

const firebaseMock = require('../../src/config/firebase');
const { __setMockContact, __setMockAttributeDoc, __resetMockStores } = firebaseMock as {
  __setMockContact: (id: string, contact: Contact) => void;
  __setMockAttributeDoc: (collection: string, id: string, contactIds: string[]) => void;
  __resetMockStores: () => void;
};

const baseContact: Contact = {
  id: '',
  full_name: '',
  headline: '',
  contact_type: 'founder',
  location_city: null,
  location_country: null,
  job_to_be_done: [],
  current_company: null,
  current_company_id: null,
  current_role: null,
  past_companies: [],
  roles: [],
  skills: [],
  seniority_levels: [],
  industries: [],
  verticals: [],
  product_types: [],
  raised_capital_range_ids: [],
  raised_capital_range_labels: [],
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
  distribution_capability_ids: [],
  distribution_capability_labels: [],
  target_criterion_ids: [],
  target_criterion_summaries: [],
  target_industries: [],
  target_verticals: [],
  target_skills: [],
  target_roles: [],
  target_product_types: [],
  target_raised_capital_range_ids: [],
  target_raised_capital_range_labels: [],
  target_company_headcount_ranges: [],
  target_engineering_headcount_ranges: [],
  target_distribution_capability_ids: [],
  target_distribution_capability_labels: [],
  target_location_cities: [],
  target_location_countries: [],
  target_foundation_years: [],
  target_mrr_ranges: [],
  target_company_ids: [],
  experiences: [],
  experience_company_ids: [],
  action_status: 'action_required',
  linkedin_url: null,
  email: null,
  created_at: { _seconds: 0 } as any,
  updated_at: { _seconds: 0 } as any,
  stage_counts: undefined
};

function buildContact(overrides: Partial<Contact>): Contact {
  return {
    ...baseContact,
    ...overrides
  };
}

describe('MatchingService', () => {
  let matchingService: MatchingService;

  beforeEach(() => {
    __resetMockStores();
    matchingService = new MatchingService();
  });

  describe('matchContact', () => {
    test('matches founders to investors using shared skills and industries', async () => {
      const founder = buildContact({
        id: 'founder-1',
        full_name: 'Founder Example',
        contact_type: 'founder',
        skills: ['javascript', 'python'],
        industries: ['fintech'],
        location_country: 'USA'
      });
      const investor = buildContact({
        id: 'investor-1',
        full_name: 'Investor Example',
        contact_type: 'investor',
        skills: ['python', 'finance'],
        industries: ['fintech'],
        location_country: 'USA'
      });

      __setMockContact(founder.id, founder);
      __setMockContact(investor.id, investor);
      __setMockAttributeDoc('skills', 'javascript', [investor.id]);
      __setMockAttributeDoc('skills', 'python', [investor.id]);
      __setMockAttributeDoc('industries', 'fintech', [investor.id]);

      const result = await matchingService.matchContact(founder.id, 'investor', 5);

      expect(result.seedContact.id).toBe(founder.id);
      expect(result.candidates).toHaveLength(1);
      expect(result.candidates[0].contact.id).toBe(investor.id);
      expect(result.candidates[0].overlaps.some(o => o.attribute === 'skills')).toBe(true);
    });

    test('uses investor target thesis when matching founders', async () => {
      const investor = buildContact({
        id: 'investor-seed',
        contact_type: 'investor',
        target_industries: ['climate'],
        target_location_countries: ['CA'],
        location_country: 'CA'
      });
      const founder = buildContact({
        id: 'founder-target',
        contact_type: 'founder',
        industries: ['climate'],
        location_country: 'CA'
      });
      const outsider = buildContact({
        id: 'founder-out',
        contact_type: 'founder',
        industries: ['fintech'],
        location_country: 'US'
      });

      __setMockContact(investor.id, investor);
      __setMockContact(founder.id, founder);
      __setMockContact(outsider.id, outsider);

      __setMockAttributeDoc('industries', 'climate', [founder.id]);
      __setMockAttributeDoc('industries', 'fintech', [outsider.id]);

      const result = await matchingService.matchContact(investor.id, 'founder', 5);

      expect(result.candidates).toHaveLength(1);
      expect(result.candidates[0].contact.id).toBe(founder.id);
    });

    test('filters out founders when target thesis location does not match', async () => {
      const investor = buildContact({
        id: 'investor-loc',
        contact_type: 'investor',
        target_industries: ['fintech'],
        target_location_countries: ['UK']
      });
      const founder = buildContact({
        id: 'founder-loc',
        contact_type: 'founder',
        industries: ['fintech'],
        location_country: 'US'
      });

      __setMockContact(investor.id, investor);
      __setMockContact(founder.id, founder);
      __setMockAttributeDoc('industries', 'fintech', [founder.id]);

      const result = await matchingService.matchContact(investor.id, 'founder', 5);

      expect(result.candidates).toHaveLength(0);
      expect(result.totalMatches).toBe(0);
    });

    test('throws when seed contact is missing', async () => {
      await expect(matchingService.matchContact('missing', 'investor', 5))
        .rejects.toThrow('Contact missing not found');
    });
  });
});
