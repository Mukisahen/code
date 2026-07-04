import type { NotificationType } from '@/types/notification'

export interface ToastItem {
  id: string
  type: NotificationType
  title: string
  description: string
  href?: string
}
