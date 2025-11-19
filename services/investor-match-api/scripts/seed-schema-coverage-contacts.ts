import { ContactInput, StageCounts } from '../src/models/contact.model';
import { flatteningService } from '../src/services/flattening.service';
import { writeSyncService } from '../src/services/write-sync.service';
import { DistributionCapabilityInput } from '../src/models/distribution-capability.model';
import { TargetCriterionInput } from '../src/models/target-criterion.model';
import { ensureValidDocumentId } from '../src/utils/document-id';
import { deriveActionStatus } from '../src/utils/action-status';
import { companySyncService } from '../src/services/company-sync.service';
import { distributionCapabilitySyncService } from '../src/services/distribution-capability-sync.service';
import {
  jobToBeDoneSeeds,
  skillSeeds,
  industrySeeds,
  verticalSeeds,
  jobRoleSeeds,
  productTypeSeeds,
  companyHeadcountRangeSeeds,
  engineeringHeadcountRangeSeeds,
  targetDomainSeeds,
  distributionCapabilitySeeds,
  raisedCapitalRangeSeeds,
  targetCriterionSeeds
} from './schema-vocab-data';

const baseStageCounts: StageCounts = {
  prospect: 1,
  lead: 0,
  'to-meet': 0,
  met: 0,
  'not-in-campaign': 0,
  disqualified: 0
};

let counter = 0;

async function createCoverageContact(
  idSuffix: string,
  overrides: Partial<ContactInput>,
  extras?: {
    distributionCapabilities?: DistributionCapabilityInput[];
    targetCriteria?: TargetCriterionInput[];
    companies?: { name: string; domain?: string | null }[];
  }
) {
  const base: ContactInput = {
    full_name: `Coverage Contact ${counter}`,
    headline: 'Schema Coverage Contact',
    contact_type: 'founder',
    location_city: 'New York',
    location_country: 'USA',
    job_to_be_done: [],
    current_company: `Coverage Company ${counter}`,
    current_company_id: ensureValidDocumentId(`Coverage Company ${counter}`),
    current_role: 'Founder',
    past_companies: [],
    roles: [],
    skills: [],
    seniority_levels: ['executive'],
    industries: [],
    verticals: [],
    product_types: [],
    raised_capital_range_ids: [raisedCapitalRangeSeeds[0].label.toLowerCase().replace(/[^a-z0-9]+/g, '_')],
    raised_capital_range_labels: [raisedCapitalRangeSeeds[0].label],
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
    distribution_quality_bucket_ids: [],
    target_criterion_ids: [],
    target_criterion_summaries: [],
    experiences: [
      {
        company_name: `Experience Company ${counter}`,
        company_id: ensureValidDocumentId(`Experience Company ${counter}`),
        role: 'Engineer',
        seniority: 'senior',
        start_date: '2022-01',
        end_date: null,
        current: true,
        description: 'Working on coverage data',
        location_city: 'New York',
        location_country: 'USA'
      }
    ],
    experience_company_ids: [],
    linkedin_url: 'https://linkedin.com',
    email: `coverage-${counter}@example.com`,
    stage_counts: { ...baseStageCounts },
    action_status: 'waiting'
  };

  const merged: ContactInput = {
    ...base,
    ...overrides,
    stage_counts: overrides.stage_counts || base.stage_counts
  };

  merged.experiences = merged.experiences || [];
  merged.raised_capital_range_ids = merged.raised_capital_range_ids || [];
  merged.raised_capital_range_labels = merged.raised_capital_range_labels || [];
  merged.distribution_capability_ids = merged.distribution_capability_ids || [];
  merged.distribution_capability_labels = merged.distribution_capability_labels || [];
  merged.distribution_quality_bucket_ids = merged.distribution_quality_bucket_ids || [];
  merged.target_criterion_ids = merged.target_criterion_ids || [];
  merged.target_criterion_summaries = merged.target_criterion_summaries || [];
  merged.experience_company_ids = merged.experience_company_ids || [];

  const flattenResult = flatteningService.flatten({
    contact: merged,
    experiences: merged.experiences,
    distributionCapabilities: extras?.distributionCapabilities,
    targetCriteria: extras?.targetCriteria,
    raisedCapitalRanges: merged.raised_capital_range_ids,
    companies: extras?.companies || [{ name: merged.current_company || 'Coverage Co', domain: `${merged.current_company || 'coverage'}.com` }]
  });

  const stageCounts = merged.stage_counts || baseStageCounts;
  const contactData: ContactInput = {
    ...merged,
    ...flattenResult.contactUpdates,
    experiences: merged.experiences,
    experience_company_ids: flattenResult.experienceCompanyIds,
    action_status: deriveActionStatus(stageCounts)
  };

  const contactId = `coverage_${idSuffix}_${counter}`;
  await writeSyncService.createOrUpdateContact(contactId, contactData, false);
  await companySyncService.syncCompanies(contactId, flattenResult.companies, contactData.experiences || []);
  await distributionCapabilitySyncService.syncCapabilities(
    contactId,
    flattenResult.distributionCapabilities,
    flattenResult.distributionQualityBuckets
  );
  counter++;
}

async function seedCoverage() {
  for (const value of jobToBeDoneSeeds) {
    await createCoverageContact(`jobtodo_${ensureValidDocumentId(value)}`, {
      job_to_be_done: [value]
    });
  }

  for (const value of skillSeeds) {
    await createCoverageContact(`skill_${ensureValidDocumentId(value)}`, {
      skills: [value]
    });
  }

  for (const value of industrySeeds) {
    await createCoverageContact(`industry_${ensureValidDocumentId(value)}`, {
      industries: [value]
    });
  }

  for (const value of verticalSeeds) {
    await createCoverageContact(`vertical_${ensureValidDocumentId(value)}`, {
      verticals: [value]
    });
  }

  for (const value of jobRoleSeeds) {
    await createCoverageContact(`role_${ensureValidDocumentId(value)}`, {
      roles: [value]
    });
  }

  for (const value of productTypeSeeds) {
    await createCoverageContact(`product_${ensureValidDocumentId(value)}`, {
      product_types: [value]
    });
  }

  for (const value of companyHeadcountRangeSeeds) {
    await createCoverageContact(`company_headcount_${ensureValidDocumentId(value)}`, {
      company_headcount_ranges: [value]
    });
  }

  for (const value of engineeringHeadcountRangeSeeds) {
    await createCoverageContact(`engineering_headcount_${ensureValidDocumentId(value)}`, {
      engineering_headcount_ranges: [value]
    });
  }

  for (const value of targetDomainSeeds) {
    await createCoverageContact(`target_domain_${ensureValidDocumentId(value)}`, {
      target_domains: [value]
    });
  }

  for (const range of raisedCapitalRangeSeeds) {
    const id = ensureValidDocumentId(range.label);
    await createCoverageContact(`raised_capital_${id}`, {
      raised_capital_range_ids: [id],
      raised_capital_range_labels: [range.label]
    });
  }

  for (const capability of distributionCapabilitySeeds) {
    const id = ensureValidDocumentId(capability.label);
    const distributionInput: DistributionCapabilityInput = {
      distribution_type: capability.distribution_type,
      label: capability.label,
      size_score: 0.6,
      engagement_score: 0.5,
      quality_score: 0.5,
      source_url: 'https://example.com'
    };
    await createCoverageContact(`distribution_${id}`, {
      distribution_capability_ids: [id],
      distribution_capability_labels: [capability.label]
    }, { distributionCapabilities: [distributionInput] });
  }

  for (const criterion of targetCriterionSeeds) {
    const label = criterion.label || `${criterion.dimension} Criterion`;
    await createCoverageContact(`target_criterion_${ensureValidDocumentId(label)}`, {}, {
      targetCriteria: [criterion]
    });
  }
}

seedCoverage()
  .then(() => console.log('Seeded schema coverage contacts.'))
  .catch(error => {
    console.error('Failed to seed schema coverage contacts', error);
    process.exitCode = 1;
  });
