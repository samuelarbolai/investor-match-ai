import { execSync } from 'child_process';
import { db, Timestamp } from '../src/config/firebase';
import type FirebaseFirestore from 'firebase-admin/firestore';
import {
  placeholderBuilders,
  targetCollectionGetters,
  TARGET_COLLECTION_KEYS,
  type TargetCollectionKey
} from './firestore-targets';
import type FirebaseFirestore from 'firebase-admin/firestore';

async function tagCoverageDocs(snapshot: FirebaseFirestore.QuerySnapshot) {
  const updates: Promise<void>[] = [];

  snapshot.forEach(doc => {
    const tag = doc.get('tag');
    if (tag === 'coverage') return;
    if (!doc.id.includes('coverage')) return;
    updates.push(doc.ref.set({ tag: 'coverage', updated_at: Timestamp.now() }, { merge: true }));
  });

  await Promise.all(updates);
}

async function ensureCollectionCoverage(collectionKey: TargetCollectionKey) {
  const getter = targetCollectionGetters[collectionKey];
  const snapshot = await getter().get();
  const coverageDocs = snapshot.docs.filter(
    doc => doc.id.includes('coverage') || doc.get('tag') === 'coverage'
  );

  if (coverageDocs.length) {
    await tagCoverageDocs(snapshot);
    return;
  }

  const placeholderBuilder = placeholderBuilders[collectionKey];
  if (!placeholderBuilder) {
    console.warn(`No placeholder configured for ${collectionKey}, skipping creation.`);
    return;
  }

  const ref = getter().doc('coverage-placeholder');
  await ref.set(placeholderBuilder(), { merge: true });
  console.log(`Created coverage placeholder for ${collectionKey}`);
}

async function seedCoverageContacts() {
  try {
    console.log('Seeding coverage contacts (npm run seed:coverage-contacts)');
    execSync('npm run seed:coverage-contacts', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to seed coverage contacts', error);
    throw error;
  }
}

async function ensureCoverage() {
  await seedCoverageContacts();

  for (const collectionKey of TARGET_COLLECTION_KEYS) {
    await ensureCollectionCoverage(collectionKey);
  }
}

ensureCoverage().catch(error => {
  console.error('Ensure coverage failed', error);
  process.exitCode = 1;
});
