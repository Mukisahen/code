import type { WeatherSnapshot } from '@/types/weather'

export const MOCK_WEATHER: WeatherSnapshot = {
  district: 'Masindi',
  condition: 'partly-cloudy',
  temperatureC: 26,
  humidity: 64,
  windKph: 12,
  rainChance: 35,
  advisory: 'Good conditions for weeding today. Light rain possible tomorrow afternoon.',
  forecast: [
    { day: 'Today', condition: 'partly-cloudy', highC: 28, lowC: 19, rainChance: 35 },
    { day: 'Tomorrow', condition: 'rainy', highC: 25, lowC: 18, rainChance: 70 },
    { day: 'Wed', condition: 'rainy', highC: 24, lowC: 17, rainChance: 65 },
    { day: 'Thu', condition: 'cloudy', highC: 26, lowC: 18, rainChance: 40 },
    { day: 'Fri', condition: 'sunny', highC: 29, lowC: 19, rainChance: 10 },
    { day: 'Sat', condition: 'sunny', highC: 30, lowC: 20, rainChance: 5 },
    { day: 'Sun', condition: 'partly-cloudy', highC: 27, lowC: 19, rainChance: 25 },
  ],
}
