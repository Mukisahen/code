import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ComingSoon } from '@/components/common/ComingSoon'

export default function AdminDashboardPage() {
  return (
    <DashboardLayout roleLabel="Administrator">
      <ComingSoon label="Administrator Dashboard" />
    </DashboardLayout>
  )
}
