import fs from 'fs';
import { db, collections, Timestamp } from './firebase';

describe('Firebase Integration', () => {
  // Skip if no Firebase credentials
  const hasCredentials = () => {
    if (!process.env.FIREBASE_PROJECT_ID) {
      return false;
    }
    const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    return Boolean(credsPath && fs.existsSync(credsPath));
  };

  const skipIfNoCredentials = hasCredentials() ? test : test.skip;

  skipIfNoCredentials('connects to Firestore', async () => {
    try {
      // Test basic connection
      const testDoc = collections.contacts().doc('test-connection');
      await testDoc.set({
        test: true,
        timestamp: Timestamp.now()
      });
      
      const doc = await testDoc.get();
      expect(doc.exists).toBe(true);
      expect(doc.data()?.test).toBe(true);
      
      // Clean up
      await testDoc.delete();
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      throw error;
    }
  });

  skipIfNoCredentials('can access all collections', async () => {
    const collectionNames = [
      'contacts', 'jobToBeDone', 'skills', 'industries', 
      'verticals', 'productTypes', 'fundingStages',
      'companyHeadcountRanges', 'engineeringHeadcountRanges',
      'targetDomains', 'roles'
    ];

    for (const collectionName of collectionNames) {
      const collection = db.collection(collectionName);
      expect(collection).toBeDefined();
      
      // Test we can query (should not throw)
      const query = await collection.limit(1).get();
      expect(query).toBeDefined();
    }
  });

  test('collection helpers work without Firebase', () => {
    // These should work even without Firebase connection
    expect(collections.contacts).toBeDefined();
    expect(collections.skills).toBeDefined();
    expect(collections.industries).toBeDefined();
    expect(typeof collections.contacts).toBe('function');
  });

  test('Timestamp helper works', () => {
    const timestamp = Timestamp.now();
    expect(timestamp).toBeDefined();
    expect(typeof timestamp.seconds).toBe('number');
  });
});
