import { introductionService } from './introduction.service';
import { collections, db } from '../config/firebase';
import { IntroStage } from '../models/introduction.model';

jest.mock('../config/firebase', () => {
  const batch = {
    update: jest.fn(),
    set: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined),
  };

  return {
    db: {
      batch: jest.fn(() => batch),
      getAll: jest.fn(),
    },
    collections: {
      introductions: jest.fn(),
    },
  };
});

describe('IntroductionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setStage', () => {
    it('should create a new introduction if one does not exist', async () => {
      const ownerId = 'owner1';
      const targetId = 'target1';
      const stage: IntroStage = 'prospect';
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
    });

    it('should update an existing introduction if one exists', async () => {
      const ownerId = 'owner1';
      const targetId = 'target1';
      const stage: IntroStage = 'lead';
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
        { id: existingDocRef.id, exists: true },
        { id: newDocRef.id, exists: false },
      ]);

      const batch = db.batch();
      await introductionService.bulkSetStage(ownerId, updates);

      expect(db.getAll).toHaveBeenCalled();
      expect(batch.update).toHaveBeenCalledTimes(1);
      expect(batch.set).toHaveBeenCalledTimes(1);
      expect(batch.commit).toHaveBeenCalledTimes(1);
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
});
