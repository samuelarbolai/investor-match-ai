import { db } from './firebase';

/**
 * Firestore collection name constants
 * All collections use lowerCamelCase, pluralized naming convention
 */
export const COLLECTIONS = {
  /** Main contacts collection */
  CONTACTS: 'contacts',

  /** Introductions collection for tracking stages between contacts */
  INTRODUCTIONS: 'introductions',
  
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
  
  /** Raised capital range reverse index */
  RAISED_CAPITAL_RANGES: 'raisedCapitalRanges',
  
  /** Legacy funding stages reverse index (deprecated) */
  FUNDING_STAGES: 'fundingStages',
  
  /** Company headcount ranges reverse index */
  COMPANY_HEADCOUNT_RANGES: 'companyHeadcountRanges',
  
  /** Engineering headcount ranges reverse index */
  ENGINEERING_HEADCOUNT_RANGES: 'engineeringHeadcountRanges',
  
  /** Target domains reverse index */
  TARGET_DOMAINS: 'targetDomains',
  
  /** Roles reverse index */
  ROLES: 'roles',
  
  /** Distribution capability collection */
  DISTRIBUTION_CAPABILITIES: 'distributionCapabilities',
  
  /** Target criterion collection */
  TARGET_CRITERIA: 'targetCriteria',
  
  /** Companies collection */
  COMPANIES: 'companies',
  
  /** Experiences collection */
  EXPERIENCES: 'experiences'
} as const;

/**
 * Type for collection names
 */
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];

export const collections = {
  contacts: () => db.collection(COLLECTIONS.CONTACTS),
  introductions: () => db.collection(COLLECTIONS.INTRODUCTIONS),
  jobToBeDone: () => db.collection(COLLECTIONS.JOB_TO_BE_DONE),
  skills: () => db.collection(COLLECTIONS.SKILLS),
  industries: () => db.collection(COLLECTIONS.INDUSTRIES),
  verticals: () => db.collection(COLLECTIONS.VERTICALS),
  productTypes: () => db.collection(COLLECTIONS.PRODUCT_TYPES),
  raisedCapitalRanges: () => db.collection(COLLECTIONS.RAISED_CAPITAL_RANGES),
  fundingStages: () => db.collection(COLLECTIONS.FUNDING_STAGES),
  companyHeadcountRanges: () => db.collection(COLLECTIONS.COMPANY_HEADCOUNT_RANGES),
  engineeringHeadcountRanges: () => db.collection(COLLECTIONS.ENGINEERING_HEADCOUNT_RANGES),
  targetDomains: () => db.collection(COLLECTIONS.TARGET_DOMAINS),
  roles: () => db.collection(COLLECTIONS.ROLES),
  distributionCapabilities: () => db.collection(COLLECTIONS.DISTRIBUTION_CAPABILITIES),
  targetCriteria: () => db.collection(COLLECTIONS.TARGET_CRITERIA),
  companies: () => db.collection(COLLECTIONS.COMPANIES),
  experiences: () => db.collection(COLLECTIONS.EXPERIENCES),
};
