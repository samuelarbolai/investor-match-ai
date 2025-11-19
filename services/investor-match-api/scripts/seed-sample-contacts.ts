import { collections } from '../src/config/firebase';
import { ContactInput, StageCounts } from '../src/models/contact.model';
import { ensureValidDocumentId } from '../src/utils/document-id';
import { DistributionCapabilityInput } from '../src/models/distribution-capability.model';
import { TargetCriterionInput } from '../src/models/target-criterion.model';
import { flatteningService } from '../src/services/flattening.service';
import { writeSyncService } from '../src/services/write-sync.service';
import { deriveActionStatus } from '../src/utils/action-status';

const industries = ['fintech', 'ai', 'healthcare', 'saas', 'climate'];
const verticals = ['payments', 'lending', 'biotech', 'devtools', 'energy'];
const roles = ['ceo', 'cto', 'investor', 'founder'];
const raisedCapital = [
  { id: 'less_than_500k_usd', label: '<500K USD' },
  { id: '500k_2m_usd', label: '500K–2M USD' },
  { id: '2_5m_usd', label: '2–5M USD' },
  { id: 'greater_than_5m_usd', label: '>5M USD' }
];

async function clearContacts() {
  const snapshot = await collections.contacts().get();
  const batch = collections.contacts().firestore.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  if (snapshot.size > 0) {
    await batch.commit();
  }
}

function pick<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function buildStageCounts(index: number): StageCounts {
  return {
    prospect: index % 3 === 0 ? 0 : 2,
    lead: index % 4 === 0 ? 1 : 0,
    'to-meet': 0,
    met: index % 5 === 0 ? 1 : 0,
    'not-in-campaign': 0,
    disqualified: 0
  } as StageCounts;
}

function buildDistributionCapabilities(index: number): DistributionCapabilityInput[] {
  const types = ['SocialMedia', 'Community', 'Partnerships'];
  return [{
    distribution_type: types[index % types.length],
    label: `${types[index % types.length]} Reach`,
    size_score: 0.4 + (index % 3) * 0.2,
    engagement_score: 0.3 + (index % 4) * 0.15,
    quality_score: 0.5,
    source_url: 'https://example.com/distribution'
  }];
}

function buildTargetCriteria(index: number): TargetCriterionInput[] {
  return [
    {
      dimension: 'Industry',
      operator: 'in',
      value: pick(industries, 2),
      label: `Industry in ${pick(industries, 2).join(', ')}`
    },
    {
      dimension: 'RaisedCapital',
      operator: '>=',
      value: index % 2 === 0 ? 500000 : 2000000,
      label: index % 2 === 0 ? 'Raised >= $500K' : 'Raised >= $2M'
    }
  ];
}

function buildExperiences(index: number) {
  const companyName = `Experience Company ${index}`;
  return [{
    company_name: companyName,
    company_id: ensureValidDocumentId(companyName),
    role: 'Engineer',
    seniority: 'senior',
    start_date: '2022-01',
    end_date: null,
    current: true,
    description: 'Leading product engineering',
    location_city: 'San Francisco',
    location_country: 'USA'
  }];
}

async function seedContacts() {
  for (let i = 0; i < 50; i++) {
    const contactType = i % 2 === 0 ? 'founder' : 'investor';
    const rc = raisedCapital[i % raisedCapital.length];
    const base: ContactInput = {
      full_name: `Sample Contact ${i + 1}`,
      headline: contactType === 'founder' ? 'Building future of SaaS' : 'Partner at VC Fund',
      contact_type: contactType,
      location_city: 'San Francisco',
      location_country: 'USA',
      job_to_be_done: contactType === 'founder' ? ['raise_capital'] : ['invest_capital'],
      current_company: `Sample Company ${i}`,
      current_company_id: ensureValidDocumentId(`Sample Company ${i}`),
      current_role: contactType === 'founder' ? 'CEO' : 'Partner',
      past_companies: [`Past Co ${i}`, `Past Co ${i + 1}`],
      roles: pick(roles, 2),
      skills: ['fundraising', 'product', 'growth'],
      seniority_levels: ['executive'],
      industries: pick(industries, 2),
      verticals: pick(verticals, 2),
      product_types: ['software'],
      raised_capital_range_ids: [rc.id],
      raised_capital_range_labels: [rc.label],
      company_headcount_ranges: ['10-50'],
      engineering_headcount_ranges: ['1-5'],
      founder_roles: contactType === 'founder' ? ['ceo'] : [],
      investor_roles: contactType === 'investor' ? ['lead_investor'] : [],
      target_domains: ['b2b'],
      stage_preferences: [],
      check_size_range: ['100k-500k'],
      team_size_preferences: [],
      founder_seniority_preferences: [],
      engineering_headcount_preferences: [],
      revenue_model_preferences: ['subscription'],
      risk_tolerance_preferences: ['moderate'],
      distribution_capability_ids: [],
      distribution_capability_labels: [],
      target_criterion_ids: [],
      target_criterion_summaries: [],
      experiences: buildExperiences(i),
      experience_company_ids: [],
      linkedin_url: 'https://linkedin.com/in/sample',
      email: `sample${i}@example.com`,
      stage_counts: buildStageCounts(i),
      action_status: 'action_required'
    };

    const distributionCapabilities = buildDistributionCapabilities(i);
    const targetCriteria = buildTargetCriteria(i);

    const flattened = flatteningService.flatten({
      contact: base,
      experiences: base.experiences,
      distributionCapabilities,
      targetCriteria,
      raisedCapitalRanges: base.raised_capital_range_ids,
      companies: [{ name: base.current_company!, domain: `${base.current_company!.toLowerCase()}.com` }]
    });

    const contactData: ContactInput = {
      ...base,
      ...flattened.contactUpdates,
      experiences: base.experiences,
      experience_company_ids: flattened.experienceCompanyIds,
      stage_counts: base.stage_counts,
      action_status: deriveActionStatus(base.stage_counts)
    };

    await writeSyncService.createOrUpdateContact(`sample_contact_${i}`, contactData, false);
  }
}

async function main() {
  await clearContacts();
  await seedContacts();
  console.log('Seeded 50 sample contacts via write-sync.');
}

main().catch(error => {
  console.error('Seeding contacts failed', error);
  process.exitCode = 1;
});
