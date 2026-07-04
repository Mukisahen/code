import { useEffect, useRef } from 'react'
import { useToast } from '@/hooks/useToast'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import type { NotificationType } from '@/types/notification'

const NOTIFICATION_POOL: { type: NotificationType; title: string; description: string }[] = [
  { type: 'order', title: 'New order request', description: 'A buyer wants to purchase 500kg of dry grain maize.' },
  { type: 'price', title: 'Price alert', description: 'Dry Grain Maize prices moved in your district today.' },
  { type: 'weather', title: 'Weather update', description: 'Light rain expected tomorrow — good conditions for planting.' },
  { type: 'message', title: 'New message', description: 'You have a new message waiting.' },
  { type: 'crop-doctor', title: 'AI Assistant tip', description: 'Scout for fall armyworm this week — risk is elevated.' },
]

const FIRST_DELAY_MS = 25000
const INTERVAL_MS = 45000

/** Simulates a live stream of incoming notifications via toasts, until a real backend can push them. */
export function useSimulatedNotifications() {
  const { pushToast } = useToast()
  const { isAuthenticated } = useAuth()
  const indexRef = useRef(0)

  useEffect(() => {
    if (!isAuthenticated) return

    function fireNext() {
      const item = NOTIFICATION_POOL[indexRef.current % NOTIFICATION_POOL.length]
      indexRef.current += 1
      pushToast({ ...item, href: ROUTES.notifications })
    }

    const timeout = setTimeout(fireNext, FIRST_DELAY_MS)
    const interval = setInterval(fireNext, INTERVAL_MS)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [isAuthenticated, pushToast])
}
