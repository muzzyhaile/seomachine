import OpenAI from 'openai'

if (!process.env.OPENROUTER_API_KEY) {
  console.warn('[llm] OPENROUTER_API_KEY is not set — LLM calls will fail.')
}

export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    'X-Title': 'SEO Machine',
  },
})

export const DEFAULT_MODEL =
  process.env.OPENROUTER_MODEL ?? 'anthropic/claude-3.5-haiku'

export async function chat(
  systemPrompt: string,
  userPrompt: string,
  model = DEFAULT_MODEL
): Promise<string> {
  const response = await openrouter.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  })
  return response.choices[0]?.message?.content ?? ''
}
