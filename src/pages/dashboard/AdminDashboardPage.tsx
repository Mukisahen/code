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
import { Card } from '@/components/common/Card'
import { StatTile } from '@/components/common/StatTile'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { BarChart } from '@/components/charts/BarChart'
import { AdminAskAiChat } from '@/components/dashboard/AdminAskAiChat'
import { ROUTES } from '@/constants/routes'
import { MOCK_ADMIN_USERS, MOCK_VERIFICATION_REQUESTS, MOCK_AUDIT_LOGS, MOCK_SUPPORT_TICKETS, MOCK_SYSTEM_HEALTH, MOCK_SUBSCRIPTIONS } from '@/mocks/admin'
import { MOCK_PRODUCTS } from '@/mocks/products'
import { USERS_BY_ROLE, PLATFORM_GROWTH } from '@/mocks/analytics'
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
  const [tab, setTab] = useState<Tab>('overview')
  const [users, setUsers] = useState(MOCK_ADMIN_USERS)
  const [verifications, setVerifications] = useState(MOCK_VERIFICATION_REQUESTS)

  useEffect(() => {
    const hash = location.hash.replace('#', '') as Tab
    if (TABS.some((t) => t.key === hash)) setTab(hash)
  }, [location.hash])

  function selectTab(next: Tab) {
    setTab(next)
    navigate(`${ROUTES.adminDashboard}${next === 'overview' ? '' : `#${next}`}`, { replace: true })
  }

  function toggleUserStatus(id: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u)),
    )
  }

  function decideVerification(id: string, status: 'approved' | 'rejected') {
    setVerifications((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)))
  }

  return (
    <DashboardLayout title="Administrator Dashboard" subtitle="Oversee the entire Farm Bhade ecosystem">
      <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
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

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile icon={Users} label="Total users" value={PLATFORM_GROWTH.at(-1)!.users.toLocaleString()} trend={13.5} tone="primary" />
            <StatTile icon={Store} label="Active listings" value={MOCK_PRODUCTS.length.toString().padStart(2, '0') + '+'} tone="secondary" />
            <StatTile icon={ShieldCheck} label="Pending verifications" value={String(verifications.filter((v) => v.status === 'pending').length)} tone="tertiary" />
            <StatTile icon={LifeBuoy} label="Open support tickets" value={String(MOCK_SUPPORT_TICKETS.filter((t) => t.status !== 'resolved').length)} tone="primary" />
          </div>

          <Card>
            <SectionHeader title="Users by role" />
            <BarChart data={USERS_BY_ROLE.map((u) => ({ label: u.role, value: u.count }))} />
          </Card>

          <Card>
            <SectionHeader title="Recent audit activity" seeAllHref={`${ROUTES.adminDashboard}#audit-logs`} />
            <div className="divide-y divide-outline-variant/60">
              {MOCK_AUDIT_LOGS.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2.5 text-sm first:pt-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-on-surface">{log.action}</p>
                    <p className="text-xs text-on-surface-variant">{log.actor} &middot; {log.target}</p>
                  </div>
                  <span className="text-xs text-on-surface-variant">{formatRelativeTime(log.timestamp)}</span>
                </div>
              ))}
            </div>
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
                  <td className="px-4 py-3 font-medium text-on-surface">{u.fullName}</td>
                  <td className="px-4 py-3 capitalize text-on-surface-variant">{u.role}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{u.district}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[u.status]}>{u.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant={u.status === 'suspended' ? 'tonal' : 'outlined'}
                      onClick={() => toggleUserStatus(u.id)}
                    >
                      {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                    </Button>
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
              {MOCK_PRODUCTS.map((p) => (
                <tr key={p.id} className="border-b border-outline-variant/40 last:border-0">
                  <td className="px-4 py-3 font-medium text-on-surface">{p.title}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{p.seller.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{p.district}</td>
                  <td className="px-4 py-3 text-right font-semibold text-on-surface">
                    UGX {p.pricePerUnit.toLocaleString()}/{p.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'verification' && (
        <div className="space-y-3">
          {verifications.map((v) => (
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
          ))}
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
              {MOCK_SUBSCRIPTIONS.map((s) => (
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
          {MOCK_SUPPORT_TICKETS.map((t) => (
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
          ))}
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
              {MOCK_AUDIT_LOGS.map((log) => (
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
          {MOCK_SYSTEM_HEALTH.map((metric) => (
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
    </DashboardLayout>
  )
}
