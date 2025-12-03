import { db } from '../src/config/firebase';
import { targetCollectionGetters, TARGET_COLLECTION_KEYS } from './firestore-targets';
import type FirebaseFirestore from 'firebase-admin/firestore';

const isReservedDoc = (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
  const tag = doc.get('tag');
  return doc.id.includes('coverage') || tag === 'coverage' || tag === 'test';
};

const deleteInBatches = async (refs: FirebaseFirestore.DocumentReference[]) => {
  const chunkSize = 400;
  for (let i = 0; i < refs.length; i += chunkSize) {
    const batch = db.batch();
    refs.slice(i, i + chunkSize).forEach(ref => batch.delete(ref));
    await batch.commit();
  }
};

async function cleanCollections() {
  for (const collectionKey of TARGET_COLLECTION_KEYS) {
    const getter = targetCollectionGetters[collectionKey];
    const snapshot = await getter().get();
    const deletions = snapshot.docs.filter(doc => !isReservedDoc(doc)).map(doc => doc.ref);

    if (!deletions.length) {
      console.log(`${collectionKey}: no non-coverage docs to remove`);
      continue;
    }

    console.log(`${collectionKey}: deleting ${deletions.length} non-coverage docs`);
    await deleteInBatches(deletions);
  }
}

cleanCollections().catch(error => {
  console.error('Cleanup failed', error);
  process.exitCode = 1;
});
