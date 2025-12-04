import OpenAI from 'openai';
import { TOOL_DEFS } from './tools.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_TOOL_MODEL || 'gpt-4o-mini';

export async function planTools({ transcript, metadata, agentSlug, hasAgent }) {
  const messages = [
    {
      role: 'system',
      content:
        'You are a tool selector. You may call at most one tool: pick_agent or end_conversation. Only call a tool if clearly needed; otherwise return none.',
    },
    { role: 'user', content: JSON.stringify({ transcript, metadata, agentSlug, hasAgent }) },
  ];
  const res = await client.chat.completions.create({
    model: MODEL,
    messages,
    tools: TOOL_DEFS.map((t) => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.schema,
      },
    })),
  });
  const choice = res.choices?.[0];
  const toolCall = choice?.message?.tool_calls?.[0];
  if (!toolCall) return null;
  let args = {};
  try {
    args = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {};
  } catch (_) {
    args = {};
  }
  return { name: toolCall.function.name, args };
}
