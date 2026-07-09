export type MessageAttachmentType = 'image' | 'file'

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: 'me' | string
  text: string
  sentAt: string
  attachmentUrl?: string
  attachmentType?: MessageAttachmentType
  attachmentName?: string
  attachmentSize?: number
}

export interface Conversation {
  id: string
  participantName: string
  participantInitials: string
  participantAvatarUrl?: string
  participantRole: 'farmer' | 'buyer' | 'processor' | 'admin'
  participantPhone?: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  productContext?: string
}
