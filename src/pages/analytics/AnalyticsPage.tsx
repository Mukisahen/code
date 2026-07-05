import { Users, ShoppingCart, Wallet } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Sparkline } from '@/components/charts/Sparkline'
import { BarChart } from '@/components/charts/BarChart'
import { PLATFORM_GROWTH, USERS_BY_ROLE, USERS_BY_DISTRICT, REVENUE_BY_MONTH } from '@/mocks/analytics'
import { MOCK_ORDERS } from '@/mocks/orders'
import { useAuth } from '@/hooks/useAuth'
import { formatUGX } from '@/utils/format'

function PersonalAnalytics({ isBuyer }: { isBuyer: boolean }) {
  const totalAmount = MOCK_ORDERS.reduce((sum, o) => sum + o.totalAmount, 0)
  const byCategory = Object.values(
    MOCK_ORDERS.reduce<Record<string, number>>((acc, o) => {
      acc[o.category] = (acc[o.category] ?? 0) + o.totalAmount
      return acc
    }, {})
  )
  const categoryLabels = [...new Set(MOCK_ORDERS.map((o) => o.category))]
  const monthAmounts = REVENUE_BY_MONTH.map((r) => Math.round(r.amount * 0.15))

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
            <Wallet className="size-4 text-primary" /> {isBuyer ? 'Total spend' : 'Total revenue'}
          </p>
          <p className="mt-1 text-2xl font-bold text-on-surface">{formatUGX(totalAmount)}</p>
          <Sparkline data={monthAmounts} height={64} />
        </Card>
        <Card>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
            <ShoppingCart className="size-4 text-secondary" /> Orders this month
          </p>
          <p className="mt-1 text-2xl font-bold text-on-surface">{MOCK_ORDERS.length}</p>
          <Sparkline data={PLATFORM_GROWTH.map((d) => d.orders)} height={64} color="var(--color-secondary)" />
        </Card>
      </div>

      <Card className="mt-6">
        <SectionHeader title={isBuyer ? 'Spend by category' : 'Sales by category'} />
        <BarChart
          data={categoryLabels.map((label, i) => ({ label, value: byCategory[i] ?? 0 }))}
          valueFormatter={(v) => formatUGX(v)}
          color="var(--color-primary)"
        />
      </Card>

      <Card className="mt-6">
        <SectionHeader title={isBuyer ? 'Spend by month' : 'Revenue by month'} />
        <BarChart
          data={REVENUE_BY_MONTH.map((r, i) => ({ label: r.label, value: monthAmounts[i] }))}
          valueFormatter={(v) => formatUGX(v)}
          color="var(--color-secondary)"
        />
      </Card>
    </>
  )
}

function PlatformAnalytics() {
  const users = PLATFORM_GROWTH.map((d) => d.users)
  const orders = PLATFORM_GROWTH.map((d) => d.orders)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
            <Users className="size-4 text-primary" /> Total users
          </p>
          <p className="mt-1 text-2xl font-bold text-on-surface">{users.at(-1)?.toLocaleString()}</p>
          <Sparkline data={users} height={64} />
        </Card>
        <Card>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
            <ShoppingCart className="size-4 text-secondary" /> Orders this month
          </p>
          <p className="mt-1 text-2xl font-bold text-on-surface">{orders.at(-1)?.toLocaleString()}</p>
          <Sparkline data={orders} height={64} color="var(--color-secondary)" />
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Users by role" />
          <BarChart data={USERS_BY_ROLE.map((u) => ({ label: u.role, value: u.count }))} />
        </Card>
        <Card>
          <SectionHeader title="Users by district" />
          <BarChart
            data={USERS_BY_DISTRICT.map((d) => ({ label: d.district, value: d.count }))}
            color="var(--color-primary)"
          />
        </Card>
      </div>

      <Card className="mt-6">
        <SectionHeader title="Revenue by month" />
        <BarChart
          data={REVENUE_BY_MONTH.map((r) => ({ label: r.label, value: r.amount }))}
          valueFormatter={(v) => formatUGX(v)}
          color="var(--color-secondary)"
        />
      </Card>
    </>
  )
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const isPersonal = user?.role === 'farmer' || user?.role === 'buyer'

  return (
    <DashboardLayout
      title="Analytics"
      subtitle={isPersonal ? 'Your performance on Farm Bhade' : 'Platform growth and marketplace performance'}
    >
      {isPersonal ? <PersonalAnalytics isBuyer={user?.role === 'buyer'} /> : <PlatformAnalytics />}
    </DashboardLayout>
  )
}
