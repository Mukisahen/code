import type { WeatherSnapshot, WeatherCondition, DailyForecast } from '@/types/weather'

const DAY_LABELS = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function buildForecast(
  base: { highC: number; lowC: number; rainChance: number },
  pattern: WeatherCondition[],
): DailyForecast[] {
  return DAY_LABELS.map((day, i) => {
    const condition = pattern[i % pattern.length]
    const rainDrift = condition === 'rainy' || condition === 'storm' ? 25 : condition === 'sunny' ? -20 : 0
    return {
      day,
      condition,
      highC: base.highC + ((i % 3) - 1),
      lowC: base.lowC + ((i % 2) - 1),
      rainChance: Math.min(95, Math.max(5, base.rainChance + rainDrift + (i % 3) * 4)),
    }
  })
}

/**
 * Realistic-ish regional variety across Uganda's maize-growing districts —
 * highland districts run cooler and wetter, the northern belt runs hotter
 * and drier, the Lake Victoria basin stays humid with frequent showers.
 */
const WEATHER_BY_DISTRICT: Record<string, WeatherSnapshot> = {
  Masindi: {
    district: 'Masindi',
    condition: 'partly-cloudy',
    temperatureC: 26,
    humidity: 64,
    windKph: 12,
    rainChance: 35,
    advisory: 'Good conditions for weeding today. Light rain possible tomorrow afternoon.',
    forecast: buildForecast({ highC: 28, lowC: 19, rainChance: 35 }, [
      'partly-cloudy',
      'rainy',
      'rainy',
      'cloudy',
      'sunny',
      'sunny',
      'partly-cloudy',
    ]),
  },
  Kapchorwa: {
    district: 'Kapchorwa',
    condition: 'cloudy',
    temperatureC: 19,
    humidity: 72,
    windKph: 16,
    rainChance: 55,
    advisory: 'Highland cool spell — delay spraying until afternoon showers pass.',
    forecast: buildForecast({ highC: 21, lowC: 13, rainChance: 55 }, [
      'cloudy',
      'rainy',
      'rainy',
      'cloudy',
      'partly-cloudy',
      'rainy',
      'cloudy',
    ]),
  },
  Kasese: {
    district: 'Kasese',
    condition: 'rainy',
    temperatureC: 22,
    humidity: 78,
    windKph: 10,
    rainChance: 68,
    advisory: 'Near the Rwenzori foothills — expect frequent showers. Check field drainage.',
    forecast: buildForecast({ highC: 23, lowC: 15, rainChance: 68 }, [
      'rainy',
      'rainy',
      'storm',
      'cloudy',
      'rainy',
      'partly-cloudy',
      'rainy',
    ]),
  },
  Iganga: {
    district: 'Iganga',
    condition: 'partly-cloudy',
    temperatureC: 27,
    humidity: 70,
    windKph: 11,
    rainChance: 40,
    advisory: 'Lake-basin humidity is high — watch for leaf blight after rain.',
    forecast: buildForecast({ highC: 28, lowC: 19, rainChance: 40 }, [
      'partly-cloudy',
      'cloudy',
      'rainy',
      'partly-cloudy',
      'sunny',
      'partly-cloudy',
      'cloudy',
    ]),
  },
  Jinja: {
    district: 'Jinja',
    condition: 'sunny',
    temperatureC: 28,
    humidity: 62,
    windKph: 14,
    rainChance: 22,
    advisory: 'Warm and mostly dry — a good stretch for harvesting and drying grain.',
    forecast: buildForecast({ highC: 29, lowC: 20, rainChance: 22 }, [
      'sunny',
      'sunny',
      'partly-cloudy',
      'sunny',
      'cloudy',
      'sunny',
      'sunny',
    ]),
  },
  Mbale: {
    district: 'Mbale',
    condition: 'cloudy',
    temperatureC: 23,
    humidity: 68,
    windKph: 13,
    rainChance: 48,
    advisory: 'Elgon foothill conditions — moderate rain risk, plan spraying carefully.',
    forecast: buildForecast({ highC: 24, lowC: 16, rainChance: 48 }, [
      'cloudy',
      'rainy',
      'cloudy',
      'partly-cloudy',
      'rainy',
      'cloudy',
      'partly-cloudy',
    ]),
  },
  Mubende: {
    district: 'Mubende',
    condition: 'partly-cloudy',
    temperatureC: 25,
    humidity: 66,
    windKph: 10,
    rainChance: 38,
    advisory: 'Typical central-region conditions — steady moisture for vegetative growth.',
    forecast: buildForecast({ highC: 26, lowC: 18, rainChance: 38 }, [
      'partly-cloudy',
      'cloudy',
      'rainy',
      'sunny',
      'partly-cloudy',
      'sunny',
      'cloudy',
    ]),
  },
  Lira: {
    district: 'Lira',
    condition: 'sunny',
    temperatureC: 31,
    humidity: 48,
    windKph: 15,
    rainChance: 15,
    advisory: 'Northern dry spell continues — irrigate if possible during flowering.',
    forecast: buildForecast({ highC: 32, lowC: 21, rainChance: 15 }, [
      'sunny',
      'sunny',
      'sunny',
      'partly-cloudy',
      'sunny',
      'sunny',
      'partly-cloudy',
    ]),
  },
  Gulu: {
    district: 'Gulu',
    condition: 'sunny',
    temperatureC: 32,
    humidity: 45,
    windKph: 17,
    rainChance: 12,
    advisory: 'Hot and dry — prioritise mulching to retain soil moisture.',
    forecast: buildForecast({ highC: 33, lowC: 21, rainChance: 12 }, [
      'sunny',
      'sunny',
      'sunny',
      'sunny',
      'partly-cloudy',
      'sunny',
      'sunny',
    ]),
  },
  Kitgum: {
    district: 'Kitgum',
    condition: 'sunny',
    temperatureC: 33,
    humidity: 42,
    windKph: 18,
    rainChance: 10,
    advisory: 'Very dry conditions — delay planting until rains are confirmed.',
    forecast: buildForecast({ highC: 34, lowC: 22, rainChance: 10 }, [
      'sunny',
      'sunny',
      'sunny',
      'sunny',
      'sunny',
      'partly-cloudy',
      'sunny',
    ]),
  },
  Mayuge: {
    district: 'Mayuge',
    condition: 'rainy',
    temperatureC: 26,
    humidity: 74,
    windKph: 9,
    rainChance: 60,
    advisory: 'Lakeshore showers likely — hold off on fertilizer application until it clears.',
    forecast: buildForecast({ highC: 27, lowC: 19, rainChance: 60 }, [
      'rainy',
      'cloudy',
      'rainy',
      'partly-cloudy',
      'rainy',
      'cloudy',
      'partly-cloudy',
    ]),
  },
  Kiboga: {
    district: 'Kiboga',
    condition: 'partly-cloudy',
    temperatureC: 25,
    humidity: 63,
    windKph: 11,
    rainChance: 33,
    advisory: 'Stable central conditions — a fair window for weeding and top-dressing.',
    forecast: buildForecast({ highC: 26, lowC: 18, rainChance: 33 }, [
      'partly-cloudy',
      'sunny',
      'cloudy',
      'rainy',
      'partly-cloudy',
      'sunny',
      'partly-cloudy',
    ]),
  },
  Luwero: {
    district: 'Luwero',
    condition: 'partly-cloudy',
    temperatureC: 26,
    humidity: 65,
    windKph: 10,
    rainChance: 36,
    advisory: 'Balanced moisture and sun — good conditions across most farm tasks.',
    forecast: buildForecast({ highC: 27, lowC: 18, rainChance: 36 }, [
      'partly-cloudy',
      'cloudy',
      'sunny',
      'rainy',
      'sunny',
      'partly-cloudy',
      'cloudy',
    ]),
  },
  Kayunga: {
    district: 'Kayunga',
    condition: 'cloudy',
    temperatureC: 25,
    humidity: 69,
    windKph: 11,
    rainChance: 44,
    advisory: 'Overcast with scattered showers — keep an eye on drainage in low-lying plots.',
    forecast: buildForecast({ highC: 26, lowC: 18, rainChance: 44 }, [
      'cloudy',
      'rainy',
      'partly-cloudy',
      'cloudy',
      'sunny',
      'rainy',
      'cloudy',
    ]),
  },
  Ntungamo: {
    district: 'Ntungamo',
    condition: 'cloudy',
    temperatureC: 21,
    humidity: 71,
    windKph: 14,
    rainChance: 50,
    advisory: 'Cool south-western highlands — frequent light rain, good for germination.',
    forecast: buildForecast({ highC: 22, lowC: 14, rainChance: 50 }, [
      'cloudy',
      'rainy',
      'cloudy',
      'partly-cloudy',
      'rainy',
      'cloudy',
      'partly-cloudy',
    ]),
  },
  Kamwenge: {
    district: 'Kamwenge',
    condition: 'rainy',
    temperatureC: 22,
    humidity: 75,
    windKph: 9,
    rainChance: 58,
    advisory: 'Western wet belt — good soil moisture, watch for fungal disease pressure.',
    forecast: buildForecast({ highC: 23, lowC: 15, rainChance: 58 }, [
      'rainy',
      'cloudy',
      'rainy',
      'partly-cloudy',
      'rainy',
      'cloudy',
      'rainy',
    ]),
  },
  Kibaale: {
    district: 'Kibaale',
    condition: 'partly-cloudy',
    temperatureC: 23,
    humidity: 70,
    windKph: 10,
    rainChance: 42,
    advisory: 'Mild and moist — favourable for vegetative growth this week.',
    forecast: buildForecast({ highC: 24, lowC: 16, rainChance: 42 }, [
      'partly-cloudy',
      'rainy',
      'cloudy',
      'sunny',
      'partly-cloudy',
      'rainy',
      'cloudy',
    ]),
  },
  Nakaseke: {
    district: 'Nakaseke',
    condition: 'sunny',
    temperatureC: 27,
    humidity: 58,
    windKph: 12,
    rainChance: 25,
    advisory: 'Drier stretch — a good window for harvesting if grain is ready.',
    forecast: buildForecast({ highC: 28, lowC: 19, rainChance: 25 }, [
      'sunny',
      'partly-cloudy',
      'sunny',
      'cloudy',
      'sunny',
      'sunny',
      'partly-cloudy',
    ]),
  },
  Bugiri: {
    district: 'Bugiri',
    condition: 'rainy',
    temperatureC: 26,
    humidity: 73,
    windKph: 10,
    rainChance: 62,
    advisory: 'Wetter than usual this week — delay fertilizer top-dressing until it dries out.',
    forecast: buildForecast({ highC: 27, lowC: 19, rainChance: 62 }, [
      'rainy',
      'rainy',
      'cloudy',
      'rainy',
      'partly-cloudy',
      'cloudy',
      'rainy',
    ]),
  },
  Serere: {
    district: 'Serere',
    condition: 'sunny',
    temperatureC: 29,
    humidity: 54,
    windKph: 13,
    rainChance: 20,
    advisory: 'Warm and fairly dry — irrigate young plants if rain stays away.',
    forecast: buildForecast({ highC: 30, lowC: 20, rainChance: 20 }, [
      'sunny',
      'sunny',
      'partly-cloudy',
      'sunny',
      'cloudy',
      'sunny',
      'partly-cloudy',
    ]),
  },
  Kampala: {
    district: 'Kampala',
    condition: 'partly-cloudy',
    temperatureC: 25,
    humidity: 67,
    windKph: 11,
    rainChance: 37,
    advisory: 'Typical central conditions today, with a chance of afternoon showers.',
    forecast: buildForecast({ highC: 26, lowC: 18, rainChance: 37 }, [
      'partly-cloudy',
      'cloudy',
      'rainy',
      'sunny',
      'partly-cloudy',
      'sunny',
      'cloudy',
    ]),
  },
}

const FALLBACK_CONDITIONS: WeatherCondition[] = ['sunny', 'partly-cloudy', 'cloudy', 'rainy']

/** Deterministic pseudo-variety for a district we don't have hand-authored data for. */
function hashDistrict(district: string): number {
  let hash = 0
  for (let i = 0; i < district.length; i++) {
    hash = (hash * 31 + district.charCodeAt(i)) % 1000
  }
  return hash
}

export function getWeatherForDistrict(district: string): WeatherSnapshot {
  const known = WEATHER_BY_DISTRICT[district]
  if (known) return known

  const seed = hashDistrict(district)
  const condition = FALLBACK_CONDITIONS[seed % FALLBACK_CONDITIONS.length]
  const temperatureC = 22 + (seed % 10)
  const rainChance = 15 + (seed % 60)

  return {
    district,
    condition,
    temperatureC,
    humidity: 55 + (seed % 25),
    windKph: 8 + (seed % 12),
    rainChance,
    advisory: `Localized forecast for ${district} — conditions look ${condition.replace('-', ' ')} over the next few days.`,
    forecast: buildForecast(
      { highC: temperatureC + 2, lowC: temperatureC - 8, rainChance },
      [condition, 'partly-cloudy', 'cloudy', condition, 'sunny', condition, 'partly-cloudy'],
    ),
  }
}
