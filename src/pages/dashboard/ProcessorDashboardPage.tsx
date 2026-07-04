import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ComingSoon } from '@/components/common/ComingSoon'

export default function ProcessorDashboardPage() {
  return (
    <DashboardLayout roleLabel="Processor">
      <ComingSoon label="Processor Dashboard" />
    </DashboardLayout>
  )
}
