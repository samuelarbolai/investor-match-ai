import request from 'supertest';
import { jest } from '@jest/globals';

const cacheStore = new Map();

jest.unstable_mockModule('../lib/cache.js', () => ({
  getCached: jest.fn((id) => cacheStore.get(id) || null),
  setCached: jest.fn((id, data) => cacheStore.set(id, data)),
  touch: jest.fn((id) => {
    const entry = cacheStore.get(id);
    if (entry) entry.lastTouchedAt = Date.now();
  }),
  deleteCached: jest.fn((id) => cacheStore.delete(id)),
  sweep: jest.fn(),
}));

jest.unstable_mockModule('../lib/state.js', () => ({
  getConversationById: jest.fn(),
  getAgentBySlug: jest.fn(),
  getConversationByExternalId: jest.fn(),
  getConversationByAgentAndPhone: jest.fn(),
  createConversation: jest.fn(),
  listMessages: jest.fn(),
  insertMessage: jest.fn(),
  nextSequence: jest.fn(),
  updateConversationMeta: jest.fn(),
  upsertConversation: jest.fn(),
  insertMessagesBulk: jest.fn(),
  recordAiEvent: jest.fn(),
  upsertConversationByAgentAndPhone: jest.fn(),
}));
jest.unstable_mockModule('../lib/llm.js', () => ({
  runChat: jest.fn().mockResolvedValue('hello!'),
}));
jest.unstable_mockModule('../lib/prompt.js', () => ({
  loadPrompt: jest.fn().mockResolvedValue({ content: 'system', version: 'v1' }),
}));
jest.unstable_mockModule('../lib/tool-planner.js', () => ({
  planTools: jest.fn().mockResolvedValue(null),
}));

const cache = await import('../lib/cache.js');
const state = await import('../lib/state.js');
const prompt = await import('../lib/prompt.js');
const llm = await import('../lib/llm.js');
const planner = await import('../lib/tool-planner.js');
const { default: app } = await import('../server.js');

describe('inbound conversation reuse and parser gating', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    cacheStore.clear();
    process.env.PARSER_URL = '';
    prompt.loadPrompt.mockResolvedValue({ content: 'system', version: 'v1' });
    llm.runChat.mockResolvedValue('hello!');
    state.getAgentBySlug.mockResolvedValue({ id: 'agent-1' });
    state.getConversationByExternalId.mockResolvedValue(null);
    state.getConversationByAgentAndPhone.mockResolvedValue(null);
    state.createConversation.mockResolvedValue({ id: 'new-conv' });
    state.upsertConversationByAgentAndPhone.mockResolvedValue({ id: 'new-conv' });
    state.listMessages.mockResolvedValue([]);
    state.insertMessage.mockResolvedValue();
    state.nextSequence.mockResolvedValue(1);
    state.updateConversationMeta.mockResolvedValue();
    state.upsertConversation.mockResolvedValue();
    state.insertMessagesBulk.mockResolvedValue();
    planner.planTools.mockResolvedValue(null);
  });

  it('reuses existing conversation for same agent+phone', async () => {
    // Mock existing conversation found by external ID (primary check)
    state.getConversationByExternalId.mockResolvedValue({ id: 'conv-1' });

    const res = await request(app)
      .post('/agents/whatsapp/inbound')
      .send({
        messages: [{ body: 'hi' }],
        metadata: { flow: 'onboarding' },
        phone_number: '123',
        owner_id: 'owner-1',
        conversation_id: 'external-123',
      });

    expect(res.status).toBe(200);
    expect(state.getConversationByExternalId).toHaveBeenCalled();
    expect(state.upsertConversationByAgentAndPhone).not.toHaveBeenCalled();
    expect(res.body.conversationId).toBe('conv-1');
  });

  it('calls parser only when onboarding reply indicates completion', async () => {
    process.env.PARSER_URL = 'http://parser';
    planner.planTools.mockResolvedValue({ name: 'pick_agent', args: { agent: 'onboarding' } });
    llm.runChat.mockResolvedValue('Onboarding is complete, all information gathered.');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"ok":true}',
    });

    await request(app)
      .post('/agents/whatsapp/inbound')
      .send({
        messages: [{ body: 'hi' }],
        metadata: { flow: 'onboarding' },
        phone_number: '123',
        owner_id: 'owner-1',
      });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url] = global.fetch.mock.calls[0];
    expect(url).toBe('http://parser');
  });

  it('skips parser when onboarding not complete', async () => {
    process.env.PARSER_URL = 'http://parser';
    planner.planTools.mockResolvedValue({ name: 'pick_agent', args: { agent: 'onboarding' } });
    llm.runChat.mockResolvedValue('Got it, tell me your email.');
    global.fetch = jest.fn();

    const res = await request(app)
      .post('/agents/whatsapp/inbound')
      .send({
        messages: [{ body: 'hi' }],
        metadata: { flow: 'onboarding' },
        phone_number: '123',
        owner_id: 'owner-1',
      });

    expect(res.status).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(res.body.parser_result.skipped).toBe(true);
  });

  it('handles concurrent requests without race condition using upsert', async () => {
    // Simulate race condition: no existing conversation found
    state.getConversationByExternalId.mockResolvedValue(null);

    // Mock upsert to return same conversation for concurrent requests
    const sharedConversation = { id: 'conv-race-test' };
    state.upsertConversationByAgentAndPhone.mockResolvedValue(sharedConversation);
    state.listMessages.mockResolvedValue([]);

    // Send two concurrent requests with same agent+phone
    const [res1, res2] = await Promise.all([
      request(app)
        .post('/agents/whatsapp/inbound')
        .send({
          messages: [{ body: 'hello 1' }],
          metadata: { flow: 'onboarding' },
          phone_number: '573168248411',
          owner_id: 'owner-1',
        }),
      request(app)
        .post('/agents/whatsapp/inbound')
        .send({
          messages: [{ body: 'hello 2' }],
          metadata: { flow: 'onboarding' },
          phone_number: '573168248411',
          owner_id: 'owner-1',
        }),
    ]);

    // Both requests should succeed
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    // Both should get the same conversation ID
    expect(res1.body.conversationId).toBe('conv-race-test');
    expect(res2.body.conversationId).toBe('conv-race-test');

    // Upsert should have been called (not createConversation with try/catch)
    expect(state.upsertConversationByAgentAndPhone).toHaveBeenCalled();

    // No duplicate key error should occur (no createConversation fallback)
    expect(state.createConversation).not.toHaveBeenCalled();
  });
});
