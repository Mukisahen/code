import { Link } from 'react-router-dom'
import { Warehouse } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { ProgressBar } from '@/components/common/ProgressBar'
import { MOCK_STORAGE_BATCHES } from '@/mocks/tasks'
import { ROUTES } from '@/constants/routes'
import type { StorageBatch } from '@/types/task'

const STATUS_TONE: Record<StorageBatch['status'], 'success' | 'warning' | 'error'> = {
  good: 'success',
  watch: 'warning',
  'at-risk': 'error',
}

const STATUS_LABEL: Record<StorageBatch['status'], string> = {
  good: 'Good condition',
  watch: 'Watch closely',
  'at-risk': 'At risk',
}

export default function StoragePage() {
  return (
    <DashboardLayout title="Storage" subtitle="Monitor grain quality while in storage">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_STORAGE_BATCHES.map((batch) => (
          <Card key={batch.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
                  <Warehouse className="size-4.5" />
                </span>
                <div>
                  <p className="font-semibold text-on-surface">{batch.name}</p>
                  <p className="text-xs text-on-surface-variant">{batch.facility}</p>
                </div>
              </div>
              <Badge tone={STATUS_TONE[batch.status]}>{STATUS_LABEL[batch.status]}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-on-surface-variant">Quantity</p>
                <p className="font-semibold text-on-surface">{batch.quantityBags} bags</p>
              </div>
              <div>
                <p className="text-on-surface-variant">Days stored</p>
                <p className="font-semibold text-on-surface">{batch.daysStored} days</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-on-surface-variant">
                <span>Moisture level</span>
                <span>{batch.moistureLevel}%</span>
              </div>
              <ProgressBar
                value={batch.moistureLevel}
                max={20}
                tone={batch.status === 'at-risk' ? 'error' : batch.status === 'watch' ? 'secondary' : 'primary'}
              />
            </div>

            <Link to={ROUTES.myListings} className="mt-4 block">
              <Button variant="outlined" size="sm" fullWidth>
                List for sale
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
