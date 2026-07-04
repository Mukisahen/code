import type { UserRole } from '@/types/user'

export interface AdminUserRow {
  id: string
  fullName: string
  role: UserRole
  district: string
  status: 'active' | 'suspended' | 'pending'
  joinedAt: string
}

export interface VerificationRequest {
  id: string
  applicantName: string
  role: UserRole
  district: string
  documentType: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target: string
  timestamp: string
}

export interface SupportTicket {
  id: string
  subject: string
  requester: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
}

export interface SystemHealthMetric {
  label: string
  value: string
  status: 'operational' | 'degraded' | 'down'
}

export interface SubscriptionRow {
  id: string
  userName: string
  tier: 'free' | 'premium'
  renewsAt: string
  amount: number
}
