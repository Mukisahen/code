import { FileBarChart, Download, Wheat, DollarSign, Package } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { StatTile } from '@/components/common/StatTile'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Button } from '@/components/common/Button'
import { BarChart } from '@/components/charts/BarChart'
import { MOCK_ORDERS } from '@/mocks/orders'
import { formatUGX } from '@/utils/format'

const ORDERS_BY_MONTH = [
  { label: 'Apr', value: 12 },
  { label: 'May', value: 18 },
  { label: 'Jun', value: 24 },
  { label: 'Jul', value: 15 },
]

const REPORTS = [
  { id: 'rep-1', title: 'Monthly Sales Report', period: 'June 2026', icon: DollarSign },
  { id: 'rep-2', title: 'Quality & Grading Report', period: 'Q2 2026', icon: Wheat },
  { id: 'rep-3', title: 'Inventory & Storage Report', period: 'June 2026', icon: Package },
]

export default function ReportsPage() {
  const totalRevenue = MOCK_ORDERS.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <DashboardLayout title="Reports" subtitle="Download summaries of your activity on Farm Bhade">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile icon={DollarSign} label="Total revenue" value={formatUGX(totalRevenue)} trend={12.3} tone="primary" />
        <StatTile icon={Package} label="Orders completed" value={String(MOCK_ORDERS.filter((o) => o.status === 'completed').length)} tone="secondary" />
        <StatTile icon={FileBarChart} label="Reports available" value={String(REPORTS.length)} tone="tertiary" />
      </div>

      <Card className="mt-6">
        <SectionHeader title="Orders by month" />
        <BarChart data={ORDERS_BY_MONTH} valueFormatter={(v) => `${v} orders`} />
      </Card>

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
