import { db, collections } from '../src/config/firebase';

const collectionGetters = [
  collections.contacts,
  collections.jobToBeDone,
  collections.skills,
  collections.industries,
  collections.verticals,
  collections.productTypes,
  collections.raisedCapitalRanges,
  collections.companyHeadcountRanges,
  collections.engineeringHeadcountRanges,
  collections.targetDomains,
  collections.roles,
  collections.distributionCapabilities,
  collections.targetCriteria,
  collections.companies,
  collections.experiences
];

async function clearCollection(getter: () => FirebaseFirestore.CollectionReference) {
  const snapshot = await getter().get();
  let batch = db.batch();
  let count = 0;
  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
    count++;
    if (count % 400 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  if (count % 400 !== 0) {
    await batch.commit();
  }
  console.log(`Cleared ${count} docs from ${getter().id}`);
}

(async () => {
  for (const getter of collectionGetters) {
    await clearCollection(getter);
  }
  console.log('Firestore cleared.');
})().catch(error => {
  console.error('Failed to clear Firestore', error);
  process.exitCode = 1;
});
