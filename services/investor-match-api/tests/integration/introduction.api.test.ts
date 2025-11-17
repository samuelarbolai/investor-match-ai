import request from 'supertest';
import type { Express } from 'express';

jest.mock('../../src/config/firebase', () => {
  const admin = require('firebase-admin');
  if (!admin.apps.length) {
    admin.initializeApp({ projectId: 'test-project' });
  }

  const Timestamp = admin.firestore.Timestamp;
  const stores: Map<string, Map<string, any>> = new Map();

  const ensureStore = (collectionName: string) => {
    if (!stores.has(collectionName)) {
      stores.set(collectionName, new Map());
    }
    return stores.get(collectionName)!;
  };

  const createDocRef = (collectionName: string, docId: string) => ({
    id: docId,
    async get() {
      const data = ensureStore(collectionName).get(docId);
      return {
        id: docId,
        exists: data !== undefined,
        data: () => data,
      };
    },
    async set(payload: any) {
      ensureStore(collectionName).set(docId, payload);
    },
    async update(payload: any) {
      const existing = ensureStore(collectionName).get(docId);
      if (!existing) {
        throw new Error(`Document ${docId} not found`);
      }
      ensureStore(collectionName).set(docId, { ...existing, ...payload });
    },
  });

  const createQuery = (collectionName: string, filters: Array<{ field: string; value: any }>) => ({
    where(field: string, op: string, value: any) {
      if (op !== '==') {
        throw new Error('Test Firestore mock only supports == filters');
      }
      return createQuery(collectionName, [...filters, { field, value }]);
    },
    async get() {
      const docs: Array<any> = [];
      ensureStore(collectionName).forEach((doc, id) => {
        const matches = filters.every(filter => doc && doc[filter.field] === filter.value);
        if (matches) {
          docs.push({
            id,
            data: () => doc,
            ref: createDocRef(collectionName, id),
          });
        }
      });
      return { docs };
    },
  });

  const createCollection = (collectionName: string) => {
    const baseQuery = createQuery(collectionName, []);
    return {
      doc(docId?: string) {
        const id = docId ?? `${collectionName}-${Math.random().toString(36).slice(2)}`;
        return createDocRef(collectionName, id);
      },
      add: async (payload: any) => {
        const docRef = createDocRef(collectionName, `${collectionName}-${Math.random().toString(36).slice(2)}`);
        await docRef.set(payload);
        return { id: docRef.id };
      },
      where: baseQuery.where,
      get: baseQuery.get,
    };
  };

  const db = {
    batch: () => {
      const operations: Array<() => Promise<void>> = [];
      return {
        set: (docRef: any, payload: any) => operations.push(() => docRef.set(payload)),
        update: (docRef: any, payload: any) => operations.push(() => docRef.update(payload)),
        commit: async () => {
          for (const op of operations) {
            await op();
          }
        },
      };
    },
    getAll: async (...docRefs: any[]) => Promise.all(docRefs.map(ref => ref.get())),
    collection: (collectionName: string) => createCollection(collectionName),
  };

  const getCollection = (collectionName: string) => createCollection(collectionName);

  const proxyCollections = new Proxy(
    {},
    {
      get: (_target, prop: string) => () => createCollection(prop),
    }
  );

  return {
    db,
    admin,
    Timestamp,
    collections: proxyCollections,
    getCollection,
    __reset: () => {
      stores.clear();
    },
  };
});

/**
 * Set RUN_INTRO_API_TESTS=true to exercise these tests locally.
 */
const firebaseMock = jest.requireMock('../../src/config/firebase') as { __reset: () => void };
const runHttpTests = process.env.RUN_INTRO_API_TESTS === 'true';
const describeIf = runHttpTests ? describe : describe.skip;
let app: Express;

describeIf('Introductions API Integration Tests', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    const serverModule = require('../../src/server');
    app = serverModule.default || serverModule.app || serverModule;
  });

  beforeEach(() => {
    firebaseMock.__reset();
  });

  it('creates, filters, and summarizes introductions', async () => {
    const ownerId = 'owner-int-test';

    const createResponse = await request(app)
      .post('/v1/introductions/stage')
      .send({
        ownerId,
        targetId: 'target-1',
        stage: 'prospect',
      })
      .expect(201);

    expect(createResponse.body).toMatchObject({
      ownerId,
      targetId: 'target-1',
      stage: 'prospect',
    });

    const listResponse = await request(app)
      .get('/v1/introductions/stage')
      .query({ ownerId })
      .expect(200);

    expect(listResponse.body).toHaveLength(1);

    await request(app)
      .post('/v1/introductions/stages/bulk-update')
      .send({
        ownerId,
        updates: [
          { targetId: 'target-1', stage: 'lead' },
          { targetId: 'target-2', stage: 'met' },
        ],
      })
      .expect(204);

    const leadResponse = await request(app)
      .get('/v1/introductions/stage')
      .query({ ownerId, stage: 'lead' })
      .expect(200);

    expect(leadResponse.body).toHaveLength(1);
    expect(leadResponse.body[0]).toMatchObject({ targetId: 'target-1', stage: 'lead' });

    const summaryResponse = await request(app)
      .get('/v1/introductions/stage/summary')
      .query({ ownerId })
      .expect(200);

    const leadStage = summaryResponse.body.find((item: any) => item.stage === 'lead');
    const metStage = summaryResponse.body.find((item: any) => item.stage === 'met');
    const prospectStage = summaryResponse.body.find((item: any) => item.stage === 'prospect');

    expect(leadStage?.count).toBe(1);
    expect(metStage?.count).toBe(1);
    expect(prospectStage?.count).toBe(0);
  });
});
