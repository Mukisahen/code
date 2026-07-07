import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Users,
  Store,
  ShieldCheck,
  CreditCard,
  LifeBuoy,
  ScrollText,
  Activity,
  LayoutGrid,
  Sparkles,
  Check,
  X,
  Ban,
  CheckCircle2,
} from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/common/Card'
import { StatTile } from '@/components/common/StatTile'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import { BarChart } from '@/components/charts/BarChart'
import { AdminAskAiChat } from '@/components/dashboard/AdminAskAiChat'
import { ROUTES } from '@/constants/routes'
import * as adminService from '@/services/adminService'
import type { AdminOverview, AdminListing } from '@/services/adminService'
import type { AdminUserRow, VerificationRequest, AuditLogEntry, SupportTicket, SystemHealthMetric, SubscriptionRow } from '@/types/admin'
import { formatUGX, formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'

type Tab =
  | 'overview'
  | 'users'
  | 'marketplace'
  | 'verification'
  | 'subscriptions'
  | 'support'
  | 'audit-logs'
  | 'system-health'
  | 'ai-assistant'

const TABS: { key: Tab; label: string; icon: typeof Users }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'marketplace', label: 'Marketplace', icon: Store },
  { key: 'verification', label: 'Verification', icon: ShieldCheck },
  { key: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { key: 'support', label: 'Support', icon: LifeBuoy },
  { key: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
  { key: 'system-health', label: 'System Health', icon: Activity },
  { key: 'ai-assistant', label: 'AI Assistant', icon: Sparkles },
]

const STATUS_TONE = { active: 'success', pending: 'warning', suspended: 'error' } as const
const HEALTH_TONE = { operational: 'success', degraded: 'warning', down: 'error' } as const
const PRIORITY_TONE = { low: 'neutral', medium: 'warning', high: 'error' } as const
const TICKET_STATUS_TONE = { open: 'error', 'in-progress': 'warning', resolved: 'success' } as const

export default function AdminDashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const isSuperAdmin = !!currentUser?.isSuperAdmin
  const [tab, setTab] = useState<Tab>('overview')

  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [listings, setListings] = useState<AdminListing[]>([])
  const [verifications, setVerifications] = useState<VerificationRequest[]>([])
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hash = location.hash.replace('#', '') as Tab
    if (TABS.some((t) => t.key === hash)) setTab(hash)
  }, [location.hash])

  useEffect(() => {
    setLoading(true)
    const loaders: Record<Tab, () => Promise<void>> = {
      overview: () => adminService.getOverview().then(setOverview),
      users: () => adminService.listUsers().then(setUsers),
      marketplace: () => adminService.listListings().then(setListings),
      verification: () => adminService.listVerifications().then(setVerifications),
      subscriptions: () => adminService.listSubscriptions().then(setSubscriptions),
      support: () => adminService.listTickets().then(setTickets),
      'audit-logs': () => adminService.listAuditLogs().then(setAuditLogs),
      'system-health': () => adminService.getSystemHealth().then(setSystemHealth),
      'ai-assistant': () => Promise.resolve(),
    }
    loaders[tab]().finally(() => setLoading(false))
  }, [tab])

  function selectTab(next: Tab) {
    setTab(next)
    navigate(`${ROUTES.adminDashboard}${next === 'overview' ? '' : `#${next}`}`, { replace: true })
  }

  async function toggleUserStatus(id: string, current: AdminUserRow['status']) {
    const nextStatus = current === 'suspended' ? 'active' : 'suspended'
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)))
    await adminService.updateUserStatus(id, nextStatus)
  }

  async function promoteToAdmin(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: 'admin' } : u)))
    await adminService.promoteToAdmin(id)
  }

  async function revokeAdmin(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: 'farmer' } : u)))
    await adminService.revokeAdmin(id)
  }

  async function decideVerification(id: string, status: 'approved' | 'rejected') {
    setVerifications((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)))
    await adminService.decideVerification(id, status)
  }

  return (
    <DashboardLayout title="Administrator Dashboard" subtitle="Oversee the entire Farm Bhade ecosystem">
      <div role="tablist" className="mb-5 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => selectTab(key)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
              tab === key ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant',
            )}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>

      {loading && tab !== 'ai-assistant' ? (
        <InlineSpinner label="Loading…" />
      ) : (
        <>
          {tab === 'overview' && overview && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatTile icon={Users} label="Total users" value={overview.totalUsers.toLocaleString()} tone="primary" />
                <StatTile icon={Store} label="Active listings" value={String(overview.activeListings)} tone="secondary" />
                <StatTile icon={ShieldCheck} label="Pending verifications" value={String(overview.pendingVerifications)} tone="tertiary" />
                <StatTile icon={LifeBuoy} label="Open support tickets" value={String(overview.openTickets)} tone="primary" />
              </div>

              <Card>
                <SectionHeader title="Users by role" />
                <BarChart data={overview.usersByRole.map((u) => ({ label: u.role, value: u.count }))} />
              </Card>

              <Card>
                <SectionHeader title="Recent audit activity" seeAllHref={`${ROUTES.adminDashboard}#audit-logs`} />
                {overview.recentAuditLogs.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">No audit activity yet.</p>
                ) : (
                  <div className="divide-y divide-outline-variant/60">
                    {overview.recentAuditLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-2.5 text-sm first:pt-0 last:pb-0">
                        <div>
                          <p className="font-semibold text-on-surface">{log.action}</p>
                          <p className="text-xs text-on-surface-variant">{log.actor} &middot; {log.target}</p>
                        </div>
                        <span className="text-xs text-on-surface-variant">{formatRelativeTime(log.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {tab === 'users' && (
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-left text-xs font-semibold text-on-surface-variant">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-outline-variant/40 last:border-0">
                      <td className="px-4 py-3 font-medium text-on-surface">
                        {u.fullName}
                        {u.isSuperAdmin && (
                          <Badge tone="primary" className="ml-2">
                            Supreme Admin
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 capitalize text-on-surface-variant">{u.role}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{u.district}</td>
                      <td className="px-4 py-3">
                        <Badge tone={STATUS_TONE[u.status]}>{u.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {isSuperAdmin && u.role !== 'admin' && (
                            <Button size="sm" variant="outlined" onClick={() => promoteToAdmin(u.id)}>
                              Make admin
                            </Button>
                          )}
                          {isSuperAdmin && u.role === 'admin' && !u.isSuperAdmin && (
                            <Button size="sm" variant="outlined" onClick={() => revokeAdmin(u.id)}>
                              Revoke admin
                            </Button>
                          )}
                          {(!u.isSuperAdmin || isSuperAdmin) && (
                            <Button
                              size="sm"
                              variant={u.status === 'suspended' ? 'tonal' : 'outlined'}
                              onClick={() => toggleUserStatus(u.id, u.status)}
                            >
                              {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {tab === 'marketplace' && (
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-left text-xs font-semibold text-on-surface-variant">
                    <th className="px-4 py-3">Listing</th>
                    <th className="px-4 py-3">Seller</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((p) => (
                    <tr key={p.id} className="border-b border-outline-variant/40 last:border-0">
                      <td className="px-4 py-3 font-medium text-on-surface">{p.title}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{p.sellerName}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{p.district}</td>
                      <td className="px-4 py-3 text-right font-semibold text-on-surface">
                        UGX {p.pricePerUnit.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {tab === 'verification' && (
            <div className="space-y-3">
              {verifications.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No verification requests.</p>
              ) : (
                verifications.map((v) => (
                  <Card key={v.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-on-surface">{v.applicantName}</p>
                      <p className="text-sm text-on-surface-variant">
                        {v.role} &middot; {v.district} &middot; {v.documentType} &middot; {formatRelativeTime(v.submittedAt)}
                      </p>
                    </div>
                    {v.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button size="sm" leadingIcon={<Check className="size-4" />} onClick={() => decideVerification(v.id, 'approved')}>
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" leadingIcon={<X className="size-4" />} onClick={() => decideVerification(v.id, 'rejected')}>
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Badge tone={v.status === 'approved' ? 'success' : 'error'}>{v.status}</Badge>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}

          {tab === 'subscriptions' && (
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-left text-xs font-semibold text-on-surface-variant">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Tier</th>
                    <th className="px-4 py-3">Renews</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((s) => (
                    <tr key={s.id} className="border-b border-outline-variant/40 last:border-0">
                      <td className="px-4 py-3 font-medium text-on-surface">{s.userName}</td>
                      <td className="px-4 py-3">
                        <Badge tone={s.tier === 'premium' ? 'secondary' : 'neutral'}>{s.tier}</Badge>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">{s.renewsAt}</td>
                      <td className="px-4 py-3 text-right font-semibold text-on-surface">
                        {s.amount > 0 ? formatUGX(s.amount) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {tab === 'support' && (
            <div className="space-y-3">
              {tickets.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No support tickets.</p>
              ) : (
                tickets.map((t) => (
                  <Card key={t.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-on-surface">{t.subject}</p>
                      <p className="text-sm text-on-surface-variant">
                        {t.requester} &middot; {formatRelativeTime(t.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority} priority</Badge>
                      <Badge tone={TICKET_STATUS_TONE[t.status]}>{t.status}</Badge>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {tab === 'audit-logs' && (
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-left text-xs font-semibold text-on-surface-variant">
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3 text-right">When</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-outline-variant/40 last:border-0">
                      <td className="px-4 py-3 font-medium text-on-surface">{log.actor}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{log.action}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{log.target}</td>
                      <td className="px-4 py-3 text-right text-xs text-on-surface-variant">{formatRelativeTime(log.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {tab === 'ai-assistant' && <AdminAskAiChat />}

          {tab === 'system-health' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {systemHealth.map((metric) => (
                <Card key={metric.label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-full',
                      metric.status === 'operational' && 'bg-primary-container text-on-primary-container',
                      metric.status === 'degraded' && 'bg-secondary-container text-on-secondary-container',
                      metric.status === 'down' && 'bg-error-container text-on-error-container',
                    )}
                  >
                    {metric.status === 'operational' ? <CheckCircle2 className="size-5" /> : <Ban className="size-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-on-surface">{metric.label}</p>
                    <p className="text-sm text-on-surface-variant">{metric.value}</p>
                  </div>
                  <Badge tone={HEALTH_TONE[metric.status]}>{metric.status}</Badge>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
