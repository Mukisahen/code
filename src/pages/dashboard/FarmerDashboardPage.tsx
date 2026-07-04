import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Stethoscope,
  Store,
  CloudSun,
  CheckCircle2,
  Circle,
  Sprout,
  PlusCircle,
  Sun,
  CloudRain,
  Cloud,
  CloudDrizzle,
} from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { SectionHeader } from '@/components/common/SectionHeader'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { MOCK_WEATHER } from '@/mocks/weather'
import { MOCK_TODAY_TASKS } from '@/mocks/tasks'
import { MOCK_MARKET_PRICES } from '@/mocks/marketPrices'
import { MOCK_NOTIFICATIONS } from '@/mocks/notifications'
import { MOCK_DIAGNOSIS_HISTORY } from '@/mocks/diagnoses'
import { JOURNEY_STAGE_LABELS, JOURNEY_STAGES } from '@/constants/app'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'

const WEATHER_ICONS = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  storm: CloudRain,
  'partly-cloudy': CloudDrizzle,
}

const QUICK_ACTIONS = [
  { label: 'AI Crop Doctor', href: ROUTES.aiCropDoctor, icon: Stethoscope, tone: 'primary' as const },
  { label: 'Marketplace', href: ROUTES.marketplace, icon: Store, tone: 'secondary' as const },
  { label: 'Add Listing', href: ROUTES.myListings, icon: PlusCircle, tone: 'tertiary' as const },
  { label: 'Weather', href: ROUTES.weather, icon: CloudSun, tone: 'primary' as const },
]

const actionTone = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
}

export default function FarmerDashboardPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState(MOCK_TODAY_TASKS)
  const WeatherIcon = WEATHER_ICONS[MOCK_WEATHER.condition]
  const currentStage = JOURNEY_STAGES[1]
  const latestDiagnosis = MOCK_DIAGNOSIS_HISTORY[0]
  const topPrices = MOCK_MARKET_PRICES.slice(0, 4)
  const recentNotifications = MOCK_NOTIFICATIONS.slice(0, 3)

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  return (
    <DashboardLayout title="Farmer Dashboard" subtitle={`Welcome back, ${user?.fullName}`}>
      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ label, href, icon: Icon, tone }) => (
          <Link
            key={label}
            to={href}
            className="flex flex-col items-center gap-2 rounded-lg bg-surface p-3 text-center shadow-elevation-1 transition-transform hover:-translate-y-0.5"
          >
            <span className={cn('flex size-11 items-center justify-center rounded-full', actionTone[tone])}>
              <Icon className="size-5" />
            </span>
            <span className="text-xs font-semibold text-on-surface">{label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Weather */}
        <Card className="lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface-variant">{MOCK_WEATHER.district}</p>
              <p className="mt-1 text-3xl font-bold text-on-surface">{MOCK_WEATHER.temperatureC}&deg;C</p>
            </div>
            <WeatherIcon className="size-10 text-info" />
          </div>
          <p className="mt-3 text-sm text-on-surface-variant">{MOCK_WEATHER.advisory}</p>
          <Link
            to={ROUTES.weather}
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            View 7-day forecast
          </Link>
        </Card>

        {/* Current stage */}
        <Card className="lg:col-span-2">
          <SectionHeader title="Current farming stage" />
          <div className="flex flex-wrap items-center gap-2">
            {JOURNEY_STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-bold',
                    stage === currentStage
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-variant text-on-surface-variant',
                  )}
                >
                  {JOURNEY_STAGE_LABELS[stage]}
                </span>
                {i < JOURNEY_STAGES.length - 1 && <span className="h-px w-4 bg-outline-variant" />}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-on-surface-variant">
            You&apos;re in the <span className="font-semibold text-on-surface">Growing</span> stage. Plot A is at
            vegetative growth (V6) — keep scouting for pests weekly.
          </p>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Today's tasks */}
        <Card className="lg:col-span-1">
          <SectionHeader title="Today's tasks" />
          <ul className="space-y-2.5">
            {tasks.map((task) => (
              <li key={task.id}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex w-full items-start gap-2.5 text-left"
                >
                  {task.done ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="mt-0.5 size-5 shrink-0 text-on-surface-variant" />
                  )}
                  <span className={cn('text-sm', task.done ? 'text-on-surface-variant line-through' : 'text-on-surface')}>
                    {task.title}
                    <span className="ml-1.5 text-xs text-on-surface-variant">&middot; {task.dueLabel}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Market prices */}
        <Card className="lg:col-span-1">
          <SectionHeader title="Market prices" seeAllHref={ROUTES.marketPrices} />
          <ul className="space-y-3">
            {topPrices.map((price) => (
              <li key={price.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-on-surface">{price.category}</p>
                  <p className="text-xs text-on-surface-variant">{price.district}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-on-surface">UGX {price.pricePerKg.toLocaleString()}/kg</p>
                  <p className={cn('text-xs font-semibold', price.changePercent >= 0 ? 'text-primary' : 'text-error')}>
                    {price.changePercent >= 0 ? '+' : ''}
                    {price.changePercent}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* AI crop status */}
        <Card className="lg:col-span-1">
          <SectionHeader title="AI Crop Doctor" seeAllHref={ROUTES.aiCropDoctor} />
          <div className="flex items-center gap-3">
            <span
              className="flex size-14 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: latestDiagnosis.imageColor + '33' }}
            >
              <Sprout className="size-6" style={{ color: latestDiagnosis.imageColor }} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-on-surface">{latestDiagnosis.condition}</p>
              <p className="text-xs text-on-surface-variant">{formatRelativeTime(latestDiagnosis.createdAt)}</p>
              <Badge
                tone={
                  latestDiagnosis.severity === 'healthy'
                    ? 'success'
                    : latestDiagnosis.severity === 'severe'
                      ? 'error'
                      : 'warning'
                }
                className="mt-1.5"
              >
                {latestDiagnosis.severity}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Notifications preview */}
      <div className="mt-6">
        <Card>
          <SectionHeader title="Recent notifications" seeAllHref={ROUTES.notifications} />
          <ul className="divide-y divide-outline-variant/60">
            {recentNotifications.map((n) => (
              <li key={n.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                <div className={cn('min-w-0', n.read && 'pl-5')}>
                  <p className="truncate text-sm font-semibold text-on-surface">{n.title}</p>
                  <p className="truncate text-xs text-on-surface-variant">{n.description}</p>
                </div>
                <span className="ml-auto shrink-0 text-xs text-on-surface-variant">
                  {formatRelativeTime(n.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}
