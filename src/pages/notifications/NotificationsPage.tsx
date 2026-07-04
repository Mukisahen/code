import { useState } from 'react'
import { ShoppingCart, TrendingUp, CloudSun, Stethoscope, MessageCircle, Bell, CheckCheck } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { MOCK_NOTIFICATIONS } from '@/mocks/notifications'
import type { NotificationType } from '@/types/notification'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  order: ShoppingCart,
  price: TrendingUp,
  weather: CloudSun,
  'crop-doctor': Stethoscope,
  message: MessageCircle,
  system: Bell,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Stay updated on orders, prices, weather and more"
      actions={
        <Button variant="text" size="sm" leadingIcon={<CheckCheck className="size-4" />} onClick={markAllRead}>
          <span className="hidden sm:inline">Mark all read</span>
        </Button>
      }
    >
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => {
            const Icon = TYPE_ICON[n.type]
            return (
              <Card
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn('flex cursor-pointer items-start gap-3', !n.read && 'bg-primary-container/30')}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-on-surface">{n.title}</p>
                    {!n.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-on-surface-variant">{n.description}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">{formatRelativeTime(n.createdAt)}</p>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
