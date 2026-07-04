export type NotificationType = 'order' | 'price' | 'weather' | 'crop-doctor' | 'system' | 'message'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  createdAt: string
  read: boolean
}
