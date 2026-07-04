import { Link } from 'react-router-dom'
import {
  Sprout,
  Wheat,
  Warehouse,
  ShoppingCart,
  Factory,
  Stethoscope,
  TrendingUp,
  CloudSun,
  ArrowRight,
  ShieldCheck,
  Users,
  Store,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Card } from '@/components/common/Card'
import { ROUTES } from '@/constants/routes'
import { APP_TAGLINE, APP_BRAND_PROMISE } from '@/constants/app'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const JOURNEY = [
  { icon: Sprout, label: 'Planning', color: 'text-primary' },
  { icon: Wheat, label: 'Growing', color: 'text-secondary' },
  { icon: Wheat, label: 'Harvesting', color: 'text-tertiary' },
  { icon: Warehouse, label: 'Storage', color: 'text-info' },
  { icon: ShoppingCart, label: 'Selling', color: 'text-primary' },
  { icon: Factory, label: 'Processing', color: 'text-secondary' },
]

const FEATURES = [
  {
    icon: Stethoscope,
    title: 'AI Crop Doctor',
    description: 'Snap a photo of your maize and get instant diagnosis with treatment advice.',
  },
  {
    icon: TrendingUp,
    title: 'Live Market Prices',
    description: 'Track maize prices across Uganda so you always sell at the right price.',
  },
  {
    icon: CloudSun,
    title: 'Weather Forecasts',
    description: 'Localized forecasts help you plan planting, spraying and harvest days.',
  },
  {
    icon: Store,
    title: 'Trusted Marketplace',
    description: 'Connect directly with buyers and processors — no middlemen required.',
  },
]

const ROLES = [
  { icon: Sprout, title: 'Farmer', description: 'Manage your farm from seed to sale.' },
  { icon: ShoppingCart, title: 'Buyer', description: 'Source quality maize directly from farmers.' },
  { icon: Factory, title: 'Processor', description: 'Source bulk grain and manage supply.' },
  { icon: ShieldCheck, title: 'Administrator', description: 'Oversee the entire ecosystem.' },
]

export default function LandingPage() {
  const [, setHasSeenOnboarding] = useLocalStorage('farm-bhade-onboarding-seen', false)

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-20 border-b border-outline-variant/60 bg-background/85 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Logo size="sm" />
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link to={ROUTES.login} className="hidden sm:block">
              <Button variant="text" size="sm">
                Log in
              </Button>
            </Link>
            <Link to={ROUTES.onboarding} onClick={() => setHasSeenOnboarding(true)}>
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 pb-12 pt-10 text-center sm:px-8 sm:pb-16 sm:pt-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container px-3.5 py-1.5 text-xs font-semibold text-on-primary-container">
            <Sprout className="size-3.5" /> {APP_BRAND_PROMISE}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-6xl">
            The AI-powered digital home for Uganda&apos;s maize farmers
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-on-surface-variant sm:text-lg">
            {APP_TAGLINE} — plan, grow, harvest, store, sell and process your maize, all backed by AI
            guidance and a trusted marketplace.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to={ROUTES.onboarding} onClick={() => setHasSeenOnboarding(true)} className="w-full sm:w-auto">
              <Button size="lg" fullWidth trailingIcon={<ArrowRight className="size-5" />}>
                Get Started Free
              </Button>
            </Link>
            <Link to={ROUTES.login} className="w-full sm:w-auto">
              <Button variant="outlined" size="lg" fullWidth>
                I already have an account
              </Button>
            </Link>
          </div>
        </section>

        {/* Journey */}
        <section className="border-y border-outline-variant/60 bg-surface-container-low py-12">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="text-center text-sm font-bold uppercase tracking-wider text-primary">
              Your farming journey
            </h2>
            <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6 sm:gap-3">
              {JOURNEY.map(({ icon: Icon, label, color }, index) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <div className="relative flex size-14 items-center justify-center rounded-2xl bg-surface shadow-elevation-1">
                    <Icon className={`size-6 ${color}`} />
                    {index < JOURNEY.length - 1 && (
                      <span className="absolute left-full top-1/2 hidden h-px w-3 -translate-y-1/2 bg-outline-variant sm:block" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <h2 className="text-center text-2xl font-bold text-on-surface sm:text-3xl">
            Everything a maize farmer needs
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="flex flex-col gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                  <Icon className="size-5.5" />
                </span>
                <h3 className="font-bold text-on-surface">{title}</h3>
                <p className="text-sm text-on-surface-variant">{description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section className="bg-surface-container-low py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="text-center text-2xl font-bold text-on-surface sm:text-3xl">Built for every role</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {ROLES.map(({ icon: Icon, title, description }) => (
                <Card key={title} variant="outlined" className="items-center text-center">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-3 font-bold text-on-surface">{title}</h3>
                  <p className="mt-1 text-xs text-on-surface-variant">{description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8">
          <Users className="mx-auto size-9 text-primary" />
          <h2 className="mt-4 text-2xl font-bold text-on-surface sm:text-3xl">
            Join thousands of Ugandan maize farmers
          </h2>
          <p className="mt-3 text-on-surface-variant">
            From Kapchorwa to Masindi, farmers trust Farm Bhade to grow smarter and sell better.
          </p>
          <Link to={ROUTES.register} className="mt-6 inline-block">
            <Button size="lg" trailingIcon={<ArrowRight className="size-5" />}>
              Create Free Account
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-outline-variant/60 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo size="sm" />
          <p className="text-xs text-on-surface-variant">
            &copy; {new Date().getFullYear()} Farm Bhade. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
