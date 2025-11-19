import { collections, db, Timestamp } from '../src/config/firebase';
import { flatteningService } from '../src/services/flattening.service';
import { Contact } from '../src/models/contact.model';

/**
 * Backfill script to materialize normalized nodes (companies, distribution capabilities,
 * target criteria) while preserving flattened fields on contacts.
 */
async function backfill() {
  const snapshot = await collections.contacts().get();
  console.log(`Backfilling ${snapshot.size} contacts…`);

  for (const doc of snapshot.docs) {
    const contact = doc.data() as Contact;
    const result = flatteningService.flatten({
      contact,
      experiences: contact.experiences,
      raisedCapitalRanges: contact.raised_capital_range_ids,
      distributionCapabilities: [],
      targetCriteria: []
    });

    await doc.ref.update({
      ...result.contactUpdates,
      updated_at: Timestamp.now()
    });

    console.log(`Updated contact ${doc.id}`, {
      raisedCapitalRanges: result.contactUpdates.raised_capital_range_ids,
      distributionCapabilities: result.contactUpdates.distribution_capability_ids?.length || 0,
      targetCriteria: result.contactUpdates.target_criterion_ids?.length || 0
    });
  }

  console.log('Backfill completed');
  await db.terminate();
}

backfill().catch(error => {
  console.error('Failed to backfill normalized nodes', error);
  process.exitCode = 1;
});
