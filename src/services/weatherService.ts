import { api } from '@/lib/apiClient'
import type { WeatherSnapshot } from '@/types/weather'

export async function getWeather(district: string): Promise<WeatherSnapshot> {
  const { weather } = await api.get<{ weather: WeatherSnapshot }>(`/weather/${encodeURIComponent(district)}`)
  return weather
}
