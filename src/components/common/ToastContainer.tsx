import { Link } from 'react-router-dom'
import { X, ShoppingCart, TrendingUp, CloudSun, Stethoscope, MessageCircle, Bell } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import type { NotificationType } from '@/types/notification'

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  order: ShoppingCart,
  price: TrendingUp,
  weather: CloudSun,
  'crop-doctor': Stethoscope,
  message: MessageCircle,
  system: Bell,
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 top-4 z-50 flex flex-col gap-2 safe-top sm:inset-x-auto sm:right-4 sm:w-96"
    >
      {toasts.map((t) => {
        const Icon = TYPE_ICON[t.type]
        return (
          <div
            key={t.id}
            className="flex animate-toast-in items-start gap-3 rounded-lg bg-surface-container-high px-4 py-3 shadow-elevation-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
              <Icon className="size-4.5" />
            </span>
            <Link to={t.href ?? '#'} className="min-w-0 flex-1" onClick={() => dismissToast(t.id)}>
              <p className="text-sm font-semibold text-on-surface">{t.title}</p>
              <p className="truncate text-xs text-on-surface-variant">{t.description}</p>
            </Link>
            <button
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="shrink-0 text-on-surface-variant hover:text-on-surface"
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
