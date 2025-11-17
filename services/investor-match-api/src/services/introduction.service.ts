import { collections, db } from '../config/firebase';
import { Introduction, IntroStage, INTRO_STAGES } from '../models/introduction.model';
import { Timestamp } from 'firebase-admin/firestore';

interface StageUpdate {
  targetId: string;
  stage: IntroStage;
}

export interface StageSummary {
  stage: IntroStage;
  count: number;
}

export class IntroductionService {
  private buildDocId(ownerId: string, targetId: string): string {
    return `${ownerId}__${targetId}`;
  }

  // Creates or updates the stage for a target contact
  async setStage(ownerId: string, targetId: string, stage: IntroStage): Promise<Introduction> {
    const docId = this.buildDocId(ownerId, targetId);
    const docRef = collections.introductions().doc(docId);
    const snapshot = await docRef.get();
    const now = Timestamp.now();

    if (!snapshot.exists) {
      const newIntro: Omit<Introduction, 'id'> = { ownerId, targetId, stage, createdAt: now, updatedAt: now };
      await docRef.set(newIntro);
      console.info('[Introductions] created stage', { ownerId, targetId, stage });
      return { id: docId, ...newIntro };
    }

    await docRef.update({ stage, updatedAt: now });
    console.info('[Introductions] updated stage', { ownerId, targetId, stage });
    return {
      id: docId,
      ...(snapshot.data() as Introduction),
      stage,
      updatedAt: now,
    };
  }

  // Gets all contacts in a specific stage for an owner
  async getContactsInStage(ownerId: string, stage: IntroStage): Promise<Introduction[]> {
    // Requires Firestore composite index on (ownerId, stage) for efficient filtering.
    const snapshot = await collections.introductions()
      .where('ownerId', '==', ownerId)
      .where('stage', '==', stage)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Introduction) }));
  }

  // Gets all introductions for an owner
  async getIntroductions(ownerId: string): Promise<Introduction[]> {
    const snapshot = await collections.introductions()
      .where('ownerId', '==', ownerId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Introduction) }));
  }

  async getStageSummary(ownerId: string): Promise<StageSummary[]> {
    const snapshot = await collections.introductions()
      .where('ownerId', '==', ownerId)
      .get();

    const counts: Record<IntroStage, number> = INTRO_STAGES.reduce((acc, stage) => {
      acc[stage] = 0;
      return acc;
    }, {} as Record<IntroStage, number>);

    snapshot.docs.forEach(doc => {
      const data = doc.data() as Introduction;
      counts[data.stage] += 1;
    });

    return INTRO_STAGES.map(stage => ({
      stage,
      count: counts[stage],
    }));
  }

  // Bulk updates the stage for multiple contacts
  async bulkSetStage(ownerId: string, updates: StageUpdate[]): Promise<void> {
    const batch = db.batch();
    const now = Timestamp.now();
    const docRefs = updates.map(update => collections.introductions().doc(this.buildDocId(ownerId, update.targetId)));
    const existingDocs = await db.getAll(...docRefs);
    const existingMap = new Map(existingDocs.map(doc => [doc.id, doc]));
    let updatedCount = 0;
    let createdCount = 0;

    updates.forEach((update, index) => {
      const docRef = docRefs[index];
      const existingDoc = existingMap.get(docRef.id);

      if (existingDoc?.exists) {
        batch.update(docRef, { stage: update.stage, updatedAt: now });
        updatedCount += 1;
        return;
      }

      const newIntro: Omit<Introduction, 'id'> = {
        ownerId,
        targetId: update.targetId,
        stage: update.stage,
        createdAt: now,
        updatedAt: now,
      };
      batch.set(docRef, newIntro);
      createdCount += 1;
    });
    await batch.commit();
    console.info('[Introductions] bulk stage update', {
      ownerId,
      totalUpdates: updates.length,
      createdCount,
      updatedCount,
    });
  }
}

export const introductionService = new IntroductionService();
