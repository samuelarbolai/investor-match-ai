import admin from 'firebase-admin';
import { COLLECTIONS } from './firestore-collections';

/**
 * Initialize Firebase Admin SDK
 * Uses environment variables for configuration
 */
const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'investor-match-ai',
    });
  }
  return admin.firestore();
};

// Initialize Firestore instance
export const db = initializeFirebase();

// Export admin for direct access
export { admin };

/**
 * Collection reference helpers
 * Provides typed access to all Firestore collections
 */
export const collections = {
  contacts: () => db.collection(COLLECTIONS.CONTACTS),
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
  experiences: () => db.collection(COLLECTIONS.EXPERIENCES)
};

/**
 * Get collection reference by name
 * @param collectionName - Name of the collection
 * @returns Firestore collection reference
 */
export function getCollection(collectionName: string) {
  return db.collection(collectionName);
}

/**
 * Firestore timestamp helper
 */
export const Timestamp = admin.firestore.Timestamp;
