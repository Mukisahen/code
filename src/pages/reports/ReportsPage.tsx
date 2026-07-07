import { useEffect, useMemo, useState } from 'react'
import { FileBarChart, Download, Wheat, DollarSign, Package, ShoppingBag } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { StatTile } from '@/components/common/StatTile'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Button } from '@/components/common/Button'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import { BarChart } from '@/components/charts/BarChart'
import * as marketplaceService from '@/services/marketplaceService'
import { useAuth } from '@/hooks/useAuth'
import { formatUGX } from '@/utils/format'
import type { Order } from '@/types/order'
import type { UserRole } from '@/types/user'

const REPORTS_BY_ROLE: Record<UserRole, { id: string; title: string; period: string; icon: typeof DollarSign }[]> = {
  farmer: [
    { id: 'rep-1', title: 'Monthly Sales Report', period: 'June 2026', icon: DollarSign },
    { id: 'rep-2', title: 'Harvest & Yield Report', period: 'Q2 2026', icon: Wheat },
    { id: 'rep-3', title: 'Storage & Quality Report', period: 'June 2026', icon: Package },
  ],
  buyer: [
    { id: 'rep-1', title: 'Monthly Purchases Report', period: 'June 2026', icon: ShoppingBag },
    { id: 'rep-2', title: 'Spend Summary', period: 'Q2 2026', icon: DollarSign },
    { id: 'rep-3', title: 'Supplier Performance Report', period: 'June 2026', icon: Wheat },
  ],
  processor: [
    { id: 'rep-1', title: 'Monthly Sales Report', period: 'June 2026', icon: DollarSign },
    { id: 'rep-2', title: 'Quality & Grading Report', period: 'Q2 2026', icon: Wheat },
    { id: 'rep-3', title: 'Inventory & Storage Report', period: 'June 2026', icon: Package },
  ],
  admin: [
    { id: 'rep-1', title: 'Platform Revenue Report', period: 'June 2026', icon: DollarSign },
    { id: 'rep-2', title: 'Quality & Grading Report', period: 'Q2 2026', icon: Wheat },
    { id: 'rep-3', title: 'Inventory & Storage Report', period: 'June 2026', icon: Package },
  ],
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function ReportsPage() {
  const { user } = useAuth()
  const role = user?.role ?? 'farmer'
  const isBuyer = role === 'buyer'
  const REPORTS = REPORTS_BY_ROLE[role]
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([marketplaceService.getMyOrders(), marketplaceService.getSellingOrders()])
      .then(([asBuyer, asSeller]) => setOrders([...asBuyer, ...asSeller]))
      .finally(() => setLoading(false))
  }, [])

  const completed = orders.filter((o) => o.status === 'completed')
  const totalAmount = completed.reduce((sum, o) => sum + o.totalAmount, 0)

  const ordersByMonth = useMemo(() => {
    const counts = new Map<string, number>()
    for (const o of orders) {
      const key = new Date(o.createdAt).getMonth()
      counts.set(MONTH_LABELS[key], (counts.get(MONTH_LABELS[key]) ?? 0) + 1)
    }
    return [...counts.entries()].map(([label, value]) => ({ label, value }))
  }, [orders])

  if (loading) {
    return (
      <DashboardLayout title="Reports" subtitle="Download summaries of your activity on Farm Bhade">
        <InlineSpinner label="Loading reports…" />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Reports"
      subtitle={isBuyer ? 'Download summaries of your purchases on Farm Bhade' : 'Download summaries of your activity on Farm Bhade'}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          icon={DollarSign}
          label={isBuyer ? 'Total spend' : 'Total revenue'}
          value={formatUGX(totalAmount)}
          tone="primary"
        />
        <StatTile icon={Package} label="Orders completed" value={String(completed.length)} tone="secondary" />
        <StatTile icon={FileBarChart} label="Reports available" value={String(REPORTS.length)} tone="tertiary" />
      </div>

      {ordersByMonth.length > 0 && (
        <Card className="mt-6">
          <SectionHeader title="Orders by month" />
          <BarChart data={ordersByMonth} valueFormatter={(v) => `${v} orders`} />
        </Card>
      )}

      <div className="mt-6 space-y-3">
        {REPORTS.map((report) => (
          <Card key={report.id} className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
              <report.icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-on-surface">{report.title}</p>
              <p className="text-xs text-on-surface-variant">{report.period}</p>
            </div>
            <Button variant="outlined" size="sm" leadingIcon={<Download className="size-4" />}>
              <span className="hidden sm:inline">Download</span>
            </Button>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
