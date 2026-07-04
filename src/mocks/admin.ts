import type {
  AdminUserRow,
  VerificationRequest,
  AuditLogEntry,
  SupportTicket,
  SystemHealthMetric,
  SubscriptionRow,
} from '@/types/admin'

export const MOCK_ADMIN_USERS: AdminUserRow[] = [
  { id: 'u-1', fullName: 'Nakato Grace', role: 'farmer', district: 'Masindi', status: 'active', joinedAt: '2025-02-14' },
  { id: 'u-2', fullName: 'Okello Moses', role: 'buyer', district: 'Jinja', status: 'active', joinedAt: '2025-03-02' },
  { id: 'u-3', fullName: 'Kigongo Milling Co.', role: 'processor', district: 'Iganga', status: 'active', joinedAt: '2024-11-20' },
  { id: 'u-4', fullName: 'Byaruhanga Peter', role: 'farmer', district: 'Kapchorwa', status: 'active', joinedAt: '2024-05-02' },
  { id: 'u-5', fullName: 'Opio Daniel', role: 'farmer', district: 'Lira', status: 'pending', joinedAt: '2025-02-14' },
  { id: 'u-6', fullName: 'Aine Patricia', role: 'buyer', district: 'Mbale', status: 'suspended', joinedAt: '2024-09-10' },
  { id: 'u-7', fullName: 'Namuli Sarah', role: 'farmer', district: 'Iganga', status: 'active', joinedAt: '2023-08-19' },
]

export const MOCK_VERIFICATION_REQUESTS: VerificationRequest[] = [
  { id: 'ver-1', applicantName: 'Opio Daniel', role: 'farmer', district: 'Lira', documentType: 'National ID', submittedAt: '2026-07-02T09:00:00Z', status: 'pending' },
  { id: 'ver-2', applicantName: 'Nabirye Milling Ltd.', role: 'processor', district: 'Bugiri', documentType: 'Business License', submittedAt: '2026-07-01T13:00:00Z', status: 'pending' },
  { id: 'ver-3', applicantName: 'Tumwine Ivan', role: 'buyer', district: 'Kabarole', documentType: 'National ID', submittedAt: '2026-06-29T10:30:00Z', status: 'approved' },
]

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'log-1', actor: 'admin@farmbhade.ug', action: 'Approved verification', target: 'Tumwine Ivan', timestamp: '2026-06-29T10:35:00Z' },
  { id: 'log-2', actor: 'admin@farmbhade.ug', action: 'Suspended account', target: 'Aine Patricia', timestamp: '2026-06-27T15:10:00Z' },
  { id: 'log-3', actor: 'system', action: 'Flagged listing for review', target: 'Prod #1023 — Dry Grain Maize', timestamp: '2026-06-26T08:00:00Z' },
  { id: 'log-4', actor: 'admin@farmbhade.ug', action: 'Resolved support ticket', target: 'Ticket #245', timestamp: '2026-06-25T12:00:00Z' },
]

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  { id: 'tic-1', subject: 'Cannot upload crop photo', requester: 'Namuli Sarah', priority: 'medium', status: 'open', createdAt: '2026-07-03T09:00:00Z' },
  { id: 'tic-2', subject: 'Payment not reflecting after sale', requester: 'Byaruhanga Peter', priority: 'high', status: 'in-progress', createdAt: '2026-07-02T16:00:00Z' },
  { id: 'tic-3', subject: 'Request to change district', requester: 'Okello Moses', priority: 'low', status: 'resolved', createdAt: '2026-06-28T11:00:00Z' },
]

export const MOCK_SYSTEM_HEALTH: SystemHealthMetric[] = [
  { label: 'API', value: '99.98% uptime', status: 'operational' },
  { label: 'Marketplace search', value: '210ms avg response', status: 'operational' },
  { label: 'AI Crop Doctor', value: 'Elevated latency', status: 'degraded' },
  { label: 'Notifications (SMS)', value: '99.9% delivered', status: 'operational' },
  { label: 'Payments gateway', value: 'Operational', status: 'operational' },
]

export const MOCK_SUBSCRIPTIONS: SubscriptionRow[] = [
  { id: 'sub-1', userName: 'Nakato Grace', tier: 'premium', renewsAt: '2026-08-14', amount: 15000 },
  { id: 'sub-2', userName: 'Kigongo Milling Co.', tier: 'premium', renewsAt: '2026-07-20', amount: 45000 },
  { id: 'sub-3', userName: 'Okello Moses', tier: 'free', renewsAt: '-', amount: 0 },
  { id: 'sub-4', userName: 'Byaruhanga Peter', tier: 'free', renewsAt: '-', amount: 0 },
]
