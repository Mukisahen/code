import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Stethoscope,
  Store,
  CloudSun,
  CheckCircle2,
  Circle,
  Lock,
  Sprout,
  PlusCircle,
  Sun,
  CloudRain,
  Cloud,
  CloudDrizzle,
  ArrowRight,
  HeartPulse,
  Lightbulb,
  TrendingUp,
} from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { SectionHeader } from '@/components/common/SectionHeader'
import { LiveBadge } from '@/components/common/LiveBadge'
import { PromoBanner } from '@/components/common/PromoBanner'
import { MarqueeTicker } from '@/components/common/MarqueeTicker'
import { ProgressBar } from '@/components/common/ProgressBar'
import { useAuth } from '@/hooks/useAuth'
import { useLivePrices } from '@/hooks/useLivePrices'
import { ROUTES } from '@/constants/routes'
import { MOCK_TODAY_TASKS } from '@/mocks/tasks'
import * as notificationsService from '@/services/notificationsService'
import * as cropDoctorService from '@/services/cropDoctorService'
import * as marketPricesService from '@/services/marketPricesService'
import * as weatherService from '@/services/weatherService'
import * as usersService from '@/services/usersService'
import { JOURNEY_STAGE_LABELS, JOURNEY_STAGE_DESCRIPTIONS, JOURNEY_STAGES } from '@/constants/app'
import type { Notification } from '@/types/notification'
import type { CropDiagnosis } from '@/types/cropDoctor'
import type { MarketPriceEntry } from '@/types/marketPrice'
import type { WeatherSnapshot } from '@/types/weather'
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

const SEVERITY_SCORE: Record<string, number> = { healthy: 100, low: 75, moderate: 50, severe: 20 }

function scoreLabel(score: number): { label: string; tone: 'primary' | 'secondary' | 'error' } {
  if (score >= 80) return { label: 'Excellent', tone: 'primary' }
  if (score >= 60) return { label: 'Good', tone: 'primary' }
  if (score >= 40) return { label: 'Fair', tone: 'secondary' }
  return { label: 'Needs attention', tone: 'error' }
}

export default function FarmerDashboardPage() {
  const { user, updateUser } = useAuth()
  const [tasks, setTasks] = useState(MOCK_TODAY_TASKS)
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null)
  const [weatherError, setWeatherError] = useState(false)
  const [advancingStage, setAdvancingStage] = useState(false)
  const currentStage = user?.journeyStage ?? 'planning'
  const currentStageIndex = JOURNEY_STAGES.indexOf(currentStage)
  const nextStage = JOURNEY_STAGES[currentStageIndex + 1]
  const [latestDiagnosis, setLatestDiagnosis] = useState<CropDiagnosis | null>(null)
  const [diagnosisHistory, setDiagnosisHistory] = useState<CropDiagnosis[]>([])
  const [basePrices, setBasePrices] = useState<MarketPriceEntry[]>([])
  const { prices: livePrices, lastUpdated } = useLivePrices(basePrices)
  const topPrices = livePrices.slice(0, 4)
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])

  useEffect(() => {
    notificationsService.listNotifications().then((result) => setRecentNotifications(result.slice(0, 3)))
    cropDoctorService.getDiagnosisHistory().then((result) => {
      setLatestDiagnosis(result[0] ?? null)
      setDiagnosisHistory(result)
    })
    marketPricesService.listMarketPrices().then(setBasePrices)
    weatherService
      .getWeather(user?.district ?? 'Masindi')
      .then(setWeather)
      .catch(() => setWeatherError(true))
  }, [user?.district])

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const recentDiagnoses = diagnosisHistory.filter((d) => d.severity).slice(0, 5)
  const diagnosisScore = recentDiagnoses.length
    ? Math.round(
        recentDiagnoses.reduce((sum, d) => sum + (SEVERITY_SCORE[d.severity!] ?? 50), 0) / recentDiagnoses.length,
      )
    : 60
  const taskScore = tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 100
  const journeyScore = Math.round((currentStageIndex / (JOURNEY_STAGES.length - 1)) * 100)
  const farmHealthScore = Math.round(diagnosisScore * 0.4 + taskScore * 0.3 + journeyScore * 0.3)
  const healthStatus = scoreLabel(farmHealthScore)

  const insights: { icon: typeof Lightbulb; tone: 'primary' | 'secondary' | 'error'; text: string }[] = []
  if (weather) {
    insights.push({
      icon: weather.condition === 'rainy' || weather.condition === 'storm' ? CloudRain : Sun,
      tone: weather.condition === 'storm' ? 'error' : 'primary',
      text: weather.advisory,
    })
  }
  const topMover = [...livePrices].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))[0]
  if (topMover) {
    const direction = topMover.changePercent >= 0 ? 'up' : 'down'
    insights.push({
      icon: TrendingUp,
      tone: topMover.changePercent >= 0 ? 'primary' : 'secondary',
      text: `${topMover.category} prices in ${topMover.district} are ${direction} ${Math.abs(topMover.changePercent)}% this week.`,
    })
  }
  if (latestDiagnosis?.isCropPhoto && latestDiagnosis.severity) {
    insights.push({
      icon: Stethoscope,
      tone: latestDiagnosis.severity === 'healthy' ? 'primary' : 'error',
      text:
        latestDiagnosis.severity === 'healthy'
          ? 'Your last AI Crop Doctor check came back healthy — keep up the good work.'
          : `Your last AI Crop Doctor check flagged ${latestDiagnosis.condition}. Review the treatment steps.`,
    })
  } else {
    insights.push({
      icon: Stethoscope,
      tone: 'secondary',
      text: "You haven't run an AI Crop Doctor check yet — snap a photo to catch problems early.",
    })
  }

  async function handleAdvanceStage() {
    if (!nextStage) return
    setAdvancingStage(true)
    try {
      const updated = await usersService.updateJourneyStage(nextStage)
      updateUser(updated)
    } finally {
      setAdvancingStage(false)
    }
  }

  return (
    <DashboardLayout title="Farmer Dashboard" subtitle={`Welcome back, ${user?.fullName}`}>
      <MarqueeTicker
        items={livePrices.map(
          (p) => `${p.category} · ${p.district}: UGX ${p.pricePerKg.toLocaleString()}/kg (${p.changePercent >= 0 ? '+' : ''}${p.changePercent}%)`,
        )}
        className="mb-4"
      />

      <PromoBanner />

      {/* Quick actions */}
      <div className="mt-4 grid grid-cols-4 gap-3">
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

      {/* Farm Health Score */}
      <Card className="mt-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
              <HeartPulse className="size-6" />
            </span>
            <div>
              <p className="text-3xl font-extrabold text-on-surface">{farmHealthScore}</p>
              <Badge tone={healthStatus.tone}>{healthStatus.label}</Badge>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-on-surface">Farm Health Score</p>
            <p className="text-xs text-on-surface-variant">
              A quick read on how your farm is doing, based on crop health, task follow-through and season
              progress.
            </p>
            <div className="mt-3 space-y-2.5">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Crop health (AI diagnoses)</span>
                  <span className="font-semibold text-on-surface">{diagnosisScore}</span>
                </div>
                <ProgressBar value={diagnosisScore} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Task follow-through</span>
                  <span className="font-semibold text-on-surface">{taskScore}</span>
                </div>
                <ProgressBar value={taskScore} tone="secondary" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Season progress</span>
                  <span className="font-semibold text-on-surface">{journeyScore}</span>
                </div>
                <ProgressBar value={journeyScore} tone="secondary" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Today's Insights */}
      <Card className="mt-6">
        <SectionHeader title="Today's insights" />
        <ul className="space-y-3">
          {insights.map((insight, i) => {
            const Icon = insight.icon
            const tone = {
              primary: 'bg-primary-container text-on-primary-container',
              secondary: 'bg-secondary-container text-on-secondary-container',
              error: 'bg-error-container text-on-error-container',
            }[insight.tone]
            return (
              <li key={i} className="flex items-start gap-3">
                <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', tone)}>
                  <Icon className="size-4" />
                </span>
                <p className="pt-1 text-sm text-on-surface-variant">{insight.text}</p>
              </li>
            )
          })}
        </ul>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Weather */}
        <Card className="lg:col-span-1">
          {weather ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-on-surface-variant">{weather.district}</p>
                  <p className="mt-1 text-3xl font-bold text-on-surface">{weather.temperatureC}&deg;C</p>
                </div>
                {(() => {
                  const WeatherIcon = WEATHER_ICONS[weather.condition]
                  return <WeatherIcon className="size-10 text-info" />
                })()}
              </div>
              <p className="mt-3 text-sm text-on-surface-variant">{weather.advisory}</p>
            </>
          ) : weatherError ? (
            <p className="text-sm text-on-surface-variant">Could not load weather right now.</p>
          ) : (
            <p className="text-sm text-on-surface-variant">Loading weather…</p>
          )}
          <Link
            to={ROUTES.weather}
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            View 7-day forecast
          </Link>
        </Card>

        {/* Current stage */}
        <Card className="lg:col-span-2">
          <SectionHeader title="Farm progress" />
          <div className="flex flex-wrap items-center gap-2">
            {JOURNEY_STAGES.map((stage, i) => {
              const isDone = i < currentStageIndex
              const isCurrent = i === currentStageIndex
              const isLocked = i > currentStageIndex
              return (
                <div key={stage} className="flex items-center gap-2">
                  <span
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold',
                      isCurrent && 'bg-primary text-on-primary',
                      isDone && 'bg-primary-container text-on-primary-container',
                      isLocked && 'bg-surface-variant text-on-surface-variant',
                    )}
                  >
                    {isDone && <CheckCircle2 className="size-3.5" />}
                    {isLocked && <Lock className="size-3" />}
                    {JOURNEY_STAGE_LABELS[stage]}
                  </span>
                  {i < JOURNEY_STAGES.length - 1 && <span className="h-px w-4 bg-outline-variant" />}
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-sm text-on-surface-variant">{JOURNEY_STAGE_DESCRIPTIONS[currentStage]}</p>
          {nextStage && (
            <Button
              size="sm"
              variant="tonal"
              loading={advancingStage}
              onClick={handleAdvanceStage}
              trailingIcon={<ArrowRight className="size-4" />}
              className="mt-3"
            >
              Move to {JOURNEY_STAGE_LABELS[nextStage]}
            </Button>
          )}
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
          <SectionHeader title="Market prices" seeAllHref={ROUTES.marketPrices} right={<LiveBadge lastUpdated={lastUpdated} />} />
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
          {!latestDiagnosis ? (
            <p className="text-sm text-on-surface-variant">
              No diagnoses yet. Photograph a maize leaf or cob to get started.
            </p>
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-container">
                {latestDiagnosis.isCropPhoto ? (
                  <img src={latestDiagnosis.imageUrl} alt="" className="size-full object-cover" />
                ) : (
                  <Sprout className="size-6 text-on-primary-container" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-on-surface">
                  {latestDiagnosis.isCropPhoto ? latestDiagnosis.condition : 'Not recognized as a crop photo'}
                </p>
                <p className="text-xs text-on-surface-variant">{formatRelativeTime(latestDiagnosis.createdAt)}</p>
                {latestDiagnosis.severity && (
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
                )}
              </div>
            </div>
          )}
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
