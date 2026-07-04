import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { ROUTES } from '@/constants/routes'
import { APP_TAGLINE } from '@/constants/app'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-variant/40">
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <Link to={ROUTES.welcome}>
          <Logo size="sm" />
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-md animate-slide-up rounded-xl bg-surface p-6 shadow-elevation-2 sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-on-surface">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-on-surface-variant">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>

      <footer className="px-5 pb-6 text-center text-xs text-on-surface-variant sm:px-8">
        {APP_TAGLINE} &middot; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
