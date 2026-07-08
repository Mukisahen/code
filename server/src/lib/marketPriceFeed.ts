import { prisma } from './prisma.js'
import { env } from '../env.js'

const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query?function=CORN&interval=monthly&apikey='

// Guardrail: a single feed read should never be allowed to swing every local
// price by an implausible amount (bad data, API hiccup, etc).
const MAX_ABS_PERCENT = 15

interface AlphaVantagePoint {
  date: string
  value: string
}

/**
 * Reads the most recent month-over-month % change in the global corn
 * benchmark price. Returns null on any failure — missing key, network error,
 * unexpected shape, insufficient data — so callers can treat "no automatic
 * update this run" as the safe default rather than a hard error.
 */
async function fetchGlobalCornTrendPercent(): Promise<number | null> {
  if (!env.alphaVantageApiKey) return null

  try {
    const response = await fetch(`${ALPHA_VANTAGE_URL}${env.alphaVantageApiKey}`)
    if (!response.ok) return null

    const body = (await response.json()) as { data?: AlphaVantagePoint[] }
    const points = (body.data ?? []).filter((p) => p.value && p.value !== '.')
    if (points.length < 2) return null

    const [latest, previous] = points
    const latestValue = Number(latest.value)
    const previousValue = Number(previous.value)
    if (!Number.isFinite(latestValue) || !Number.isFinite(previousValue) || previousValue === 0) return null

    const percent = ((latestValue - previousValue) / previousValue) * 100
    return Math.max(-MAX_ABS_PERCENT, Math.min(MAX_ABS_PERCENT, Math.round(percent * 10) / 10))
  } catch {
    return null
  }
}

/**
 * Nudges every existing district/category price by the global corn trend,
 * rather than replacing local prices with a mismatched global figure — this
 * keeps admin-entered local baselines intact while still reflecting real
 * market movement. Districts/categories with no entry yet are untouched;
 * admins remain free to add or override any price manually at any time.
 */
export async function runAutomaticMarketPriceUpdate(): Promise<{ updated: number } | { skipped: string }> {
  try {
    const percent = await fetchGlobalCornTrendPercent()
    if (percent === null) return { skipped: 'no feed data available (missing key, network, or unexpected response)' }

    const entries = await prisma.marketPriceEntry.findMany()
    for (const entry of entries) {
      const nextPrice = Math.max(1, Math.round(entry.pricePerKg * (1 + percent / 100)))
      await prisma.marketPriceEntry.update({
        where: { id: entry.id },
        data: { pricePerKg: nextPrice, changePercent: percent, source: 'live', updatedById: null, updatedAt: new Date() },
      })
      await prisma.marketPriceHistory.create({
        data: { district: entry.district, category: entry.category, pricePerKg: nextPrice },
      })
    }

    return { updated: entries.length }
  } catch (err) {
    console.error('Automatic market price update failed:', err)
    return { skipped: 'unexpected error, see server logs' }
  }
}
