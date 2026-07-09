import type { JourneyStage } from '@/constants/app'

export type UserRole = 'farmer' | 'buyer' | 'processor' | 'admin'

export interface User {
  id: string
  fullName: string
  phone: string
  email?: string
  role: UserRole
  isSuperAdmin?: boolean
  district: string
  avatarUrl?: string
  journeyStage?: JourneyStage
  subscriptionTier: 'free' | 'premium'
  verified: boolean
  status?: 'active' | 'suspended' | 'pending'
  createdAt: string
}

export interface AuthCredentials {
  phone: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  phone: string
  password: string
  role: UserRole
  district: string
}
