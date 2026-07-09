import { api } from '@/lib/apiClient'
import { CHATBOT_FAQ, FALLBACK_RESPONSE } from '@/mocks/chatbotFaq'
import type { ChatLang } from '@/types/chatbot'

const RESPONSE_DELAY_MS = 700

function delay<T>(value: T, ms = RESPONSE_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function scoreEntry(input: string, keywords: string[]): number {
  const normalized = input.toLowerCase()
  return keywords.reduce((score, keyword) => (normalized.includes(keyword.toLowerCase()) ? score + 1 : score), 0)
}

function askLocalFaq(input: string, lang: ChatLang): string {
  let bestScore = 0
  let bestAnswer: string | null = null

  for (const entry of CHATBOT_FAQ) {
    const score = scoreEntry(input, entry.keywords)
    if (score > bestScore) {
      bestScore = score
      bestAnswer = entry.answer[lang]
    }
  }

  return bestAnswer ?? FALLBACK_RESPONSE[lang]
}

/**
 * Asks the Claude-powered backend assistant first. If the backend has no
 * ANTHROPIC_API_KEY configured (or the call fails), it returns `reply: null`
 * and we fall back to the local keyword-matched FAQ so the chatbot always
 * responds, even without an AI key configured.
 */
export async function askAssistant(input: string, lang: ChatLang): Promise<string> {
  try {
    const { reply } = await api.post<{ reply: string | null }>('/chatbot/ask', { message: input, lang })
    if (reply) return reply
  } catch {
    // network/server error — fall through to the local FAQ
  }

  return delay(askLocalFaq(input, lang))
}
