import { introductionService } from './introduction.service';
import { collections, db } from '../config/firebase';
import { IntroStage, INTRO_STAGES } from '../models/introduction.model';
import { metricsService } from '../observability/metrics.service';

const contactDoc = {
  id: 'owner1',
  get: jest.fn().mockResolvedValue({ exists: true }),
  set: jest.fn().mockResolvedValue(undefined),
};

const buildStageCounts = (overrides: Partial<Record<IntroStage, number>> = {}) => {
  return INTRO_STAGES.reduce((acc, stage) => {
    acc[stage] = overrides[stage] ?? 0;
    return acc;
  }, {} as Record<IntroStage, number>);
};

jest.mock('../config/firebase', () => {
  const batch = {
    update: jest.fn(),
    set: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined),
  };

  const transaction = {
    get: jest.fn().mockResolvedValue({
      exists: true,
      get: jest.fn().mockReturnValue(undefined),
    }),
    update: jest.fn(),
  };

  return {
    db: {
      batch: jest.fn(() => batch),
      getAll: jest.fn(),
      runTransaction: jest.fn((fn: any) => fn(transaction)),
      __transactionMock: transaction,
    },
    collections: {
      introductions: jest.fn(),
      contacts: jest.fn(() => ({
        doc: jest.fn(() => contactDoc),
      })),
    },
  };
});

jest.mock('../observability/metrics.service', () => {
  const increment = jest.fn();
  const recordDuration = jest.fn();
  const time = jest.fn((_name: string, _labels: Record<string, unknown>, fn: any) => fn());
  return { metricsService: { increment, recordDuration, time } };
});

describe('IntroductionService', () => {
  beforeEach(() => {
    ((collections.contacts) as jest.Mock).mockReturnValue({
      doc: jest.fn(() => contactDoc),
    });
    contactDoc.set.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setStage', () => {
    it('should create a new introduction if one does not exist', async () => {
      const ownerId = 'owner1';
      const targetId = 'target1';
      const stage: IntroStage = 'prospect';
      const recalcSpy = jest
        .spyOn(introductionService, 'recalculateStageCounts')
        .mockResolvedValue(buildStageCounts({ prospect: 1 }));
      const docRef = {
        id: `${ownerId}__${targetId}`,
        get: jest.fn().mockResolvedValue({ exists: false }),
        set: jest.fn().mockResolvedValue(undefined),
        update: jest.fn(),
      };

      ((collections.introductions) as jest.Mock).mockReturnValue({
        doc: jest.fn().mockReturnValue(docRef),
        where: jest.fn().mockReturnThis(),
        get: jest.fn(),
      });

      const result = await introductionService.setStage(ownerId, targetId, stage);

      expect(collections.introductions).toHaveBeenCalled();
      expect(docRef.set).toHaveBeenCalledWith(expect.objectContaining({ ownerId, targetId, stage }));
      expect(result.ownerId).toBe(ownerId);
      expect(result.targetId).toBe(targetId);
      expect(result.stage).toBe(stage);
      expect(result.id).toBe(`${ownerId}__${targetId}`);
      expect((db.runTransaction as jest.Mock)).toHaveBeenCalled();
      expect(recalcSpy).toHaveBeenCalledWith(ownerId);
      recalcSpy.mockRestore();
      const transaction = (db as any).__transactionMock;
      expect(transaction.update).toHaveBeenCalled();
      const stagePayload = transaction.update.mock.calls[0][1];
      expect(stagePayload.stage_counts.prospect).toBe(1);

      const metricsMock = metricsService as jest.Mocked<typeof metricsService>;
      expect(metricsMock.time).toHaveBeenCalledWith(
        'introductions.set_stage.duration',
        { ownerId },
        expect.any(Function)
      );
      expect(metricsMock.increment).toHaveBeenCalledWith(
        'introductions.stage_change',
        1,
        expect.objectContaining({ ownerId, stage, action: 'create' })
      );
    });

    it('should update an existing introduction if one exists', async () => {
      const ownerId = 'owner1';
      const targetId = 'target1';
      const stage: IntroStage = 'lead';
      const recalcSpy = jest
        .spyOn(introductionService, 'recalculateStageCounts')
        .mockResolvedValue(buildStageCounts({ lead: 1 }));
      const existingDoc = {
        id: `${ownerId}__${targetId}`,
        get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ ownerId, targetId, stage: 'prospect' }) }),
        set: jest.fn(),
        update: jest.fn().mockResolvedValue(undefined),
      };

      ((collections.introductions) as jest.Mock).mockReturnValue({
        doc: jest.fn().mockReturnValue(existingDoc),
        where: jest.fn().mockReturnThis(),
        get: jest.fn(),
      });

      const result = await introductionService.setStage(ownerId, targetId, stage);

      expect(existingDoc.update).toHaveBeenCalledWith(expect.objectContaining({ stage }));
      expect(result.stage).toBe(stage);
      expect((db.runTransaction as jest.Mock)).toHaveBeenCalled();
      expect(recalcSpy).toHaveBeenCalledWith(ownerId);
      recalcSpy.mockRestore();

      const metricsMock = metricsService as jest.Mocked<typeof metricsService>;
      expect(metricsMock.increment).toHaveBeenCalledWith(
        'introductions.stage_change',
        1,
        expect.objectContaining({ ownerId, stage, action: 'update' })
      );
    });
  });

  describe('getContactsInStage', () => {
    it('should return contacts in a specific stage', async () => {
      const ownerId = 'owner1';
      const stage: IntroStage = 'prospect';
      const mockDocs = [
        { id: '1', data: () => ({ ownerId, targetId: 'target1', stage }) },
        { id: '2', data: () => ({ ownerId, targetId: 'target2', stage }) },
      ];

      ((collections.introductions) as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          docs: mockDocs,
        }),
        doc: jest.fn(),
      });

      const result = await introductionService.getContactsInStage(ownerId, stage);

      expect(result.length).toBe(2);
      expect(result[0].targetId).toBe('target1');
    });
  });

  describe('getIntroductions', () => {
    it('should return all introductions for an owner', async () => {
      const ownerId = 'owner1';
      const mockDocs = [
        { id: '1', data: () => ({ ownerId, targetId: 'target1', stage: 'prospect' }) },
        { id: '2', data: () => ({ ownerId, targetId: 'target2', stage: 'lead' }) },
      ];

      ((collections.introductions) as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          docs: mockDocs,
        }),
        doc: jest.fn(),
      });

      const result = await introductionService.getIntroductions(ownerId);

      expect(result.length).toBe(2);
    });
  });

  describe('bulkSetStage', () => {
    it('should create and update introductions in a batch', async () => {
      const ownerId = 'owner1';
      const updates = [
        { targetId: 'target1', stage: 'lead' as IntroStage }, // Will be an update
        { targetId: 'target2', stage: 'prospect' as IntroStage }, // Will be a new creation
      ];
      const recalcSpy = jest
        .spyOn(introductionService, 'recalculateStageCounts')
        .mockResolvedValue(buildStageCounts({ lead: 1, prospect: 1 }));

      const existingDocRef = {
        id: `${ownerId}__target1`,
        update: jest.fn(),
        set: jest.fn(),
      };
      const newDocRef = {
        id: `${ownerId}__target2`,
        update: jest.fn(),
        set: jest.fn(),
      };

      ((collections.introductions) as jest.Mock).mockReturnValue({
        doc: jest.fn((docId: string) => (docId.endsWith('target1') ? existingDocRef : newDocRef)),
        where: jest.fn().mockReturnThis(),
        get: jest.fn(),
      });

      (db.getAll as jest.Mock).mockResolvedValue([
        { id: existingDocRef.id, exists: true, data: () => ({ stage: 'prospect' }) },
        { id: newDocRef.id, exists: false },
      ]);

      const batch = db.batch();
      await introductionService.bulkSetStage(ownerId, updates);

      expect(db.getAll).toHaveBeenCalled();
      expect(batch.update).toHaveBeenCalledTimes(1);
      expect(batch.set).toHaveBeenCalledTimes(1);
      expect(batch.commit).toHaveBeenCalledTimes(1);
      expect((db.runTransaction as jest.Mock)).toHaveBeenCalled();
      expect(recalcSpy).toHaveBeenCalledWith(ownerId);
      recalcSpy.mockRestore();

      const metricsMock = metricsService as jest.Mocked<typeof metricsService>;
      expect(metricsMock.time).toHaveBeenCalledWith(
        'introductions.bulk_set_stage.duration',
        { ownerId, updates: updates.length },
        expect.any(Function)
      );
      expect(metricsMock.increment).toHaveBeenCalledWith(
        'introductions.bulk_set_stage',
        updates.length,
        expect.objectContaining({ ownerId })
      );
    });
  });

  describe('getStageSummary', () => {
    it('should return counts for each stage', async () => {
      const ownerId = 'owner1';
      const mockDocs = [
        { id: '1', data: () => ({ ownerId, targetId: 'a', stage: 'lead' as IntroStage }) },
        { id: '2', data: () => ({ ownerId, targetId: 'b', stage: 'lead' as IntroStage }) },
        { id: '3', data: () => ({ ownerId, targetId: 'c', stage: 'met' as IntroStage }) },
      ];

      ((collections.introductions) as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          docs: mockDocs,
        }),
        doc: jest.fn(),
      });

      const summary = await introductionService.getStageSummary(ownerId);
      const lead = summary.find(item => item.stage === 'lead');
      const disqualified = summary.find(item => item.stage === 'disqualified');

      expect(lead?.count).toBe(2);
      expect(disqualified?.count).toBe(0);
    });
  });

  describe('recalculateStageCounts', () => {
    it('should recompute counts and persist them', async () => {
      const ownerId = 'owner-recalc';
      const mockDocs = [
        { data: () => ({ ownerId, targetId: 'a', stage: 'lead' as IntroStage }) },
        { data: () => ({ ownerId, targetId: 'b', stage: 'lead' as IntroStage }) },
        { data: () => ({ ownerId, targetId: 'c', stage: 'prospect' as IntroStage }) },
      ];

      ((collections.introductions) as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({ docs: mockDocs }),
        doc: jest.fn(),
      });

      const contactRef = {
        get: jest.fn().mockResolvedValue({ exists: true }),
        set: jest.fn().mockResolvedValue(undefined),
      };
      ((collections.contacts) as jest.Mock).mockReturnValue({
        doc: jest.fn().mockReturnValue(contactRef),
      });

      const counts = await introductionService.recalculateStageCounts(ownerId);

      expect(contactRef.set).toHaveBeenCalledWith(
        {
          stage_counts: expect.objectContaining({
            lead: 2,
            prospect: 1,
          }),
        },
        { merge: true }
      );
      expect(counts.lead).toBe(2);
      expect(counts.prospect).toBe(1);
    });

    it('handles missing owner contacts without throwing', async () => {
      const ownerId = 'missing-owner';
      ((collections.introductions) as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({ docs: [] }),
        doc: jest.fn(),
      });

      const contactRef = {
        get: jest.fn().mockResolvedValue({ exists: false }),
        set: jest.fn(),
      };
      ((collections.contacts) as jest.Mock).mockReturnValue({
        doc: jest.fn().mockReturnValue(contactRef),
      });

      const counts = await introductionService.recalculateStageCounts(ownerId);

      expect(contactRef.set).not.toHaveBeenCalled();
      const metricsMock = metricsService as jest.Mocked<typeof metricsService>;
      expect(metricsMock.increment).toHaveBeenCalledWith(
        'introductions.stage_count.recompute_missing_contact',
        1,
        expect.objectContaining({ ownerId })
      );
      expect(counts.prospect).toBe(0);
    });
  });
});
