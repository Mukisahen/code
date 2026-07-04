import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ComingSoon } from '@/components/common/ComingSoon'

export default function BuyerDashboardPage() {
  return (
    <DashboardLayout roleLabel="Buyer">
      <ComingSoon label="Buyer Dashboard" />
    </DashboardLayout>
  )
}
