import { Wheat } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { MOCK_HARVEST_RECORDS } from '@/mocks/tasks'
import { formatDate } from '@/utils/format'

const GRADE_TONE = { A: 'success', B: 'warning', C: 'error' } as const

export default function HarvestingPage() {
  const totalBags = MOCK_HARVEST_RECORDS.reduce((sum, r) => sum + r.yieldBags, 0)

  return (
    <DashboardLayout title="Harvesting" subtitle="Yield history across past seasons">
      <Card className="mb-5 flex items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <Wheat className="size-6" />
        </span>
        <div>
          <p className="text-2xl font-bold text-on-surface">{totalBags} bags</p>
          <p className="text-sm text-on-surface-variant">Total yield across recorded seasons</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_HARVEST_RECORDS.map((record) => (
          <Card key={record.id}>
            <div className="flex items-start justify-between">
              <p className="font-semibold text-on-surface">{record.season}</p>
              <Badge tone={GRADE_TONE[record.qualityGrade]}>Grade {record.qualityGrade}</Badge>
            </div>
            <p className="mt-3 text-2xl font-bold text-on-surface">{record.yieldBags} bags</p>
            <div className="mt-3 space-y-1 text-sm text-on-surface-variant">
              <p>Moisture: {record.moistureLevel}%</p>
              <p>Harvested: {formatDate(record.harvestedAt)}</p>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
