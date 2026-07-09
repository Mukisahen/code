import { useEffect, useMemo, useState } from 'react'
import { Sun, Cloud, CloudRain, CloudDrizzle, Droplets, Wind, Info, MapPin } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import * as weatherService from '@/services/weatherService'
import { useAuth } from '@/hooks/useAuth'
import { UGANDA_MAIZE_DISTRICTS } from '@/mocks/districts'
import type { WeatherCondition, WeatherSnapshot } from '@/types/weather'
import { cn } from '@/utils/cn'

const WEATHER_ICONS: Record<WeatherCondition, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  storm: CloudRain,
  'partly-cloudy': CloudDrizzle,
}

export default function WeatherPage() {
  const { user } = useAuth()
  const homeDistrict = user?.district ?? 'Masindi'
  const [selectedDistrict, setSelectedDistrict] = useState(homeDistrict)
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const districtOptions = useMemo(() => {
    const rest = UGANDA_MAIZE_DISTRICTS.filter((d) => d !== homeDistrict)
    return [homeDistrict, ...rest]
  }, [homeDistrict])

  useEffect(() => {
    setLoading(true)
    setError(false)
    weatherService
      .getWeather(selectedDistrict)
      .then(setWeather)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [selectedDistrict])

  return (
    <DashboardLayout title="Weather" subtitle="Forecasts for every maize-growing district">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {districtOptions.map((district) => {
          const isHome = district === homeDistrict
          const isSelected = district === selectedDistrict
          return (
            <button
              key={district}
              onClick={() => setSelectedDistrict(district)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors',
                isSelected
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant',
              )}
            >
              {isHome && <MapPin className="size-3.5" />}
              {district}
            </button>
          )
        })}
      </div>

      {loading ? (
        <InlineSpinner label="Loading forecast…" className="mt-6" />
      ) : error || !weather ? (
        <div className="mt-6">
          <EmptyState
            icon={Info}
            title="Could not load weather"
            description="Please check your connection and try again."
          />
        </div>
      ) : (
        <>
          <Card className="mt-4 bg-gradient-to-br from-info/15 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
                  {weather.district}
                  {weather.district === homeDistrict && <Badge tone="success">Your district</Badge>}
                </p>
                <p className="text-4xl font-bold text-on-surface">{weather.temperatureC}&deg;C</p>
              </div>
              {(() => {
                const CurrentIcon = WEATHER_ICONS[weather.condition]
                return <CurrentIcon className="size-16 text-info" />
              })()}
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
        </>
      )}
    </DashboardLayout>
  )
}
