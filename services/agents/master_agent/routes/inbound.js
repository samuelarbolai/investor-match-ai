import express from 'express';
import { runChat } from '../lib/llm.js';
import { loadPrompt } from '../lib/prompt.js';
import {
  getConversationByExternalId,
  listMessages,
  getAgentBySlug,
  upsertConversation,
  insertMessagesBulk,
  upsertConversationByAgentAndPhone,
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
    // Don't update agent_id or phone_number - they're part of unique constraint and shouldn't change
    owner_id: cacheEntry.ownerId || null,
    contact_id: cacheEntry.contactId || null,
    prompt_version: cacheEntry.promptVersion,
    parser_sent_at: cacheEntry.parserSentAt ? new Date(cacheEntry.parserSentAt).toISOString() : null,
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
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[request-start] id=${requestId} phoneNumber=${req.body?.phone_number} conversationId=${req.body?.conversation_id} flow=${req.body?.metadata?.flow}`);
  try {
    const event = normalizeEvent(req.body);
    const content = (event.content || '').trim();
    if (!content) return res.status(400).json({ error: 'Message content is required.' });

    // initial default agent is triage until tool picks otherwise
    const initialAgentName = (event.metadata?.flow || 'default_triage').toLowerCase();
    const agent = await getAgentBySlug(initialAgentName);
    if (!agent) {
      throw new Error(`Agent not found for slug ${initialAgentName}`);
    }

    let conversation = null;
    if (event.conversationId) {
      conversation = await getConversationByExternalId(event.conversationId);
    }
    if (!conversation && agent && event.phoneNumber) {
      // Use upsert to handle race conditions atomically
      console.log(`[conversation-upsert] id=${requestId} attempting for agentId=${agent.id} phoneNumber=${event.phoneNumber}`);
      conversation = await upsertConversationByAgentAndPhone({
        agentId: agent.id,
        phoneNumber: event.phoneNumber,
        title: content.slice(0, 80),
        promptVersion: null,
        externalConversationId: event.conversationId,
        ownerId: event.ownerId,
        contactId: event.contactId,
      });
      console.log(`[conversation-upserted] id=${requestId} conversationId=${conversation.id} agentId=${agent.id} phoneNumber=${event.phoneNumber}`);
    } else if (conversation) {
      console.log(`[conversation-found] id=${requestId} conversationId=${conversation.id} agentId=${agent.id} phoneNumber=${event.phoneNumber}`);
    }

    let cache = getCached(conversation.id);
    if (!cache) {
      console.log(`[cache-miss] id=${requestId} conversationId=${conversation.id} loading from DB`);
      const history = await listMessages(conversation.id);
      const { content: systemPrompt, version: promptVersion } = await loadPrompt('default_triage');
      cache = {
        conversationId: conversation.id,
        agentId: agent.id,
        agentSlug: 'default_triage',
        prompt: systemPrompt,
        promptVersion,
        phoneNumber: event.phoneNumber,
        ownerId: event.ownerId,
        contactId: event.contactId,
        messages: history || [],
        persistedSequence: history && history.length ? Math.max(...history.map((m) => m.sequence || 0)) : 0,
        parserSentAt: conversation.parser_sent_at ? new Date(conversation.parser_sent_at).getTime() : null,
        status: 'active',
        lastTouchedAt: Date.now(),
      };
      setCached(conversation.id, cache);
      console.log(`[cache-created] id=${requestId} conversationId=${conversation.id} messageCount=${history?.length || 0} agentSlug=${cache.agentSlug}`);
    } else {
      console.log(`[cache-hit] id=${requestId} conversationId=${conversation.id} agentSlug=${cache.agentSlug} messageCount=${cache.messages.length} parserSentAt=${cache.parserSentAt}`);
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
      const newAgentSlug = tool.args.agent.toLowerCase();
      console.log(`[agent-switch] id=${requestId} conversationId=${conversation.id} from=${agentSlug} to=${newAgentSlug} reason=tool-planner`);
      agentSlug = newAgentSlug;
      const selectedAgent = await getAgentBySlug(agentSlug);
      if (!selectedAgent) {
        throw new Error(`Agent not found for slug ${agentSlug}`);
      }
      const { content: promptContent, version: promptVersion } = await loadPrompt(agentSlug);
      cache.agentSlug = agentSlug;
      cache.agentId = selectedAgent.id;
      cache.prompt = promptContent;
      cache.promptVersion = promptVersion;
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

    console.log(`[parser-decision] id=${requestId} conversationId=${conversation.id} agentSlug=${cache.agentSlug} onboardingDone=${onboardingDone} parserSentAt=${cache.parserSentAt} hasParserUrl=${!!parserUrl}`);
    console.log(`[parser-decision] id=${requestId} reply="${reply.slice(0, 100)}..." contains completion phrase: ${onboardingComplete(reply)}`);

    if (parserUrl && onboardingDone && !cache.parserSentAt) {
      console.log(`[parser-calling] id=${requestId} conversationId=${conversation.id} phoneNumber=${event.phoneNumber} transcript length=${cache.messages.length}`);
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
        console.log(`[parser-success] id=${requestId} conversationId=${conversation.id} result=${JSON.stringify(parserResult).slice(0, 200)}`);
      } catch (exc) {
        console.error(`[parser-failed] id=${requestId}`, exc);
        parserResult = { error: exc.message };
      }
    } else {
      console.log(`[parser-skipped] id=${requestId} conversationId=${conversation.id} reasons: parserUrl=${!!parserUrl} onboardingDone=${onboardingDone} alreadySent=${!!cache.parserSentAt}`);
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

    console.log(`[request-complete] id=${requestId} conversationId=${conversation.id} parserCalled=${!!parserResult && !parserResult.skipped}`);
    return res.json({ 
      conversationId: conversation.id, 
      reply, 
      conversation_complete: true, 
      parser_result: parserResult 
    });
  } catch (err) {
    console.error(`[request-error] id=${requestId}`, err);
    return res.status(500).json({ error: err?.message || 'Unexpected server error' });
  }
});

export default router;
