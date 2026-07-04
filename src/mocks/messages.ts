import type { ChatMessage, Conversation } from '@/types/message'

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantName: 'Kigongo Milling Co.',
    participantInitials: 'KM',
    participantRole: 'processor',
    lastMessage: 'Can you deliver 2 tonnes by Friday?',
    lastMessageAt: '2026-07-04T09:15:00Z',
    unreadCount: 2,
    productContext: 'Dry Grain Maize — Grade A',
  },
  {
    id: 'conv-2',
    participantName: 'Okello Moses',
    participantInitials: 'OM',
    participantRole: 'buyer',
    lastMessage: 'Great, I will send the truck tomorrow morning.',
    lastMessageAt: '2026-07-03T18:40:00Z',
    unreadCount: 0,
    productContext: 'Fresh Green Maize — Longe 10H',
  },
  {
    id: 'conv-3',
    participantName: 'Namuli Sarah',
    participantInitials: 'NS',
    participantRole: 'farmer',
    lastMessage: 'Yes, still available. 5,000kg in stock.',
    lastMessageAt: '2026-07-02T13:05:00Z',
    unreadCount: 0,
    productContext: 'Wet Maize — Bulk Supply',
  },
  {
    id: 'conv-4',
    participantName: 'Byaruhanga Peter',
    participantInitials: 'BP',
    participantRole: 'farmer',
    lastMessage: 'Thanks for the order! Seeds are being packed.',
    lastMessageAt: '2026-06-29T10:00:00Z',
    unreadCount: 1,
    productContext: 'Certified Seed Maize — Longe 7H',
  },
]

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm-1', conversationId: 'conv-1', senderId: 'them', text: 'Hello! Is the Grade A dry grain still available?', sentAt: '2026-07-04T08:50:00Z' },
  { id: 'm-2', conversationId: 'conv-1', senderId: 'me', text: 'Yes, we have 8,000kg in stock right now.', sentAt: '2026-07-04T08:55:00Z' },
  { id: 'm-3', conversationId: 'conv-1', senderId: 'them', text: 'Can you do 1,400 UGX per kg for 2 tonnes?', sentAt: '2026-07-04T09:02:00Z' },
  { id: 'm-4', conversationId: 'conv-1', senderId: 'them', text: 'Can you deliver 2 tonnes by Friday?', sentAt: '2026-07-04T09:15:00Z' },
  { id: 'm-5', conversationId: 'conv-2', senderId: 'them', text: 'Hi, I would like to buy 500 cobs of green maize.', sentAt: '2026-07-03T17:30:00Z' },
  { id: 'm-6', conversationId: 'conv-2', senderId: 'me', text: 'Sure, 800 UGX per cob. Pickup from Masindi.', sentAt: '2026-07-03T17:45:00Z' },
  { id: 'm-7', conversationId: 'conv-2', senderId: 'them', text: 'Great, I will send the truck tomorrow morning.', sentAt: '2026-07-03T18:40:00Z' },
]
