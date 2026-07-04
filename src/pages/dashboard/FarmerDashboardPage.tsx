import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ComingSoon } from '@/components/common/ComingSoon'

export default function FarmerDashboardPage() {
  return (
    <DashboardLayout roleLabel="Farmer">
      <ComingSoon label="Farmer Dashboard" />
    </DashboardLayout>
  )
}
