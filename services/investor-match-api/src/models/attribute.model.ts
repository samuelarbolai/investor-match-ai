import { Timestamp } from 'firebase-admin/firestore';

/**
 * AttributeDocument interface for reverse index collections
 * Used by: skills, industries, verticals, productTypes, fundingStages,
 * companyHeadcountRanges, engineeringHeadcountRanges, targetDomains, roles, jobToBeDone
 * 
 * Document path: /{collection}/{valueId}
 */
export interface AttributeDocument {
  /** Unique identifier (same as document ID) */
  id: string;
  
  /** Human-readable label for the attribute */
  label: string;
  
  /** Array of contact IDs that have this attribute - must always be array, never null */
  contact_ids: string[];
  
  /** Last update timestamp */
  updated_at: Timestamp;
}
