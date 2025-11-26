import { campaignService } from './campaign.service';
import { collections, db } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import type { Introduction } from '../models/introduction.model';

const introductionsCollectionMock = {
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  startAfter: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  get: jest.fn(),
  doc: jest.fn(),
};

const contactsCollectionMock = {
  doc: jest.fn((id: string) => ({ id })),
};

jest.mock('../config/firebase', () => ({
  db: {
    getAll: jest.fn(),
  },
  collections: {
    introductions: jest.fn(() => introductionsCollectionMock),
    contacts: jest.fn(() => contactsCollectionMock),
  },
}));

const buildTimestamp = (seconds: number) => new Timestamp(seconds, 0);

const buildIntroductionDoc = (id: string, targetId: string, stage: string, stageRank: number, seconds: number) => ({
  id,
  data: () => ({
    ownerId: 'owner1',
    targetId,
    stage: stage as Introduction['stage'],
    stage_rank: stageRank,
    createdAt: buildTimestamp(seconds - 5),
    updatedAt: buildTimestamp(seconds),
    metadata: stage === 'disqualified' ? { reason: 'duplicate' } : undefined,
  }),
});

const buildContactDoc = (id: string) => ({
  id,
  exists: true,
  data: () => ({
    id,
    full_name: `Contact ${id}`,
    headline: 'Owner',
    contact_type: 'investor',
    location_city: 'SF',
    location_country: 'US',
    job_to_be_done: [],
    skills: [],
    industries: [],
    verticals: [],
    product_types: [],
    funding_stages: [],
    company_headcount_ranges: [],
    engineering_headcount_ranges: [],
    target_domains: [],
    roles: [],
    experiences: [],
    current_company: 'Acme',
    current_role: 'Partner',
    past_companies: [],
    seniority_levels: [],
    founder_roles: [],
    investor_roles: [],
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
    created_at: { _seconds: 1, _nanoseconds: 0 },
    updated_at: { _seconds: 2, _nanoseconds: 0 },
    stage_counts: {},
    linkedin_url: null,
    email: `${id}@mail.com`,
  }),
});

describe('CampaignService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    introductionsCollectionMock.where.mockReturnThis();
    introductionsCollectionMock.orderBy.mockReturnThis();
    introductionsCollectionMock.startAfter.mockReturnThis();
    introductionsCollectionMock.limit.mockReturnThis();
    introductionsCollectionMock.doc.mockReturnValue({
      get: jest.fn().mockResolvedValue({ exists: true, id: 'cursor', data: () => ({}) }),
    });
  });

  it('orders campaign contacts by stage_rank and paginates', async () => {
    introductionsCollectionMock.get.mockResolvedValue({
      docs: [
        buildIntroductionDoc('owner1__c2', 'c2', 'met', 1, 25),
        buildIntroductionDoc('owner1__c3', 'c3', 'qualified', 4, 23),
        buildIntroductionDoc('owner1__c1', 'c1', 'prospect', 6, 20),
      ],
    });
    (db.getAll as jest.Mock).mockResolvedValue([
      buildContactDoc('c1'),
      buildContactDoc('c2'),
      buildContactDoc('c3'),
    ]);

    const result = await campaignService.getCampaignContacts('owner1', {
      limit: 2,
      orderBy: 'stage',
      orderDirection: 'asc',
    });

    expect(result.data.map((record) => record.contact.id)).toEqual(['c2', 'c3']);
    expect(result.pagination.hasMore).toBe(true);
    expect(result.pagination.nextCursor).toBe('owner1__c1');
    expect(introductionsCollectionMock.orderBy).toHaveBeenCalledWith('stage_rank', 'asc');
  });

  it('throws when startAfter cursor is missing', async () => {
    introductionsCollectionMock.doc.mockReturnValue({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });

    await expect(
      campaignService.getCampaignContacts('owner1', {
        limit: 5,
        startAfter: 'missing',
        orderBy: 'stage',
        orderDirection: 'asc',
      })
    ).rejects.toThrow('startAfter cursor missing not found for owner owner1');
  });
});
