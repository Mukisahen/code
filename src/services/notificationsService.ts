import { api } from '@/lib/apiClient'
import type { Notification, NotificationType } from '@/types/notification'

function toClientType(type: string): NotificationType {
  return type === 'crop_doctor' ? 'crop-doctor' : (type as NotificationType)
}

export async function listNotifications(since?: string): Promise<Notification[]> {
  const query = since ? `?since=${encodeURIComponent(since)}` : ''
  const { notifications } = await api.get<{ notifications: Notification[] }>(`/notifications${query}`)
  return notifications.map((n) => ({ ...n, type: toClientType(n.type) }))
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`)
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post('/notifications/read-all')
}
