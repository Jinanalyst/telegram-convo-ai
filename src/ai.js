import { OPENAI_API_KEY } from './config.js';
import OpenAI from 'openai';

let client;

if (OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: OPENAI_API_KEY });
}

export async function chatWithAI(prompt, userId) {
  if (!client) return 'AI key not configured.';
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are Convoai, a helpful conversational AI.' },
        { role: 'user', content: prompt },
      ],
      user: String(userId),
      max_tokens: 120,
    });
    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error('OpenAI error:', err);
    return 'Sorry, AI service is unavailable right now.';
  }
} 