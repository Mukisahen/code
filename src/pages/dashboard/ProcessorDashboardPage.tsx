import { Link } from 'react-router-dom'
import { Store, FileBarChart, PieChart, Factory, Package, Truck } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { StatTile } from '@/components/common/StatTile'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Badge } from '@/components/common/Badge'
import { BarChart } from '@/components/charts/BarChart'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { MOCK_ORDERS, MOCK_BUYER_REQUESTS } from '@/mocks/orders'
import { formatUGX } from '@/utils/format'
import { cn } from '@/utils/cn'

const QUICK_ACTIONS = [
  { label: 'Marketplace', href: ROUTES.marketplace, icon: Store, tone: 'primary' as const },
  { label: 'Post Bulk Request', href: ROUTES.buyerRequests, icon: Package, tone: 'secondary' as const },
  { label: 'Reports', href: ROUTES.reports, icon: FileBarChart, tone: 'tertiary' as const },
  { label: 'Analytics', href: ROUTES.analytics, icon: PieChart, tone: 'primary' as const },
]

const actionTone = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
}

const SUPPLY_BY_CATEGORY = [
  { label: 'Dry Grain', value: 18200 },
  { label: 'Wet Maize', value: 9400 },
  { label: 'Seed Maize', value: 2100 },
  { label: 'Dry Cobs', value: 4300 },
]

export default function ProcessorDashboardPage() {
  const { user } = useAuth()
  const requests = MOCK_BUYER_REQUESTS.slice(0, 3)
  const orders = MOCK_ORDERS.slice(0, 3)
  const totalSourced = SUPPLY_BY_CATEGORY.reduce((sum, s) => sum + s.value, 0)

  return (
    <DashboardLayout title="Processor Dashboard" subtitle={`Welcome back, ${user?.fullName}`}>
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ label, href, icon: Icon, tone }) => (
          <Link
            key={label}
            to={href}
            className="flex flex-col items-center gap-2 rounded-lg bg-surface p-3 text-center shadow-elevation-1 transition-transform hover:-translate-y-0.5"
          >
            <span className={cn('flex size-11 items-center justify-center rounded-full', actionTone[tone])}>
              <Icon className="size-5" />
            </span>
            <span className="text-xs font-semibold text-on-surface">{label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile icon={Factory} label="Kg sourced (month)" value={`${totalSourced.toLocaleString()} kg`} trend={8.4} tone="primary" />
        <StatTile icon={Truck} label="Active orders" value={String(orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length)} tone="secondary" />
        <StatTile icon={Package} label="Open bulk requests" value={String(requests.length)} tone="tertiary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeader title="Supply sourced by category (kg)" seeAllHref={ROUTES.reports} />
          <BarChart data={SUPPLY_BY_CATEGORY} valueFormatter={(v) => `${v.toLocaleString()} kg`} />
        </Card>

        <Card className="lg:col-span-1">
          <SectionHeader title="My bulk requests" seeAllHref={ROUTES.buyerRequests} />
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-on-surface">{req.category}</p>
                  <p className="text-xs text-on-surface-variant">{req.quantityNeeded}</p>
                </div>
                <Badge tone={req.status === 'open' ? 'success' : 'warning'}>{req.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <SectionHeader title="Recent orders" seeAllHref={ROUTES.orderHistory} />
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {orders.map((order) => (
              <div key={order.id} className="min-w-[220px] shrink-0 rounded-lg border border-outline-variant/60 p-3">
                <p className="truncate text-sm font-semibold text-on-surface">{order.productTitle}</p>
                <p className="text-xs text-on-surface-variant">{order.counterpartyName}</p>
                <p className="mt-2 text-sm font-semibold text-on-surface">{formatUGX(order.totalAmount)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
