import 'dotenv/config';
import OpenAI from 'openai';
import { supabase } from '../lib/supabase.js';

const DEFAULT_THRESHOLD = parseFloat(process.env.ONBOARDING_JUDGE_THRESHOLD || '0.6');
const MODEL = process.env.ONBOARDING_JUDGE_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--conversation-id') out.conversationId = args[i + 1];
    if (args[i] === '--threshold') out.threshold = parseFloat(args[i + 1]);
  }
  return out;
}

async function loadConversation(conversationId) {
  const { data, error } = await supabase.from('conversations').select('*').eq('id', conversationId).single();
  if (error) throw error;
  return data;
}

async function loadMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('role,content,sequence')
    .eq('conversation_id', conversationId)
    .order('sequence', { ascending: true });
  if (error) throw error;
  return data || [];
}

function buildTranscript(messages) {
  return messages
    .map((m) => {
      const label = m.role === 'assistant' ? 'Agent' : m.role === 'user' ? 'User' : m.role;
      return `${label}: ${m.content}`;
    })
    .join('\n');
}

async function judge({ conversationId, threshold }) {
  const convo = await loadConversation(conversationId);
  const messages = await loadMessages(conversationId);
  if (!messages.length) throw new Error('No messages found for conversation');

  const transcript = buildTranscript(messages.slice(-12));
  const summary = convo.summary || '';
  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
  const reply = lastAssistant ? lastAssistant.content : '';

  const rubric =
    'You are a QA judge for onboarding. Evaluate the assistant reply in context: 1) Use of prior context (no restarts/greetings, no re-asking provided info); 2) Clarity/correctness; 3) Completion of onboarding goals. Return JSON: {"pass": bool, "score": 0-1, "reason": string}. Fail if the assistant restarts, ignores context, or misses completion.';

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: rubric },
      {
        role: 'user',
        content: `Conversation transcript:\n${transcript}\n\nAssistant final reply:\n${reply}\n\nConversation summary:\n${summary}`,
      },
    ],
  });

  const content = response.choices?.[0]?.message?.content || '';
  let parsed = { pass: false, score: 0, reason: 'No JSON response' };
  try {
    const data = JSON.parse(content);
    parsed = {
      pass: Boolean(data.pass ?? data.passed),
      score: Number(data.score ?? 0),
      reason: data.reason || '',
    };
  } catch (_err) {
    parsed = { pass: false, score: 0, reason: 'Judge returned non-JSON' };
  }
  const verdict = parsed.pass && parsed.score >= threshold;
  return { conversationId, model: MODEL, threshold, ...parsed, verdict, raw: content };
}

async function main() {
  const { conversationId, threshold } = parseArgs();
  if (!conversationId) {
    console.error('Usage: node scripts/run_judge.js --conversation-id <id> [--threshold 0.6]');
    process.exit(1);
  }
  const t = Number.isFinite(threshold) ? threshold : DEFAULT_THRESHOLD;
  try {
    const result = await judge({ conversationId, threshold: t });
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Judge error', err?.message || err);
    process.exit(1);
  }
}

main();
