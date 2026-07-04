import type { Notification } from '@/types/notification'

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'New order request',
    description: 'Kigongo Milling Co. wants to buy 2,000kg of dry grain maize.',
    createdAt: '2026-07-04T09:15:00Z',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'price',
    title: 'Price alert: Dry Grain Maize',
    description: 'Prices in Kapchorwa rose 6% this week — now UGX 1,450/kg.',
    createdAt: '2026-07-04T07:00:00Z',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'weather',
    title: 'Rain expected tomorrow',
    description: 'Light rain forecast for Masindi. Good time for planting.',
    createdAt: '2026-07-03T19:30:00Z',
    read: true,
  },
  {
    id: 'notif-4',
    type: 'crop-doctor',
    title: 'Diagnosis ready',
    description: 'Your maize leaf photo shows early signs of Northern Corn Leaf Blight.',
    createdAt: '2026-07-03T14:10:00Z',
    read: true,
  },
  {
    id: 'notif-5',
    type: 'message',
    title: 'New message from Okello Moses',
    description: '"Great, I will send the truck tomorrow morning."',
    createdAt: '2026-07-03T18:40:00Z',
    read: true,
  },
  {
    id: 'notif-6',
    type: 'system',
    title: 'Account verified',
    description: 'Your Farm Bhade account has been verified. You can now sell on the marketplace.',
    createdAt: '2026-06-20T10:00:00Z',
    read: true,
  },
]
