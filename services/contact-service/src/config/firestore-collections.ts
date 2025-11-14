/**
 * Firestore collection name constants
 * All collections use lowerCamelCase, pluralized naming convention
 */
export const COLLECTIONS = {
  /** Main contacts collection */
  CONTACTS: 'contacts',
  
  /** Job to be done reverse index */
  JOB_TO_BE_DONE: 'jobToBeDone',
  
  /** Skills reverse index */
  SKILLS: 'skills',
  
  /** Industries reverse index */
  INDUSTRIES: 'industries',
  
  /** Verticals reverse index */
  VERTICALS: 'verticals',
  
  /** Product types reverse index */
  PRODUCT_TYPES: 'productTypes',
  
  /** Funding stages reverse index */
  FUNDING_STAGES: 'fundingStages',
  
  /** Company headcount ranges reverse index */
  COMPANY_HEADCOUNT_RANGES: 'companyHeadcountRanges',
  
  /** Engineering headcount ranges reverse index */
  ENGINEERING_HEADCOUNT_RANGES: 'engineeringHeadcountRanges',
  
  /** Target domains reverse index */
  TARGET_DOMAINS: 'targetDomains',
  
  /** Roles reverse index */
  ROLES: 'roles',
  
  /** Optional companies collection */
  COMPANIES: 'companies'
} as const;

/**
 * Type for collection names
 */
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
