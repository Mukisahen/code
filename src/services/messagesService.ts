import { api } from '@/lib/apiClient'
import type { ChatMessage, Conversation } from '@/types/message'

export async function listConversations(): Promise<Conversation[]> {
  const { conversations } = await api.get<{ conversations: Conversation[] }>('/conversations')
  return conversations
}

export async function startDirectConversation(otherUserId: string, productContext?: string): Promise<string> {
  const { conversationId } = await api.post<{ conversationId: string }>('/conversations/direct', {
    otherUserId,
    productContext,
  })
  return conversationId
}

export interface CommunityFarmer {
  id: string
  name: string
  initials: string
  district: string
  online: boolean
}

export async function getCommunity(): Promise<{ conversationId: string; farmers: CommunityFarmer[] }> {
  return api.get<{ conversationId: string; unreadCount: number; farmers: CommunityFarmer[] }>('/conversations/community')
}

export async function getMessages(conversationId: string, since?: string): Promise<ChatMessage[]> {
  const query = since ? `?since=${encodeURIComponent(since)}` : ''
  const { messages } = await api.get<{ messages: ChatMessage[] }>(`/conversations/${conversationId}/messages${query}`)
  return messages
}

export async function sendMessage(conversationId: string, text: string): Promise<ChatMessage> {
  const { message } = await api.post<{ message: ChatMessage }>(`/conversations/${conversationId}/messages`, { text })
  return message
}
