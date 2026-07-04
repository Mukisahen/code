import { Sun, Cloud, CloudRain, CloudDrizzle, Droplets, Wind, Info } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { MOCK_WEATHER } from '@/mocks/weather'
import type { WeatherCondition } from '@/types/weather'

const WEATHER_ICONS: Record<WeatherCondition, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  storm: CloudRain,
  'partly-cloudy': CloudDrizzle,
}

export default function WeatherPage() {
  const CurrentIcon = WEATHER_ICONS[MOCK_WEATHER.condition]

  return (
    <DashboardLayout title="Weather" subtitle={`Forecast for ${MOCK_WEATHER.district}`}>
      <Card className="bg-gradient-to-br from-info/15 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-on-surface-variant">{MOCK_WEATHER.district}</p>
            <p className="text-4xl font-bold text-on-surface">{MOCK_WEATHER.temperatureC}&deg;C</p>
          </div>
          <CurrentIcon className="size-16 text-info" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Droplets className="size-4 text-info" /> {MOCK_WEATHER.humidity}% humidity
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="size-4 text-info" /> {MOCK_WEATHER.windKph} km/h
          </div>
          <div className="flex items-center gap-1.5">
            <CloudRain className="size-4 text-info" /> {MOCK_WEATHER.rainChance}% rain
          </div>
        </div>
      </Card>

      <Card className="mt-4 flex items-start gap-3">
        <Info className="mt-0.5 size-5 shrink-0 text-primary" />
        <p className="text-sm text-on-surface">{MOCK_WEATHER.advisory}</p>
      </Card>

      <Card className="mt-4">
        <h2 className="mb-3 font-bold text-on-surface">7-day forecast</h2>
        <div className="divide-y divide-outline-variant/60">
          {MOCK_WEATHER.forecast.map((day) => {
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
