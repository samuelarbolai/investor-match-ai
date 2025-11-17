import { collections } from '../src/config/firebase';
import { introductionService } from '../src/services/introduction.service';

async function main() {
  const snapshot = await collections.contacts().get();
  console.log(`[StageCounts] Found ${snapshot.size} contacts to recompute.`);
  let success = 0;
  let failed = 0;

  for (const doc of snapshot.docs) {
    const ownerId = doc.id;
    try {
      const counts = await introductionService.recalculateStageCounts(ownerId);
      success += 1;
      console.log(`[StageCounts] ✔ ${ownerId}`, counts);
    } catch (error) {
      failed += 1;
      console.error(`[StageCounts] ✖ ${ownerId}`, error);
    }
  }

  console.log(`[StageCounts] Completed. Success: ${success}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('[StageCounts] Fatal error', error);
  process.exit(1);
});
