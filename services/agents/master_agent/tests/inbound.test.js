import request from 'supertest';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../lib/state.js', () => ({
  getConversationById: jest.fn(),
  getAgentBySlug: jest.fn(),
  getConversationByExternalId: jest.fn(),
  getConversationByAgentAndPhone: jest.fn(),
  createConversation: jest.fn(),
  listMessages: jest.fn(),
  nextSequence: jest.fn(),
  insertMessage: jest.fn(),
  updateConversationMeta: jest.fn(),
  recordAiEvent: jest.fn(),
}));
jest.unstable_mockModule('../lib/llm.js', () => ({
  runChat: jest.fn().mockResolvedValue('hello!'),
}));
jest.unstable_mockModule('../lib/prompt.js', () => ({
  loadPrompt: jest.fn().mockResolvedValue({ content: 'system', version: 'v1' }),
}));

const state = await import('../lib/state.js');
const prompt = await import('../lib/prompt.js');
const llm = await import('../lib/llm.js');
const { default: app } = await import('../server.js');

describe('inbound conversation reuse', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.PARSER_URL = '';
    prompt.loadPrompt.mockResolvedValue({ content: 'system', version: 'v1' });
    llm.runChat.mockResolvedValue('hello!');
    state.getAgentBySlug.mockResolvedValue({ id: 'agent-1' });
    state.getConversationByExternalId.mockResolvedValue(null);
    state.getConversationByAgentAndPhone.mockResolvedValue(null);
    state.createConversation.mockResolvedValue({ id: 'new-conv' });
    state.listMessages.mockResolvedValue([]);
    state.nextSequence.mockResolvedValue(1);
    state.insertMessage.mockResolvedValue();
    state.updateConversationMeta.mockResolvedValue();
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
    expect(state.getConversationByAgentAndPhone).toHaveBeenCalledWith('agent-1', '123');
    expect(state.createConversation).not.toHaveBeenCalled();
    expect(res.body.conversationId).toBe('conv-1');
  });
});
