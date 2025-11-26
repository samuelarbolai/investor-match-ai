import { collections, db } from '../config/firebase';
import { Introduction, IntroStage, INTRO_STAGES } from '../models/introduction.model';
import { Timestamp } from 'firebase-admin/firestore';
import { metricsService } from '../observability/metrics.service';
import { StageCounts } from '../models/contact.model';
import { deriveActionStatus } from '../utils/action-status';

interface StageUpdate {
  targetId: string;
  stage: IntroStage;
}

export interface StageSummary {
  stage: IntroStage;
  count: number;
}

type StageCountDelta = Partial<Record<IntroStage, number>>;

export class IntroductionService {
  private buildDocId(ownerId: string, targetId: string): string {
    return `${ownerId}__${targetId}`;
  }

  private emptyStageCounts(): Record<IntroStage, number> {
    return INTRO_STAGES.reduce((acc, stage) => {
      acc[stage] = 0;
      return acc;
    }, {} as Record<IntroStage, number>);
  }

  private normalizeStageCounts(counts?: Record<IntroStage, number>) {
    const base = this.emptyStageCounts();
    if (!counts) {
      return base;
    }
    INTRO_STAGES.forEach(stage => {
      if (typeof counts[stage] === 'number') {
        base[stage] = counts[stage];
      }
    });
    return base;
  }

  private async applyStageCountDelta(ownerId: string, delta: StageCountDelta) {
    const entries = Object.entries(delta).filter(([, change]) => typeof change === 'number' && change !== 0) as [IntroStage, number][];
    if (!entries.length) {
      return;
    }

    metricsService.increment('introductions.stage_count.delta_requested', entries.length, {
      ownerId,
    });

    try {
      await db.runTransaction(async (tx) => {
        const contactRef = collections.contacts().doc(ownerId);
        const snapshot = await tx.get(contactRef);
        if (!snapshot.exists) {
          console.warn('[Introductions] unable to update stage counts, contact not found', { ownerId });
          return;
        }
        const currentCounts = this.normalizeStageCounts(snapshot.get('stage_counts') as Record<IntroStage, number> | undefined);
        const updatedCounts = { ...currentCounts };
        entries.forEach(([stage, change]) => {
          updatedCounts[stage] = Math.max(0, (updatedCounts[stage] ?? 0) + change);
        });
        tx.update(contactRef, {
          stage_counts: updatedCounts,
          action_status: deriveActionStatus(updatedCounts as StageCounts)
        });
      });
      metricsService.increment('introductions.stage_count.updated', entries.length, { ownerId });
    } catch (error) {
      console.error('[Introductions] failed to apply stage count delta', { ownerId, delta, error });
      metricsService.increment('introductions.stage_count.update_error', 1, { ownerId });
    }
  }

  private async synchronizeStageCounts(ownerId: string) {
    try {
      await this.recalculateStageCounts(ownerId);
    } catch (error) {
      console.error('[Introductions] failed to recompute stage counts', { ownerId, error });
      metricsService.increment('introductions.stage_count.recompute_error', 1, { ownerId });
    }
  }

  public async recalculateStageCounts(ownerId: string): Promise<Record<IntroStage, number>> {
    const snapshot = await collections.introductions()
      .where('ownerId', '==', ownerId)
      .get();

    const counts = this.emptyStageCounts();
    snapshot.docs.forEach((doc) => {
      const data = doc.data() as Introduction;
      counts[data.stage] += 1;
    });

    const contactRef = collections.contacts().doc(ownerId);
    const contactSnapshot = await contactRef.get();
    if (!contactSnapshot.exists) {
      console.warn('[Introductions] cannot write stage counts, contact not found', { ownerId });
      metricsService.increment('introductions.stage_count.recompute_missing_contact', 1, { ownerId });
      return counts;
    }

    await contactRef.set({
      stage_counts: counts,
      action_status: deriveActionStatus(counts as StageCounts)
    }, { merge: true });
    metricsService.increment('introductions.stage_count.recomputed', 1, {
      ownerId,
      totalIntros: snapshot.size,
    });
    return counts;
  }

  // Creates or updates the stage for a target contact
  async setStage(ownerId: string, targetId: string, stage: IntroStage): Promise<Introduction> {
    const result = await metricsService.time('introductions.set_stage.duration', { ownerId }, async () => {
      const docId = this.buildDocId(ownerId, targetId);
      const docRef = collections.introductions().doc(docId);
      const snapshot = await docRef.get();
      const now = Timestamp.now();
      const delta: StageCountDelta = {};

      try {
        if (!snapshot.exists) {
          const newIntro: Omit<Introduction, 'id'> = { ownerId, targetId, stage, createdAt: now, updatedAt: now };
          await docRef.set(newIntro);
          console.info('[Introductions] created stage', { ownerId, targetId, stage });
          delta[stage] = 1;
          await this.applyStageCountDelta(ownerId, delta);
          metricsService.increment('introductions.stage_change', 1, {
            ownerId,
            stage,
            action: 'create',
          });
          return { id: docId, ...newIntro };
        }

        const previousStage = (snapshot.data() as Introduction).stage;
        await docRef.update({ stage, updatedAt: now });
        console.info('[Introductions] updated stage', { ownerId, targetId, stage });
        if (previousStage !== stage) {
          delta[previousStage] = -1;
          delta[stage] = (delta[stage] ?? 0) + 1;
          await this.applyStageCountDelta(ownerId, delta);
        }
        metricsService.increment('introductions.stage_change', 1, {
          ownerId,
          stage,
          action: 'update',
        });
        return {
          id: docId,
          ...(snapshot.data() as Introduction),
          stage,
          updatedAt: now,
        };
      } catch (error) {
        metricsService.increment('introductions.stage_change_error', 1, {
          ownerId,
          stage,
        });
        throw error;
      }
    });
    await this.synchronizeStageCounts(ownerId);
    return result;
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
    const stageDelta: StageCountDelta = {};

    updates.forEach((update, index) => {
      const docRef = docRefs[index];
      const existingDoc = existingMap.get(docRef.id);

      if (existingDoc?.exists) {
        const previousStage = (existingDoc.data() as Introduction).stage;
        batch.update(docRef, { stage: update.stage, updatedAt: now });
        if (previousStage !== update.stage) {
          stageDelta[previousStage] = (stageDelta[previousStage] ?? 0) - 1;
          stageDelta[update.stage] = (stageDelta[update.stage] ?? 0) + 1;
        }
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
      stageDelta[update.stage] = (stageDelta[update.stage] ?? 0) + 1;
      createdCount += 1;
    });
    await metricsService.time(
      'introductions.bulk_set_stage.duration',
      { ownerId, updates: updates.length },
      async () => {
        try {
          await batch.commit();
          await this.applyStageCountDelta(ownerId, stageDelta);
          console.info('[Introductions] bulk stage update', {
            ownerId,
            totalUpdates: updates.length,
            createdCount,
            updatedCount,
          });
          metricsService.increment('introductions.bulk_set_stage', updates.length, {
            ownerId,
            createdCount,
            updatedCount,
          });
        } catch (error) {
          metricsService.increment('introductions.bulk_set_stage_error', 1, {
            ownerId,
          });
          throw error;
        }
      }
    );
    await this.synchronizeStageCounts(ownerId);
  }
}

export const introductionService = new IntroductionService();
