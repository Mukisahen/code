export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'storm' | 'partly-cloudy'

export interface DailyForecast {
  day: string
  condition: WeatherCondition
  highC: number
  lowC: number
  rainChance: number
}

export interface WeatherSnapshot {
  district: string
  condition: WeatherCondition
  temperatureC: number
  humidity: number
  windKph: number
  rainChance: number
  advisory: string
  forecast: DailyForecast[]
}
