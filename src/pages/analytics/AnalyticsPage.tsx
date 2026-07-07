import { useEffect, useMemo, useState } from 'react'
import { ShoppingCart, Wallet, Users } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { SectionHeader } from '@/components/common/SectionHeader'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import { Sparkline } from '@/components/charts/Sparkline'
import { BarChart } from '@/components/charts/BarChart'
import * as marketplaceService from '@/services/marketplaceService'
import * as adminService from '@/services/adminService'
import type { AdminAnalytics } from '@/services/adminService'
import { useAuth } from '@/hooks/useAuth'
import { formatUGX } from '@/utils/format'
import type { Order } from '@/types/order'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function PersonalAnalytics({ isBuyer }: { isBuyer: boolean }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([marketplaceService.getMyOrders(), marketplaceService.getSellingOrders()])
      .then(([asBuyer, asSeller]) => setOrders([...asBuyer, ...asSeller]))
      .finally(() => setLoading(false))
  }, [])

  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  const byCategory = useMemo(() => {
    const totals = new Map<string, number>()
    for (const o of orders) totals.set(o.category, (totals.get(o.category) ?? 0) + o.totalAmount)
    return [...totals.entries()].map(([label, value]) => ({ label, value }))
  }, [orders])

  const byMonth = useMemo(() => {
    const totals = new Map<string, number>()
    for (const o of orders) {
      const label = MONTH_LABELS[new Date(o.createdAt).getMonth()]
      totals.set(label, (totals.get(label) ?? 0) + o.totalAmount)
    }
    return [...totals.entries()].map(([label, value]) => ({ label, value }))
  }, [orders])

  if (loading) return <InlineSpinner label="Loading your analytics…" />

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
            <Wallet className="size-4 text-primary" /> {isBuyer ? 'Total spend' : 'Total revenue'}
          </p>
          <p className="mt-1 text-2xl font-bold text-on-surface">{formatUGX(totalAmount)}</p>
          {byMonth.length > 1 && <Sparkline data={byMonth.map((m) => m.value)} height={64} />}
        </Card>
        <Card>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
            <ShoppingCart className="size-4 text-secondary" /> Total orders
          </p>
          <p className="mt-1 text-2xl font-bold text-on-surface">{orders.length}</p>
        </Card>
      </div>

      {byCategory.length > 0 && (
        <Card className="mt-6">
          <SectionHeader title={isBuyer ? 'Spend by category' : 'Sales by category'} />
          <BarChart data={byCategory} valueFormatter={(v) => formatUGX(v)} color="var(--color-primary)" />
        </Card>
      )}

      {byMonth.length > 0 && (
        <Card className="mt-6">
          <SectionHeader title={isBuyer ? 'Spend by month' : 'Revenue by month'} />
          <BarChart data={byMonth} valueFormatter={(v) => formatUGX(v)} color="var(--color-secondary)" />
        </Card>
      )}
    </>
  )
}

function PlatformAnalytics() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService
      .getAnalytics()
      .then(setAnalytics)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <InlineSpinner label="Loading platform analytics…" />
  if (!analytics) return null

  const users = analytics.platformGrowth.map((d) => d.users)
  const orders = analytics.platformGrowth.map((d) => d.orders)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
            <Users className="size-4 text-primary" /> New users
          </p>
          <p className="mt-1 text-2xl font-bold text-on-surface">{users.at(-1)?.toLocaleString() ?? 0}</p>
          {users.length > 1 && <Sparkline data={users} height={64} />}
        </Card>
        <Card>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
            <ShoppingCart className="size-4 text-secondary" /> Completed orders
          </p>
          <p className="mt-1 text-2xl font-bold text-on-surface">{orders.at(-1)?.toLocaleString() ?? 0}</p>
          {orders.length > 1 && <Sparkline data={orders} height={64} color="var(--color-secondary)" />}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Users by role" />
          <BarChart data={analytics.usersByRole.map((u) => ({ label: u.role, value: u.count }))} />
        </Card>
        <Card>
          <SectionHeader title="Users by district" />
          <BarChart
            data={analytics.usersByDistrict.map((d) => ({ label: d.district, value: d.count }))}
            color="var(--color-primary)"
          />
        </Card>
      </div>

      {analytics.revenueByMonth.length > 0 && (
        <Card className="mt-6">
          <SectionHeader title="Revenue by month" />
          <BarChart
            data={analytics.revenueByMonth.map((r) => ({ label: r.label, value: r.amount }))}
            valueFormatter={(v) => formatUGX(v)}
            color="var(--color-secondary)"
          />
        </Card>
      )}
    </>
  )
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const isPersonal = user?.role !== 'admin'

  return (
    <DashboardLayout
      title="Analytics"
      subtitle={isPersonal ? 'Your performance on Farm Bhade' : 'Platform growth and marketplace performance'}
    >
      {isPersonal ? <PersonalAnalytics isBuyer={user?.role === 'buyer'} /> : <PlatformAnalytics />}
    </DashboardLayout>
  )
}
