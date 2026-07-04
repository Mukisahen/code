import { Users, ShoppingCart } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Sparkline } from '@/components/charts/Sparkline'
import { BarChart } from '@/components/charts/BarChart'
import { PLATFORM_GROWTH, USERS_BY_ROLE, USERS_BY_DISTRICT, REVENUE_BY_MONTH } from '@/mocks/analytics'
import { formatUGX } from '@/utils/format'

export default function AnalyticsPage() {
  const users = PLATFORM_GROWTH.map((d) => d.users)
  const orders = PLATFORM_GROWTH.map((d) => d.orders)

  return (
    <DashboardLayout title="Analytics" subtitle="Platform growth and marketplace performance">
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
    </DashboardLayout>
  )
}
