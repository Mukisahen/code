import Anthropic from '@anthropic-ai/sdk'
import { env } from '../env.js'
import { MAIZE_KNOWLEDGE_BASE } from './maizeKnowledge.js'

const MODEL = 'claude-opus-4-8'

let client: Anthropic | null | undefined

function getClient(): Anthropic | null {
  if (client !== undefined) return client
  client = env.anthropicApiKey ? new Anthropic({ apiKey: env.anthropicApiKey }) : null
  return client
}

export function isClaudeConfigured(): boolean {
  return getClient() !== null
}

const LANG_NAME: Record<'en' | 'lg', string> = { en: 'English', lg: 'Luganda' }

function systemPrompt(lang: 'en' | 'lg'): string {
  return `You are the Farm Bhade AI Assistant, a friendly and knowledgeable farming advisor for Ugandan maize farmers using the Farm Bhade app.

Reply in ${LANG_NAME[lang]}. Keep answers short and practical — 2 to 4 sentences, plain language, no markdown headers or bullet lists unless the farmer asks for a list. Assume the farmer may have low literacy and limited data, so be direct and avoid jargon.

Use the following grounding knowledge about Ugandan maize farming and the Farm Bhade app when relevant. If a question is unrelated to maize farming or the app, gently redirect to farming topics.

${MAIZE_KNOWLEDGE_BASE}`
}

/**
 * Returns a Claude-generated reply, or null if Claude isn't configured or the
 * call fails — callers should fall back to the local keyword-matched FAQ.
 * Never throws.
 */
export async function askClaude(message: string, lang: 'en' | 'lg'): Promise<string | null> {
  const anthropic = getClient()
  if (!anthropic) return null

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      system: systemPrompt(lang),
      messages: [{ role: 'user', content: message }],
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    if (response.stop_reason === 'refusal' || !textBlock || textBlock.type !== 'text') return null
    return textBlock.text.trim() || null
  } catch {
    return null
  }
}
