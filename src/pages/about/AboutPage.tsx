import { Link } from 'react-router-dom'
import { Compass, Users2, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Card } from '@/components/common/Card'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { dashboardRouteForRole } from '@/utils/roleRoutes'

const PROMISES = [
  {
    icon: Compass,
    title: 'Guide',
    description:
      'AI Crop Doctor, weather forecasts and stage-by-stage advice walk every farmer through planning, growing, harvesting, storage, selling and processing — so no one is guessing alone.',
  },
  {
    icon: Users2,
    title: 'Connect',
    description:
      'A trusted marketplace and direct chat put farmers, buyers and processors in the same room, cutting out middlemen and building relationships that last past one sale.',
  },
  {
    icon: TrendingUp,
    title: 'Grow',
    description:
      'Live market prices, sales history and analytics turn each harvest into a lesson, helping farmers sell smarter and grow their income season after season.',
  },
]

export default function AboutPage() {
  const { user } = useAuth()
  const backLink = user ? dashboardRouteForRole(user.role) : ROUTES.welcome

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-20 border-b border-outline-variant/60 bg-background/85 backdrop-blur-md safe-top">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to={backLink}>
              <Button variant="text" size="sm" leadingIcon={<ArrowLeft className="size-4" />}>
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <span className="rounded-full bg-primary-container px-3.5 py-1.5 text-xs font-semibold text-on-primary-container">
          About Farm Bhade
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
          Uganda's maize farmers deserve better tools than a paper notebook and a middleman.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-on-surface-variant sm:text-lg">
          Farm Bhade exists because too many maize farmers make life-changing decisions — what to plant, when to
          harvest, who to sell to — with too little information and too little leverage. We built a single app
          that puts AI guidance, real market data and a trusted marketplace directly in a farmer's hands, in the
          same place they already manage their farm.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="flex flex-col gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                <Icon className="size-5.5" />
              </span>
              <h2 className="font-bold text-on-surface">{title}</h2>
              <p className="text-sm text-on-surface-variant">{description}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <h2 className="font-bold text-on-surface">Why maize, why now</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Maize is Uganda's most widely grown staple and a livelihood for millions of smallholder farming
            households, yet post-harvest losses, price volatility and information gaps still cost farmers dearly
            every season. Farm Bhade is our answer: an AI-powered, mobile-first platform designed for the realities
            of Ugandan farming — low connectivity, shared phones and a need for advice in plain language, not
            jargon.
          </p>
        </Card>

        <Card className="mt-4">
          <h2 className="font-bold text-on-surface">Built responsibly</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Every account is password-protected, every listing is tied to a verifiable seller, and our admin team
            reviews verification requests and support tickets to keep the marketplace trustworthy as it grows. This
            is a pilot — we're actively improving offline support, local-language coverage and payment options
            based on real farmer feedback.
          </p>
        </Card>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-on-surface-variant">Ready to see it for yourself?</p>
          <Link to={`${ROUTES.login}?demo=1`}>
            <Button size="lg" trailingIcon={<ArrowRight className="size-5" />}>
              Try the instant demo
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-outline-variant/60 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo size="sm" />
          <p className="text-xs text-on-surface-variant">
            &copy; {new Date().getFullYear()} Farm Bhade. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
