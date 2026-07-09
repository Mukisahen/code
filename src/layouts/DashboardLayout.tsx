import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Bell, MessageCircle, LifeBuoy } from 'lucide-react'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Button } from '@/components/common/Button'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import * as notificationsService from '@/services/notificationsService'

const UNREAD_POLL_MS = 20000

interface DashboardLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  actions?: ReactNode
}

export function DashboardLayout({ title, subtitle, children, actions }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    document.title = `${title} · Farm Bhade`
  }, [title])

  useEffect(() => {
    function refresh() {
      notificationsService
        .listNotifications()
        .then((notifications) => setUnreadCount(notifications.filter((n) => !n.read).length))
        .catch(() => {})
    }
    refresh()
    const interval = setInterval(refresh, UNREAD_POLL_MS)
    return () => clearInterval(interval)
  }, [])

  if (!user) return null

  return (
    <div className="min-h-dvh bg-surface-variant/30 lg:flex">
      <Sidebar role={user.role} />

      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-outline-variant/60 bg-background/90 backdrop-blur-md safe-top">
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-8">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-on-surface sm:text-xl">{title}</h1>
              {subtitle && <p className="truncate text-xs text-on-surface-variant sm:text-sm">{subtitle}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {actions}
              <Link
                to={ROUTES.help}
                className="hidden size-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container sm:inline-flex"
                aria-label="Help & support"
                title="Help & support"
              >
                <LifeBuoy className="size-5" />
              </Link>
              <Link
                to={ROUTES.messages}
                className="inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
                aria-label="Messages"
              >
                <MessageCircle className="size-5" />
              </Link>
              <Link
                to={ROUTES.notifications}
                className="relative inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-error" />
                )}
              </Link>
              <ThemeToggle />
              <div className="hidden sm:block">
                <Button variant="text" size="sm" leadingIcon={<LogOut className="size-4" />} onClick={logout}>
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-6 pb-24 sm:px-8 lg:pb-8">{children}</main>
      </div>

      <BottomNav role={user.role} />
    </div>
  )
}
