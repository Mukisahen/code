export interface ChatMessage {
  id: string
  conversationId: string
  senderId: 'me' | string
  text: string
  sentAt: string
}

export interface Conversation {
  id: string
  participantName: string
  participantInitials: string
  participantAvatarUrl?: string
  participantRole: 'farmer' | 'buyer' | 'processor' | 'admin'
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  productContext?: string
}
