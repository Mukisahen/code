export type ChatLang = 'en' | 'lg'

export interface AssistantMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: string
}

export interface FaqEntry {
  id: string
  keywords: string[]
  question: Record<ChatLang, string>
  answer: Record<ChatLang, string>
}
