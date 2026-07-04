import type { User } from '@/types/user'

export const MOCK_USERS: User[] = [
  {
    id: 'usr-farmer-1',
    fullName: 'Nakato Grace',
    phone: '+256701234567',
    email: 'grace.nakato@example.com',
    role: 'farmer',
    district: 'Masindi',
    subscriptionTier: 'premium',
    verified: true,
    createdAt: '2025-02-14T08:00:00Z',
  },
  {
    id: 'usr-buyer-1',
    fullName: 'Okello Moses',
    phone: '+256772345678',
    email: 'moses.okello@example.com',
    role: 'buyer',
    district: 'Jinja',
    subscriptionTier: 'free',
    verified: true,
    createdAt: '2025-03-02T08:00:00Z',
  },
  {
    id: 'usr-processor-1',
    fullName: 'Kigongo Milling Co.',
    phone: '+256783456789',
    email: 'info@kigongomilling.co.ug',
    role: 'processor',
    district: 'Iganga',
    subscriptionTier: 'premium',
    verified: true,
    createdAt: '2024-11-20T08:00:00Z',
  },
  {
    id: 'usr-admin-1',
    fullName: 'Farm Bhade Admin',
    phone: '+256700000001',
    email: 'admin@farmbhade.ug',
    role: 'admin',
    district: 'Kampala',
    subscriptionTier: 'premium',
    verified: true,
    createdAt: '2024-09-01T08:00:00Z',
  },
]

/** Demo password shared by every mock account: `Password123` */
export const MOCK_PASSWORD = 'Password123'
