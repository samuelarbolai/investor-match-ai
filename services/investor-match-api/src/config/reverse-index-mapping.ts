import { COLLECTIONS } from './firestore-collections';

/**
 * Reverse Index Mapping Table
 * Maps Contact document fields to their corresponding Firestore collections
 * Based on schema table from current-plan.md
 */
export const REVERSE_INDEX_MAPPING = {
  /** Job to be done field maps to jobToBeDone collection */
  job_to_be_done: {
    collection: COLLECTIONS.JOB_TO_BE_DONE,
    edgeName: '_FOCUSED_ON'
  },
  
  /** Skills field maps to skills collection */
  skills: {
    collection: COLLECTIONS.SKILLS,
    edgeName: '_HAS_SKILL'
  },
  
  /** Industries field maps to industries collection */
  industries: {
    collection: COLLECTIONS.INDUSTRIES,
    edgeName: '_IN_INDUSTRY'
  },
  
  /** Verticals field maps to verticals collection */
  verticals: {
    collection: COLLECTIONS.VERTICALS,
    edgeName: '_IN_VERTICAL'
  },
  
  /** Product types field maps to productTypes collection */
  product_types: {
    collection: COLLECTIONS.PRODUCT_TYPES,
    edgeName: '_PRODUCES'
  },
  
  /** Raised capital ranges field maps to raisedCapitalRanges collection */
  raised_capital_range_ids: {
    collection: COLLECTIONS.RAISED_CAPITAL_RANGES,
    edgeName: '_HAS_RAISED_RANGE'
  },
  
  /** Legacy funding stages field maps to fundingStages collection */
  funding_stages: {
    collection: COLLECTIONS.FUNDING_STAGES,
    edgeName: '_HAS_RAISED'
  },
  
  /** Company headcount ranges field maps to companyHeadcountRanges collection */
  company_headcount_ranges: {
    collection: COLLECTIONS.COMPANY_HEADCOUNT_RANGES,
    edgeName: '_HAS_HEADCOUNT'
  },
  
  /** Engineering headcount ranges field maps to engineeringHeadcountRanges collection */
  engineering_headcount_ranges: {
    collection: COLLECTIONS.ENGINEERING_HEADCOUNT_RANGES,
    edgeName: '_HAS_ENGINEERING_HEADCOUNT'
  },
  
  /** Target domains field maps to targetDomains collection */
  target_domains: {
    collection: COLLECTIONS.TARGET_DOMAINS,
    edgeName: '_TARGETS_DOMAIN'
  },
  
  /** Roles field maps to roles collection */
  roles: {
    collection: COLLECTIONS.ROLES,
    edgeName: '_HAS_ROLE'
  },
  
  /** Distribution capability IDs map to distributionCapabilities collection */
  distribution_capability_ids: {
    collection: COLLECTIONS.DISTRIBUTION_CAPABILITIES,
    edgeName: '_HAS_DISTRIBUTION'
  },
  
  /** Target criterion IDs map to targetCriteria collection */
  target_criterion_ids: {
    collection: COLLECTIONS.TARGET_CRITERIA,
    edgeName: '_TARGETS_CRITERION'
  },
  
  /** Experience company IDs map to companies collection */
  experience_company_ids: {
    collection: COLLECTIONS.COMPANIES,
    edgeName: '_AT_COMPANY'
  },
  
  /** Target industries map to industries collection */
  target_industries: {
    collection: COLLECTIONS.INDUSTRIES,
    edgeName: '_TARGETS_INDUSTRY'
  },
  
  /** Target verticals map to verticals collection */
  target_verticals: {
    collection: COLLECTIONS.VERTICALS,
    edgeName: '_TARGETS_VERTICAL'
  },
  
  /** Target skills map to skills collection */
  target_skills: {
    collection: COLLECTIONS.SKILLS,
    edgeName: '_TARGETS_SKILL'
  },
  
  /** Target roles map to roles collection */
  target_roles: {
    collection: COLLECTIONS.ROLES,
    edgeName: '_TARGETS_ROLE'
  },
  
  /** Target product types map to productTypes collection */
  target_product_types: {
    collection: COLLECTIONS.PRODUCT_TYPES,
    edgeName: '_TARGETS_PRODUCT'
  },
  
  /** Target raised capital ranges */
  target_raised_capital_range_ids: {
    collection: COLLECTIONS.RAISED_CAPITAL_RANGES,
    edgeName: '_TARGETS_RAISED_RANGE'
  },
  
  /** Target company headcount ranges */
  target_company_headcount_ranges: {
    collection: COLLECTIONS.COMPANY_HEADCOUNT_RANGES,
    edgeName: '_TARGETS_HEADCOUNT'
  },
  
  /** Target engineering headcount ranges */
  target_engineering_headcount_ranges: {
    collection: COLLECTIONS.ENGINEERING_HEADCOUNT_RANGES,
    edgeName: '_TARGETS_ENGINEERING_HEADCOUNT'
  },
  
  /** Target distribution capabilities */
  target_distribution_capability_ids: {
    collection: COLLECTIONS.DISTRIBUTION_CAPABILITIES,
    edgeName: '_TARGETS_DISTRIBUTION'
  },
  
  /** Target company IDs */
  target_company_ids: {
    collection: COLLECTIONS.COMPANIES,
    edgeName: '_TARGETS_COMPANY'
  }
} as const;

/**
 * Type for reverse index field names
 */
export type ReverseIndexField = keyof typeof REVERSE_INDEX_MAPPING;

/**
 * Get all reverse index field names as array
 */
export const REVERSE_INDEX_FIELDS = Object.keys(REVERSE_INDEX_MAPPING) as ReverseIndexField[];
