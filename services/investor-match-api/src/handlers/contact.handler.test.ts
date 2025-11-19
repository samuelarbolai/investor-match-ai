import { prepareContactPayload } from './contact.handler';
import { flatteningService } from '../services/flattening.service';
import { INTRO_STAGES } from '../models/introduction.model';
import { ContactInput, StageCounts } from '../models/contact.model';

jest.mock('../services/flattening.service', () => ({
  flatteningService: {
    flatten: jest.fn()
  }
}));

const mockedFlatten = flatteningService.flatten as jest.Mock;

function buildStageCounts(overrides: Partial<StageCounts> = {}): StageCounts {
  return INTRO_STAGES.reduce((acc, stage) => {
    acc[stage] = overrides[stage] ?? 0;
    return acc;
  }, {} as StageCounts);
}

describe('prepareContactPayload', () => {
  beforeEach(() => {
    mockedFlatten.mockReset();
  });

  it('derives action_status from stage counts and preserves normalized companies', () => {
    const stageCounts = buildStageCounts({ prospect: 2 });
    const normalizedCompanies = [{
      id: 'acme-inc',
      name: 'Acme Inc',
      domain: null,
      description: null,
      linkedin_url: null,
      crunchbase_url: null,
      industries: [],
      verticals: []
    }];

    mockedFlatten.mockReturnValue({
      contactUpdates: {
        current_company_id: 'acme-inc',
        distribution_capability_ids: ['dist-1'],
        distribution_capability_labels: ['Dist 1'],
        target_criterion_ids: ['crit-1'],
        target_criterion_summaries: ['Industry = Fintech'],
        experience_company_ids: ['acme-inc'],
        target_industries: ['fintech']
      },
      companies: normalizedCompanies,
      distributionCapabilities: [],
      targetCriteria: [],
      experienceCompanyIds: ['acme-inc']
    });

    const payload: Partial<ContactInput> = {
      full_name: 'Test Contact',
      headline: 'Founder',
      contact_type: 'founder',
      stage_counts: stageCounts
    };

    const result = prepareContactPayload({
      contact: payload
    });

    expect(result.contact.action_status).toBe('waiting');
    expect(result.contact.experience_company_ids).toEqual(['acme-inc']);
    expect(result.contact.distribution_capability_ids).toEqual(['dist-1']);
    expect(result.contact.target_industries).toEqual(['fintech']);
    expect(result.normalizedCompanies).toEqual(normalizedCompanies);
  });

  it('defaults optional arrays and falls back to action_required when no stage counts provided', () => {
    mockedFlatten.mockReturnValue({
      contactUpdates: {
        target_roles: []
      },
      companies: [],
      distributionCapabilities: [],
      targetCriteria: [],
      experienceCompanyIds: []
    });

    const payload: Partial<ContactInput> = {
      full_name: 'Array Defaults',
      headline: 'CTO',
      contact_type: 'investor'
    };

    const result = prepareContactPayload({
      contact: payload
    });

    expect(result.contact.action_status).toBe('action_required');
    expect(result.contact.target_roles).toEqual([]);
    expect(result.contact.target_company_ids).toEqual([]);
    expect(result.contact.distribution_capability_ids).toEqual([]);
  });
});
