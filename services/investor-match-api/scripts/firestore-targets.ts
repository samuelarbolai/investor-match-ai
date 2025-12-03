import { collections, Timestamp } from '../src/config/firebase';
import type FirebaseFirestore from 'firebase-admin/firestore';

export const TARGET_COLLECTION_KEYS = [
  'contacts',
  'introductions',
  'jobToBeDone',
  'skills',
  'industries',
  'verticals',
  'productTypes',
  'raisedCapitalRanges',
  'fundingStages',
  'companyHeadcountRanges',
  'engineeringHeadcountRanges',
  'targetDomains',
  'roles',
  'distributionCapabilities',
  'distributionQualityBuckets',
  'targetCriteria',
  'companies',
  'experiences'
] as const;

export type TargetCollectionKey = typeof TARGET_COLLECTION_KEYS[number];

export const targetCollectionGetters: Record<TargetCollectionKey, () => FirebaseFirestore.CollectionReference> = {
  contacts: collections.contacts,
  introductions: collections.introductions,
  jobToBeDone: collections.jobToBeDone,
  skills: collections.skills,
  industries: collections.industries,
  verticals: collections.verticals,
  productTypes: collections.productTypes,
  raisedCapitalRanges: collections.raisedCapitalRanges,
  fundingStages: collections.fundingStages,
  companyHeadcountRanges: collections.companyHeadcountRanges,
  engineeringHeadcountRanges: collections.engineeringHeadcountRanges,
  targetDomains: collections.targetDomains,
  roles: collections.roles,
  distributionCapabilities: collections.distributionCapabilities,
  distributionQualityBuckets: collections.distributionQualityBuckets,
  targetCriteria: collections.targetCriteria,
  companies: collections.companies,
  experiences: collections.experiences
};

type PlaceholderFactory = () => FirebaseFirestore.DocumentData;

const basePlaceholder = (): FirebaseFirestore.DocumentData => ({
  id: 'coverage-placeholder',
  tag: 'coverage',
  updated_at: Timestamp.now()
});

export const placeholderBuilders: Partial<Record<TargetCollectionKey, PlaceholderFactory>> = {
  introductions: () => ({
    ...basePlaceholder(),
    contact_id: 'coverage_contact',
    introduction_type: 'coverage',
    status: 'coverage-ready',
    description: 'Placeholder introduction for schema visibility.'
  }),
  jobToBeDone: () => ({
    ...basePlaceholder(),
    label: 'Coverage JobToBeDone'
  }),
  skills: () => ({
    ...basePlaceholder(),
    label: 'Coverage Skill'
  }),
  industries: () => ({
    ...basePlaceholder(),
    label: 'Coverage Industry'
  }),
  verticals: () => ({
    ...basePlaceholder(),
    label: 'Coverage Vertical'
  }),
  productTypes: () => ({
    ...basePlaceholder(),
    label: 'Coverage ProductType'
  }),
  raisedCapitalRanges: () => ({
    ...basePlaceholder(),
    label: '<coverage>',
    min_amount: 0,
    max_amount: 1
  }),
  fundingStages: () => ({
    ...basePlaceholder(),
    label: 'Coverage Funding Stage',
    stage: 'coverage'
  }),
  companyHeadcountRanges: () => ({
    ...basePlaceholder(),
    label: 'Coverage Headcount'
  }),
  engineeringHeadcountRanges: () => ({
    ...basePlaceholder(),
    label: 'Coverage Engineering Headcount'
  }),
  targetDomains: () => ({
    ...basePlaceholder(),
    label: 'Coverage Target Domain'
  }),
  roles: () => ({
    ...basePlaceholder(),
    label: 'Coverage Role'
  }),
  distributionCapabilities: () => ({
    ...basePlaceholder(),
    distribution_type: 'Coverage',
    label: 'Coverage Distribution Capability'
  }),
  distributionQualityBuckets: () => ({
    ...basePlaceholder(),
    label: 'Coverage Quality Bucket'
  }),
  targetCriteria: () => ({
    ...basePlaceholder(),
    label: 'Coverage Target Criterion',
    dimension: 'coverage',
    operator: 'in',
    value: ['coverage']
  }),
  companies: () => ({
    ...basePlaceholder(),
    name: 'Coverage Company',
    domain: 'coverage.example.com'
  }),
  experiences: () => ({
    ...basePlaceholder(),
    contact_id: 'coverage_contact',
    company_name: 'Coverage Company',
    role: 'Coverage Role',
    start_date: '2023-01',
    current: true,
    description: 'Coverage experience placeholder',
    location_city: 'Coverage City',
    location_country: 'Coverage Country'
  })
};
