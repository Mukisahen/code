import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { ROUTES } from '@/constants/routes'
import { APP_TAGLINE, APP_BRAND_PROMISE } from '@/constants/app'
import farmerHero from '@/assets/images/farmer-hero-sm.jpg'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh bg-surface-variant/40 lg:grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={farmerHero}
          alt="A Ugandan maize farmer holding freshly harvested cobs in his field"
          className="sticky top-0 h-dvh w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(30,122,52,0.65) 0%, rgba(30,122,52,0.15) 40%, rgba(21,32,17,0.1) 65%, rgba(21,32,17,0.72) 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            {APP_BRAND_PROMISE}
          </p>
          <p className="mt-4 max-w-sm text-2xl font-bold leading-snug text-white">
            From Seed to Market — everything a maize farmer needs, in one place.
          </p>
        </div>
      </div>

      <div className="flex min-h-dvh flex-col">
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
    </div>
  )
}
