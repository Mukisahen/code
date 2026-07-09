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

export interface CommunityMember {
  id: string
  name: string
  role: 'farmer' | 'buyer' | 'processor'
  initials: string
  avatarUrl?: string
  district: string
  online: boolean
}

export async function getCommunity(): Promise<{ conversationId: string; members: CommunityMember[] }> {
  return api.get<{ conversationId: string; unreadCount: number; members: CommunityMember[] }>('/conversations/community')
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

// Node's memory-buffered upload path caps this well below the requested
// 500MB — see server/src/middleware/chatUpload.ts for why.
export const CHAT_MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024

export async function sendAttachment(conversationId: string, file: File, caption?: string): Promise<ChatMessage> {
  const formData = new FormData()
  formData.append('file', file)
  if (caption) formData.append('caption', caption)
  const { message } = await api.post<{ message: ChatMessage }>(`/conversations/${conversationId}/attachments`, formData)
  return message
}
