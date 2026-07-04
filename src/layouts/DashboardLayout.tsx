import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'

interface DashboardLayoutProps {
  roleLabel: string
  children: ReactNode
}

export function DashboardLayout({ roleLabel, children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh bg-surface-variant/30">
      <header className="sticky top-0 z-20 border-b border-outline-variant/60 bg-background/90 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Logo size="sm" />
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container sm:inline-block">
              {roleLabel}
            </span>
            <ThemeToggle />
            <Button variant="text" size="sm" leadingIcon={<LogOut className="size-4" />} onClick={logout}>
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <p className="text-sm text-on-surface-variant">
          Welcome back, <span className="font-semibold text-on-surface">{user?.fullName}</span>
        </p>
        {children}
      </main>
    </div>
  )
}
