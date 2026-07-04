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
  participantRole: 'farmer' | 'buyer' | 'processor'
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  productContext?: string
}
