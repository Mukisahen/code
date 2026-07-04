import { Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { ProgressBar } from '@/components/common/ProgressBar'
import { Button } from '@/components/common/Button'
import { MOCK_GROWING_LOG } from '@/mocks/tasks'
import { ROUTES } from '@/constants/routes'

function healthTone(score: number): 'primary' | 'secondary' | 'error' {
  if (score >= 85) return 'primary'
  if (score >= 70) return 'secondary'
  return 'error'
}

export default function GrowingPage() {
  return (
    <DashboardLayout title="Growing" subtitle="Track crop health week by week">
      <Card className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-on-surface">Noticed something unusual on a leaf?</p>
          <p className="text-sm text-on-surface-variant">Get an instant AI diagnosis with treatment advice.</p>
        </div>
        <Link to={ROUTES.aiCropDoctor}>
          <Button leadingIcon={<Stethoscope className="size-4" />}>Open AI Crop Doctor</Button>
        </Link>
      </Card>

      <div className="space-y-3">
        {MOCK_GROWING_LOG.map((log) => (
          <Card key={log.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-on-surface">{log.week}</p>
                <p className="text-xs text-on-surface-variant">{log.stage}</p>
              </div>
              <span className="text-lg font-bold text-on-surface">{log.healthScore}</span>
            </div>
            <ProgressBar value={log.healthScore} tone={healthTone(log.healthScore)} className="mt-3" />
            <p className="mt-2.5 text-sm text-on-surface-variant">{log.note}</p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
