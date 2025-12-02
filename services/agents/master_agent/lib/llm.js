import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function runChat(messages, model = DEFAULT_MODEL) {
  const res = await client.chat.completions.create({ model, messages, stream: true });
  const chunks = [];
  for await (const part of res) {
    const delta = part.choices?.[0]?.delta?.content;
    if (delta) chunks.push(delta);
  }
  return chunks.join('');
}
