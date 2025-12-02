import express from 'express';
import { runChat } from '../lib/llm.js';
import { loadPrompt } from '../lib/prompt.js';
import { createConversation, getConversationByExternalId, insertMessage, listMessages, nextSequence, updateConversationMeta, getAgentBySlug } from '../lib/state.js';

const router = express.Router();

// Normalize Kapso-like inbound payload to reuse the same flow.
function normalizeEvent(body) {
  const { messages = [], metadata = {}, conversation_id, phone_number, owner_id, contact_id } = body || {};
  const text = messages[0]?.body || '';
  return {
    content: text,
    conversationId: conversation_id || null,
    metadata,
    phoneNumber: phone_number,
    ownerId: owner_id,
    contactId: contact_id,
  };
}

router.post('/agents/whatsapp/inbound', async (req, res) => {
  try {
    const event = normalizeEvent(req.body);
    const content = (event.content || '').trim();
    if (!content) return res.status(400).json({ error: 'Message content is required.' });

    const agentSlug = (event.metadata?.flow || 'onboarding').toLowerCase();
    const { content: systemPrompt, version: promptVersion } = await loadPrompt(agentSlug);
    let agent = null;
    try {
      agent = await getAgentBySlug(agentSlug);
    } catch (_) {}

    let conversation = null;
    if (event.conversationId) {
      conversation = await getConversationByExternalId(event.conversationId);
    }
    if (!conversation) {
      conversation = await createConversation({
        agentId: agent ? agent.id : null,
        title: content.slice(0, 80),
        promptVersion,
        externalConversationId: event.conversationId,
        phoneNumber: event.phoneNumber,
        ownerId: event.ownerId,
        contactId: event.contactId,
      });
    }
    const history = await listMessages(conversation.id);
    const seq = await nextSequence(conversation.id);
    await insertMessage({ conversationId: conversation.id, role: 'user', content, sequence: seq, metadata: event.metadata || null });

    const assembled = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content },
    ];

    const reply = await runChat(assembled);
    await insertMessage({ conversationId: conversation.id, role: 'assistant', content: reply, sequence: seq + 1 });
    await updateConversationMeta(conversation.id, { prompt_version: promptVersion });

    let parserResult = null;
    const parserUrl = process.env.PARSER_URL;
    if (parserUrl) {
      const transcript = [
        ...history,
        { role: 'user', content },
        { role: 'assistant', content: reply },
      ]
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');

      try {
        const resp = await fetch(parserUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversation: transcript }),
        });
        const text = await resp.text();
        if (!resp.ok) {
          throw new Error(`parser ${resp.status}: ${text}`);
        }
        parserResult = JSON.parse(text);
      } catch (exc) {
        console.error('Parser call failed:', exc);
        parserResult = { error: exc.message };
      }
    }

    return res.json({ conversationId: conversation.id, reply, conversation_complete: true, parser_result: parserResult });
  } catch (err) {
    console.error('inbound error', err);
    return res.status(500).json({ error: err?.message || 'Unexpected server error' });
  }
});

export default router;
