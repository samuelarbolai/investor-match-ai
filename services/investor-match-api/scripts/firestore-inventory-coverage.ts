import { targetCollectionGetters, TARGET_COLLECTION_KEYS } from './firestore-targets';
import type FirebaseFirestore from 'firebase-admin/firestore';

type CoverageStats = {
  collection: string;
  total: number;
  coverage: number;
  test: number;
  missingCoverage: boolean;
};

const isCoverageDoc = (doc: FirebaseFirestore.QueryDocumentSnapshot) =>
  doc.id.includes('coverage') || doc.get('tag') === 'coverage';
const isTestDoc = (doc: FirebaseFirestore.QueryDocumentSnapshot) => doc.get('tag') === 'test';

async function runInventory() {
  const results: CoverageStats[] = [];

  for (const collectionKey of TARGET_COLLECTION_KEYS) {
    const getter = targetCollectionGetters[collectionKey];
    const snapshot = await getter().get();
    let coverageCount = 0;
    let testCount = 0;

    snapshot.forEach(doc => {
      if (isCoverageDoc(doc)) coverageCount += 1;
      if (isTestDoc(doc)) testCount += 1;
    });

    results.push({
      collection: collectionKey,
      total: snapshot.size,
      coverage: coverageCount,
      test: testCount,
      missingCoverage: coverageCount === 0
    });
  }

  console.table(results);
  const missing = results.filter(result => result.missingCoverage);
  if (missing.length) {
    console.warn('Collections missing coverage docs:', missing.map(r => r.collection).join(', '));
  } else {
    console.log('All collections contain at least one coverage doc.');
  }
}

runInventory().catch(error => {
  console.error('Inventory failed', error);
  process.exitCode = 1;
});
