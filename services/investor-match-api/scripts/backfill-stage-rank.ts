import { collections, db } from '../src/config/firebase';
import { STAGE_RANK, IntroStage, Introduction } from '../src/models/introduction.model';

async function backfillStageRank() {
  console.log('Starting backfill of stage_rank on introductions...');
  const snapshot = await collections.introductions().get();
  console.log(`Found ${snapshot.size} introduction documents.`);
  const batchSize = 400;
  let processed = 0;
  let writeBatch = db.batch();
  let ops = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data() as Introduction;
    const rank = STAGE_RANK[data.stage as IntroStage];
    if (data.stage_rank === rank) {
      continue;
    }
    writeBatch.update(doc.ref, { stage_rank: rank });
    ops += 1;
    if (ops === batchSize) {
      await writeBatch.commit();
      processed += ops;
      console.log(`Updated ${processed} docs so far...`);
      writeBatch = db.batch();
      ops = 0;
    }
  }

  if (ops > 0) {
    await writeBatch.commit();
    processed += ops;
  }

  console.log(`Backfill complete. Updated ${processed} documents.`);
  process.exit(0);
}

backfillStageRank().catch((error) => {
  console.error('Failed to backfill stage_rank', error);
  process.exit(1);
});
