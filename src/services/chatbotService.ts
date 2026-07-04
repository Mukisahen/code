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

export async function askAssistant(input: string, lang: ChatLang): Promise<string> {
  let bestScore = 0
  let bestAnswer: string | null = null

  for (const entry of CHATBOT_FAQ) {
    const score = scoreEntry(input, entry.keywords)
    if (score > bestScore) {
      bestScore = score
      bestAnswer = entry.answer[lang]
    }
  }

  return delay(bestAnswer ?? FALLBACK_RESPONSE[lang])
}
