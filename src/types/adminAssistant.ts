export interface AdminAssistantMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: string
}

export interface AdminFaqEntry {
  id: string
  keywords: string[]
  question: string
  answer: string
}
