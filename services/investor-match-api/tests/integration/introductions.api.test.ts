import request from 'supertest';

jest.mock('../../src/config/firebase', () => {
  const contactsCollection = {
    doc: jest.fn(() => ({
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({ id: 'contact', stage_counts: {} })
      }),
      set: jest.fn().mockResolvedValue(undefined)
    })),
    where: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({ docs: [] })
  };

  const introductionsCollection = {
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn()
    })),
    where: jest.fn().mockReturnThis(),
    get: jest.fn()
  };

  return {
    collections: {
      contacts: () => contactsCollection,
      introductions: () => introductionsCollection
    },
    db: {
      runTransaction: jest.fn(),
      batch: jest.fn()
    },
    Timestamp: {
      now: jest.fn(() => ({ seconds: Date.now() }))
    }
  };
});

jest.mock('../../src/services/introduction.service', () => ({
  introductionService: {
    setStage: jest.fn(),
    getContactsInStage: jest.fn(),
    getIntroductions: jest.fn(),
    bulkSetStage: jest.fn(),
    getStageSummary: jest.fn(),
    recalculateStageCounts: jest.fn()
  }
}));

import { app } from '../../src/server';
import { introductionService } from '../../src/services/introduction.service';

describe('Introductions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates or updates a stage', async () => {
    (introductionService.setStage as jest.Mock).mockResolvedValue({
      id: 'owner__target',
      ownerId: 'owner',
      targetId: 'target',
      stage: 'lead'
    });

    const response = await request(app)
      .post('/v1/introductions/stage')
      .send({ ownerId: 'owner', targetId: 'target', stage: 'lead' });

    expect(response.status).toBe(201);
    expect(introductionService.setStage).toHaveBeenCalledWith('owner', 'target', 'lead');
  });

  it('lists introductions when no stage filter provided', async () => {
    (introductionService.getIntroductions as jest.Mock).mockResolvedValue([
      { id: 'owner__a', ownerId: 'owner', targetId: 'a', stage: 'prospect' }
    ]);

    const response = await request(app)
      .get('/v1/introductions/stage')
      .query({ ownerId: 'owner' });

    expect(response.status).toBe(200);
    expect(introductionService.getIntroductions).toHaveBeenCalledWith('owner');
    expect(response.body).toHaveLength(1);
  });

  it('bulk updates stages', async () => {
    (introductionService.bulkSetStage as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post('/v1/introductions/stages/bulk-update')
      .send({
        ownerId: 'owner',
        updates: [{ targetId: 'a', stage: 'met' }]
      });

    expect(response.status).toBe(204);
    expect(introductionService.bulkSetStage).toHaveBeenCalledWith('owner', [{ targetId: 'a', stage: 'met' }]);
  });

  it('returns stage summary', async () => {
    (introductionService.getStageSummary as jest.Mock).mockResolvedValue([
      { stage: 'prospect', count: 2 }
    ]);

    const response = await request(app)
      .get('/v1/introductions/stage/summary')
      .query({ ownerId: 'owner' });

    expect(response.status).toBe(200);
    expect(response.body[0].stage).toBe('prospect');
  });

  it('recomputes stage counts via endpoint', async () => {
    (introductionService.recalculateStageCounts as jest.Mock).mockResolvedValue({ prospect: 1 });

    const response = await request(app)
      .post('/v1/introductions/stage/recompute')
      .send({ ownerId: 'owner' });

    expect(response.status).toBe(200);
    expect(response.body.stage_counts).toEqual({ prospect: 1 });
  });

  it('validates missing ownerId on summary requests', async () => {
    const response = await request(app)
      .get('/v1/introductions/stage/summary');

    expect(response.status).toBe(400);
  });
});
