import { admin, collections, Timestamp } from '../src/config/firebase';
import type FirebaseFirestore from 'firebase-admin/firestore';

type ParsedArgs = {
  collection: string | null;
  docIds: string[];
  tag: string;
  clear: boolean;
};

function parseArgs(): ParsedArgs {
  const rawArgs = process.argv.slice(2);
  const lookup = (flag: string) => {
    const index = rawArgs.indexOf(flag);
    if (index === -1 || index + 1 >= rawArgs.length) return null;
    return rawArgs[index + 1];
  };

  const collection = lookup('--collection');
  const docIdsFlag = lookup('--docIds');
  const docIds = docIdsFlag ? docIdsFlag.split(',').map(id => id.trim()).filter(Boolean) : [];
  const tag = lookup('--tag') || 'test';
  const clear = rawArgs.includes('--clear');

  return { collection, docIds, tag, clear };
}

function getCollectionRef(collectionName: string) {
  const getter = (collections as Record<string, () => FirebaseFirestore.CollectionReference>)[collectionName];
  if (!getter) throw new Error(`Unknown collection "${collectionName}".`);
  return getter();
}

async function tagDocuments() {
  const { collection, docIds, tag, clear } = parseArgs();
  if (!collection) throw new Error('Please specify --collection <name>');
  if (!docIds.length) throw new Error('Please specify --docIds <id1,id2,...>');

  const collectionRef = getCollectionRef(collection);
  const operations = docIds.map(id => {
    const docRef = collectionRef.doc(id);
    if (clear) {
      return docRef.set({ tag: admin.firestore.FieldValue.delete(), updated_at: Timestamp.now() }, { merge: true });
    }
    return docRef.set({ tag, updated_at: Timestamp.now() }, { merge: true });
  });

  await Promise.all(operations);
  console.log(
    `${clear ? 'Cleared' : 'Tagged'} ${docIds.length} doc(s) in ${collection} with "${clear ? 'removed' : tag}"`
  );
}

tagDocuments().catch(error => {
  console.error('Tag test docs failed', error);
  process.exitCode = 1;
});
