import { collections, db } from '../src/config/firebase';
import { deriveActionStatus } from '../src/utils/action-status';
import { Contact, StageCounts } from '../src/models/contact.model';

async function run() {
  console.log('Backfilling action_status for all contacts...');
  const snapshot = await collections.contacts().get();
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data() as Contact;
    const nextStatus = deriveActionStatus(data.stage_counts as StageCounts | undefined);
    await doc.ref.set({ action_status: nextStatus }, { merge: true });
    updated += 1;
    if (updated % 50 === 0) {
      console.log(`Processed ${updated} contacts`);
    }
  }

  console.log(`Done! Updated ${updated} contacts.`);
  process.exit(0);
}

run().catch((error) => {
  console.error('Failed to backfill action_status', error);
  process.exit(1);
});