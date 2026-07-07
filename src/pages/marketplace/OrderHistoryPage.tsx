import { useEffect, useState } from 'react'
import { History } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { EmptyState } from '@/components/common/EmptyState'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import * as marketplaceService from '@/services/marketplaceService'
import type { Order, OrderStatus } from '@/types/order'
import { formatUGX, formatDate } from '@/utils/format'

const STATUS_TONE: Record<OrderStatus, 'neutral' | 'warning' | 'success' | 'error' | 'info'> = {
  pending: 'warning',
  confirmed: 'info',
  'in-transit': 'info',
  completed: 'success',
  cancelled: 'error',
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([marketplaceService.getMyOrders(), marketplaceService.getSellingOrders()])
      .then(([asBuyer, asSeller]) => {
        const merged = [...asBuyer, ...asSeller].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        setOrders(merged)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout title="Order History" subtitle="Track every order you've placed or received">
      {loading ? (
        <InlineSpinner label="Loading orders…" />
      ) : orders.length === 0 ? (
        <EmptyState icon={History} title="No orders yet" />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-on-surface">{order.productTitle}</p>
                <p className="text-sm text-on-surface-variant">
                  {order.counterpartyName} &middot; {order.quantity} &middot; {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <p className="font-semibold text-on-surface">{formatUGX(order.totalAmount)}</p>
                <Badge tone={STATUS_TONE[order.status]}>{order.status.replace('-', ' ')}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
