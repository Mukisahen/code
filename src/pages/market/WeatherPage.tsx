import { useEffect, useState } from 'react'
import { Sun, Cloud, CloudRain, CloudDrizzle, Droplets, Wind, Info } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import * as weatherService from '@/services/weatherService'
import { useAuth } from '@/hooks/useAuth'
import type { WeatherCondition, WeatherSnapshot } from '@/types/weather'

const WEATHER_ICONS: Record<WeatherCondition, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  storm: CloudRain,
  'partly-cloudy': CloudDrizzle,
}

export default function WeatherPage() {
  const { user } = useAuth()
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const district = user?.district ?? 'Masindi'
    setLoading(true)
    setError(false)
    weatherService
      .getWeather(district)
      .then(setWeather)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [user?.district])

  if (loading) {
    return (
      <DashboardLayout title="Weather">
        <InlineSpinner label="Loading forecast…" />
      </DashboardLayout>
    )
  }

  if (error || !weather) {
    return (
      <DashboardLayout title="Weather">
        <EmptyState icon={Info} title="Could not load weather" description="Please check your connection and try again." />
      </DashboardLayout>
    )
  }

  const CurrentIcon = WEATHER_ICONS[weather.condition]

  return (
    <DashboardLayout title="Weather" subtitle={`Forecast for ${weather.district}`}>
      <Card className="bg-gradient-to-br from-info/15 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-on-surface-variant">{weather.district}</p>
            <p className="text-4xl font-bold text-on-surface">{weather.temperatureC}&deg;C</p>
          </div>
          <CurrentIcon className="size-16 text-info" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Droplets className="size-4 text-info" /> {weather.humidity}% humidity
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="size-4 text-info" /> {weather.windKph} km/h
          </div>
          <div className="flex items-center gap-1.5">
            <CloudRain className="size-4 text-info" /> {weather.rainChance}% rain
          </div>
        </div>
      </Card>

      <Card className="mt-4 flex items-start gap-3">
        <Info className="mt-0.5 size-5 shrink-0 text-primary" />
        <p className="text-sm text-on-surface">{weather.advisory}</p>
      </Card>

      <Card className="mt-4">
        <h2 className="mb-3 font-bold text-on-surface">7-day forecast</h2>
        <div className="divide-y divide-outline-variant/60">
          {weather.forecast.map((day) => {
            const Icon = WEATHER_ICONS[day.condition]
            return (
              <div key={day.day} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <p className="w-20 font-semibold text-on-surface">{day.day}</p>
                <Icon className="size-5 text-info" />
                <p className="w-16 text-right text-xs text-on-surface-variant">{day.rainChance}% rain</p>
                <p className="w-24 text-right text-sm text-on-surface">
                  <span className="font-semibold">{day.highC}&deg;</span> / {day.lowC}&deg;
                </p>
              </div>
            )
          })}
        </div>
      </Card>
    </DashboardLayout>
  )
}
