import { api } from '@/lib/apiClient'
import type {
  AdminUserRow,
  VerificationRequest,
  AuditLogEntry,
  SupportTicket,
  SystemHealthMetric,
  SubscriptionRow,
} from '@/types/admin'

function toClientTicketStatus(status: string): SupportTicket['status'] {
  return status === 'in_progress' ? 'in-progress' : (status as SupportTicket['status'])
}

export interface AdminOverview {
  totalUsers: number
  activeListings: number
  pendingVerifications: number
  openTickets: number
  usersByRole: { role: string; count: number }[]
  recentAuditLogs: AuditLogEntry[]
}

export async function getOverview(): Promise<AdminOverview> {
  return api.get<AdminOverview>('/admin/overview')
}

export async function listUsers(): Promise<AdminUserRow[]> {
  const { users } = await api.get<{ users: AdminUserRow[] }>('/admin/users')
  return users
}

export async function updateUserStatus(id: string, status: AdminUserRow['status']): Promise<void> {
  await api.patch(`/admin/users/${id}/status`, { status })
}

export interface AdminListing {
  id: string
  title: string
  sellerName: string
  district: string
  pricePerUnit: number
  postedAt: string
}

export async function listListings(): Promise<AdminListing[]> {
  const { listings } = await api.get<{ listings: AdminListing[] }>('/admin/listings')
  return listings
}

export async function listVerifications(): Promise<VerificationRequest[]> {
  const { requests } = await api.get<{ requests: VerificationRequest[] }>('/admin/verifications')
  return requests
}

export async function decideVerification(id: string, status: 'approved' | 'rejected'): Promise<void> {
  await api.post(`/admin/verifications/${id}/decision`, { status })
}

export async function listTickets(): Promise<SupportTicket[]> {
  const { tickets } = await api.get<{ tickets: SupportTicket[] }>('/admin/tickets')
  return tickets.map((t) => ({ ...t, status: toClientTicketStatus(t.status) }))
}

export async function listAuditLogs(): Promise<AuditLogEntry[]> {
  const { logs } = await api.get<{ logs: AuditLogEntry[] }>('/admin/audit-logs')
  return logs
}

export async function listSubscriptions(): Promise<SubscriptionRow[]> {
  const { subscriptions } = await api.get<{ subscriptions: SubscriptionRow[] }>('/admin/subscriptions')
  return subscriptions
}

export async function getSystemHealth(): Promise<SystemHealthMetric[]> {
  const { metrics } = await api.get<{ metrics: SystemHealthMetric[] }>('/admin/system-health')
  return metrics
}

export interface AdminAnalytics {
  platformGrowth: { label: string; users: number; orders: number }[]
  usersByRole: { role: string; count: number }[]
  usersByDistrict: { district: string; count: number }[]
  revenueByMonth: { label: string; amount: number }[]
}

export async function getAnalytics(): Promise<AdminAnalytics> {
  return api.get<AdminAnalytics>('/admin/analytics')
}

export async function askAdminAssistant(message: string): Promise<string> {
  const { reply } = await api.post<{ reply: string }>('/admin/assistant', { message })
  return reply
}
