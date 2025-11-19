import { WriteSyncService } from './write-sync.service';
import { Contact } from '../models/contact.model';

const createDocRef = () => ({
  get: jest.fn().mockResolvedValue({ exists: false }),
  set: jest.fn().mockResolvedValue(undefined),
  update: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined)
});

jest.mock('../config/firebase', () => {
  const docStore: Record<string, ReturnType<typeof createDocRef>> = {};

  const getDocRef = (collection: string, docId: string) => {
    const key = `${collection}/${docId}`;
    if (!docStore[key]) {
      docStore[key] = createDocRef();
    }
    return docStore[key];
  };

  return {
    db: {
      batch: jest.fn(() => ({
        update: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined)
      }))
    },
    getCollection: jest.fn((collection: string) => ({
      doc: (docId: string) => getDocRef(collection, docId)
    })),
    Timestamp: {
      now: jest.fn(() => ({ seconds: Date.now() }))
    },
    admin: {
      firestore: {
        FieldValue: {
          arrayUnion: (...values: string[]) => ({ op: 'union', values }),
          arrayRemove: (...values: string[]) => ({ op: 'remove', values })
        }
      }
    },
    __getDocRef: getDocRef,
    __resetDocStore: () => {
      Object.keys(docStore).forEach(key => delete docStore[key]);
    }
  };
});

const firebaseMock = require('../config/firebase');
const { db, getCollection, __getDocRef, __resetDocStore } = firebaseMock as {
  db: { batch: jest.Mock };
  getCollection: jest.Mock;
  __getDocRef: (collection: string, docId: string) => ReturnType<typeof createDocRef>;
  __resetDocStore: () => void;
};

const baseContact: Contact = {
  id: 'contact-1',
  full_name: 'Test User',
  headline: 'Role',
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

describe('WriteSyncService', () => {
  let service: WriteSyncService;

  beforeEach(() => {
    service = new WriteSyncService();
    __resetDocStore();
    jest.clearAllMocks();
  });

  it('creates missing attribute documents for new target attributes', async () => {
    const oldContact: Contact = {
      ...baseContact,
      target_industries: ['fintech']
    };
    const newContact: Contact = {
      ...oldContact,
      target_industries: ['fintech', 'climate'],
      target_distribution_capability_ids: ['newsletter_weekly']
    };

    await service.syncReverseIndexes('contact-123', oldContact, newContact);

    const industryDoc = __getDocRef('industries', 'climate');
    expect(industryDoc.set).toHaveBeenCalled();

    const batchInstance = (db.batch as jest.Mock).mock.results[0].value;
    expect(batchInstance.update).toHaveBeenCalled();

    const [, payload] = batchInstance.update.mock.calls[0];
    expect(payload.contact_ids).toEqual(expect.objectContaining({ op: 'union', values: ['contact-123'] }));
  });

  it('removes values missing in updates when syncing reverse indexes', async () => {
    const prevContact: Contact = {
      ...baseContact,
      industries: ['fintech'],
      target_industries: ['climate']
    };
    const updatedContact: Contact = {
      ...prevContact,
      industries: [],
      target_industries: []
    };

    await service.syncReverseIndexes('contact-789', prevContact, updatedContact);

    const batchInstance = (db.batch as jest.Mock).mock.results[0].value;
    expect(batchInstance.update).toHaveBeenCalled();
    const [, payload] = batchInstance.update.mock.calls[0];
    expect(payload.contact_ids).toEqual(expect.objectContaining({ op: 'remove', values: ['contact-789'] }));
  });

  it('creates contact documents and synchronizes indexes on createOrUpdateContact', async () => {
    const contactRef = __getDocRef('contacts', 'new-contact');
    contactRef.get.mockResolvedValue({ exists: false });
    (getCollection as jest.Mock).mockImplementation((collection: string) => ({
      doc: (docId: string) => {
        if (collection === 'contacts') {
          return contactRef;
        }
        return __getDocRef(collection, docId);
      }
    }));

    const spy = jest.spyOn(service, 'syncReverseIndexes').mockResolvedValue();

    await service.createOrUpdateContact('new-contact', baseContact, false);

    expect(contactRef.set).toHaveBeenCalledWith(expect.objectContaining({
      id: 'new-contact'
    }));
    expect(spy).toHaveBeenCalledWith('new-contact', null, expect.any(Object));
  });

  it('ensures contact_ids are unique', () => {
    const attributeDoc = {
      id: 'doc',
      label: 'Test',
      contact_ids: ['a', 'b', 'a'],
      updated_at: { seconds: 0 } as any
    };

    const result = service.ensureUniqueContactIds(attributeDoc);
    expect(result.contact_ids).toEqual(['a', 'b']);
  });
});
