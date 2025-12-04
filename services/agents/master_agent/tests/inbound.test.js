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
    state.listMessages.mockResolvedValue([]);
    state.insertMessage.mockResolvedValue();
    state.nextSequence.mockResolvedValue(1);
    state.updateConversationMeta.mockResolvedValue();
    state.upsertConversation.mockResolvedValue();
    state.insertMessagesBulk.mockResolvedValue();
    planner.planTools.mockResolvedValue(null);
  });

  it('reuses existing conversation for same agent+phone', async () => {
    state.getConversationByAgentAndPhone.mockResolvedValue({ id: 'conv-1' });

    const res = await request(app)
      .post('/agents/whatsapp/inbound')
      .send({
        messages: [{ body: 'hi' }],
        metadata: { flow: 'onboarding' },
        phone_number: '123',
        owner_id: 'owner-1',
      });

    expect(res.status).toBe(200);
    expect(state.getConversationByAgentAndPhone).toHaveBeenCalled();
    expect(state.createConversation).not.toHaveBeenCalled();
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
});
