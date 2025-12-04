import express from 'express';
import { runChat } from '../lib/llm.js';
import { loadPrompt } from '../lib/prompt.js';
import {
  createConversation,
  getConversationByExternalId,
  getConversationByAgentAndPhone,
  listMessages,
  getAgentBySlug,
  upsertConversation,
  insertMessagesBulk,
} from '../lib/state.js';
import { getCached, setCached, touch, deleteCached } from '../lib/cache.js';
import { planTools } from '../lib/tool-planner.js';

const router = express.Router();
const INACTIVITY_MS = parseInt(process.env.INACTIVITY_MS || '1800000', 10); // 30 minutes default

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

function onboardingComplete(replyText) {
  if (!replyText) return false;
  const normalized = replyText.toLowerCase();
  const phrases = [
    'onboarding complete',
    'onboarding is complete',
    'onboarding is done',
    'all information has been gathered',
    'i have all the information',
    'i have all the info',
    'ready to proceed',
    'ready to move forward',
    'all set with your details',
    'thanks, got everything',
  ];
  return phrases.some((p) => normalized.includes(p));
}

function isGoodbye(text) {
  if (!text) return false;
  const normalized = text.toLowerCase();
  const phrases = ['bye', 'goodbye', 'see you', 'talk later', 'thanks, bye', 'take care'];
  return phrases.some((p) => normalized.includes(p));
}

function isCloseIntent(text) {
  if (!text) return false;
  const normalized = text.toLowerCase();
  const phrases = ['conversation closed', 'ending now', 'we are done', 'this concludes'];
  return phrases.some((p) => normalized.includes(p));
}

function buildTranscript(messages, latestUser, latestAssistant) {
  const combined = [
    ...messages,
    latestUser ? { role: 'user', content: latestUser } : null,
    latestAssistant ? { role: 'assistant', content: latestAssistant } : null,
  ].filter(Boolean);
  return combined.map((m) => `${m.role}: ${m.content}`).join('\n');
}

async function flushConversation(cacheEntry, { parserUrl, forceParser = false, onboardingDone = false }) {
  const convoPatch = {
    id: cacheEntry.conversationId,
    agent_id: cacheEntry.agentId || null,
    phone_number: cacheEntry.phoneNumber || null,
    owner_id: cacheEntry.ownerId || null,
    contact_id: cacheEntry.contactId || null,
    prompt_version: cacheEntry.promptVersion,
    updated_at: new Date().toISOString(),
  };
  await upsertConversation(convoPatch);

  const newMessages = cacheEntry.messages.filter((m) => m.sequence > cacheEntry.persistedSequence);
  if (newMessages.length) {
    await insertMessagesBulk(
      newMessages.map((m) => ({
        conversation_id: cacheEntry.conversationId,
        role: m.role,
        content: m.content,
        sequence: m.sequence,
        metadata: m.metadata || null,
        created_at: new Date().toISOString(),
      }))
    );
    cacheEntry.persistedSequence = cacheEntry.messages[cacheEntry.messages.length - 1]?.sequence || cacheEntry.persistedSequence;
  }

  if (parserUrl && (forceParser || onboardingDone) && !cacheEntry.parserSentAt && cacheEntry.agentSlug === 'onboarding') {
    const transcript = buildTranscript(cacheEntry.messages);
    try {
      const resp = await fetch(parserUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: transcript }),
      });
      const text = await resp.text();
      if (resp.ok) {
        cacheEntry.parserSentAt = Date.now();
      } else {
        console.error('Parser call failed during flush:', text);
      }
    } catch (exc) {
      console.error('Parser call failed during flush:', exc);
    }
  }

  deleteCached(cacheEntry.conversationId);
}

router.post('/agents/whatsapp/inbound', async (req, res) => {
  try {
    const event = normalizeEvent(req.body);
    const content = (event.content || '').trim();
    if (!content) return res.status(400).json({ error: 'Message content is required.' });

    // initial default agent is triage until tool picks otherwise
    const initialAgentSlug = (event.metadata?.flow || 'default_triage').toLowerCase();
    let agent = null;
    try {
      agent = await getAgentBySlug(initialAgentSlug);
    } catch (_) {}

    let conversation = null;
    if (event.conversationId) {
      conversation = await getConversationByExternalId(event.conversationId);
    }
    if (!conversation && agent && event.phoneNumber) {
      conversation = await getConversationByAgentAndPhone(agent.id, event.phoneNumber);
    }
    if (!conversation) {
      try {
        conversation = await createConversation({
          agentId: agent ? agent.id : null,
          title: content.slice(0, 80),
          promptVersion: null,
          externalConversationId: event.conversationId,
          phoneNumber: event.phoneNumber,
          ownerId: event.ownerId,
          contactId: event.contactId,
        });
      } catch (err) {
        if (err.code === '23505' && agent && event.phoneNumber) {
          conversation = await getConversationByAgentAndPhone(agent.id, event.phoneNumber);
        } else {
          throw err;
        }
      }
    }

    let cache = getCached(conversation.id);
    if (!cache) {
      const history = await listMessages(conversation.id);
      const { content: systemPrompt, version: promptVersion } = await loadPrompt('default_triage');
      cache = {
        conversationId: conversation.id,
        agentId: agent ? agent.id : null,
        agentSlug: 'default_triage',
        prompt: systemPrompt,
        promptVersion,
        phoneNumber: event.phoneNumber,
        ownerId: event.ownerId,
        contactId: event.contactId,
        messages: history || [],
        persistedSequence: history && history.length ? Math.max(...history.map((m) => m.sequence || 0)) : 0,
        parserSentAt: null,
        status: 'active',
        lastTouchedAt: Date.now(),
      };
      setCached(conversation.id, cache);
    }

    // Tool planner (cheap model)
    const plannerTranscript = buildTranscript(cache.messages, content, null);
    const tool = await planTools({
      transcript: plannerTranscript,
      metadata: event.metadata || {},
      agentSlug: cache.agentSlug,
      hasAgent: cache.agentSlug && cache.agentSlug !== 'default_triage',
    });

    let agentSlug = cache.agentSlug;
    if (tool?.name === 'pick_agent' && tool.args?.agent) {
      agentSlug = tool.args.agent.toLowerCase();
      try {
        const { content: promptContent, version: promptVersion } = await loadPrompt(agentSlug);
        let selectedAgent = null;
        try {
          selectedAgent = await getAgentBySlug(agentSlug);
        } catch (_) {}
        cache.agentSlug = agentSlug;
        cache.agentId = selectedAgent ? selectedAgent.id : cache.agentId;
        cache.prompt = promptContent;
        cache.promptVersion = promptVersion;
      } catch (err) {
        console.error('Failed to load agent prompt', err);
      }
    }

    const seq = (cache.messages[cache.messages.length - 1]?.sequence || 0) + 1;
    cache.messages.push({ role: 'user', content, sequence: seq, metadata: event.metadata || null });

    const assembled = [
      { role: 'system', content: cache.prompt },
      ...cache.messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const reply = await runChat(assembled);
    cache.messages.push({ role: 'assistant', content: reply, sequence: seq + 1 });
    cache.promptVersion = cache.promptVersion || cache.promptVersion;
    touch(cache.conversationId);

    let parserResult = { skipped: true, reason: 'parser not called' };
    const parserUrl = process.env.PARSER_URL;
    const onboardingDone = cache.agentSlug === 'onboarding' && onboardingComplete(reply);
    const goodbye = isGoodbye(content) || isGoodbye(reply);
    const closeIntent = isCloseIntent(reply);
    const plannerEnd = tool?.name === 'end_conversation';

    if (parserUrl && onboardingDone && !cache.parserSentAt) {
      const transcript = buildTranscript(cache.messages);
      try {
        const resp = await fetch(parserUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversation: transcript }),
        });
        const text = await resp.text();
        if (!resp.ok) throw new Error(`parser ${resp.status}: ${text}`);
        parserResult = JSON.parse(text);
        cache.parserSentAt = Date.now();
      } catch (exc) {
        console.error('Parser call failed:', exc);
        parserResult = { error: exc.message };
      }
    }

    const shouldFlush = plannerEnd || goodbye || closeIntent || onboardingDone;
    if (shouldFlush) {
      await flushConversation(cache, {
        parserUrl,
        forceParser: false,
        onboardingDone,
      });
    } else {
      setCached(cache.conversationId, cache);
    }

    return res.json({ conversationId: conversation.id, reply, conversation_complete: true, parser_result: parserResult });
  } catch (err) {
    console.error('inbound error', err);
    return res.status(500).json({ error: err?.message || 'Unexpected server error' });
  }
});

export default router;
