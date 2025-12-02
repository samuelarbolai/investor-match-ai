import express from 'express';
import { loadPrompt } from '../lib/prompt.js';
import { runChat } from '../lib/llm.js';
import { createConversation, getAgentBySlug, getConversationById, insertMessage, listMessages, nextSequence, updateConversationMeta } from '../lib/state.js';

const DEFAULT_AGENT = 'onboarding';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { conversationId, content, agentSlug: rawAgent } = req.body || {};
    const agentSlug = (rawAgent || DEFAULT_AGENT).toLowerCase();
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }
    const { content: systemPrompt, version: promptVersion } = await loadPrompt(agentSlug);
    let agent = null;
    try {
      agent = await getAgentBySlug(agentSlug);
    } catch (_err) {
      // if agents table missing, continue without agent_id
    }
    let conversation = null;
    if (conversationId) {
      conversation = await getConversationById(conversationId);
    }
    if (!conversation) {
      const title = content.slice(0, 80);
      conversation = await createConversation({
        agentId: agent ? agent.id : null,
        title,
        promptVersion: promptVersion || (agent ? agent.default_prompt_version : null),
      });
    }
    const history = await listMessages(conversation.id);
    const seq = await nextSequence(conversation.id);
    await insertMessage({ conversationId: conversation.id, role: 'user', content: content.trim(), sequence: seq });

    const assembled = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: content.trim() },
    ];

    const reply = await runChat(assembled);
    await insertMessage({ conversationId: conversation.id, role: 'assistant', content: reply, sequence: seq + 1 });
    await updateConversationMeta(conversation.id, { prompt_version: promptVersion });

    return res.json({ conversationId: conversation.id, reply });
  } catch (err) {
    console.error('messages error', err);
    return res.status(500).json({ error: err?.message || 'Unexpected server error.' });
  }
});

export default router;
