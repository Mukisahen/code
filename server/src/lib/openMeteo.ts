type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'storm' | 'partly-cloudy'

function conditionFromWmoCode(code: number): WeatherCondition {
  if (code === 0 || code === 1) return 'sunny'
  if (code === 2) return 'partly-cloudy'
  if (code === 3 || (code >= 45 && code <= 48)) return 'cloudy'
  if (code >= 95) return 'storm'
  return 'rainy'
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
  }
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export async function fetchWeatherForCoordinates(lat: number, lon: number) {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code')
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max')
  url.searchParams.set('timezone', 'Africa/Kampala')
  url.searchParams.set('forecast_days', '7')

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Open-Meteo request failed: ${response.status}`)
  const data = (await response.json()) as OpenMeteoResponse

  const condition = conditionFromWmoCode(data.current.weather_code)
  const rainChanceToday = data.daily.precipitation_probability_max[0] ?? 0

  let advisory = 'Conditions look stable — good day for routine field work.'
  if (condition === 'storm') advisory = 'Thunderstorms expected — secure drying maize and delay spraying.'
  else if (condition === 'rainy' || rainChanceToday > 60) advisory = 'High rain chance — hold off on harvesting or drying maize today.'
  else if (data.current.temperature_2m > 32) advisory = 'High temperatures expected — irrigate if possible and monitor for heat stress.'

  return {
    condition,
    temperatureC: Math.round(data.current.temperature_2m),
    humidity: Math.round(data.current.relative_humidity_2m),
    windKph: Math.round(data.current.wind_speed_10m),
    rainChance: Math.round(rainChanceToday),
    advisory,
    forecast: data.daily.time.map((date, i) => ({
      day: DAY_LABELS[new Date(date).getUTCDay()],
      condition: conditionFromWmoCode(data.daily.weather_code[i]),
      highC: Math.round(data.daily.temperature_2m_max[i]),
      lowC: Math.round(data.daily.temperature_2m_min[i]),
      rainChance: Math.round(data.daily.precipitation_probability_max[i] ?? 0),
    })),
  }
}
