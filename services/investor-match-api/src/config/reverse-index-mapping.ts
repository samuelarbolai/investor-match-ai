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
  
  /** Funding stages field maps to fundingStages collection */
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
