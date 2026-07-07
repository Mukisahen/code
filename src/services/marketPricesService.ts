import { api } from '@/lib/apiClient'
import type { MarketPriceEntry } from '@/types/marketPrice'

export async function listMarketPrices(): Promise<MarketPriceEntry[]> {
  const { prices } = await api.get<{ prices: MarketPriceEntry[] }>('/market-prices')
  return prices
}

export async function getPriceTrend(district: string, category: string): Promise<number[]> {
  const { trend } = await api.get<{ trend: number[] }>(
    `/market-prices/trend?district=${encodeURIComponent(district)}&category=${encodeURIComponent(category)}`,
  )
  return trend
}

export async function updateMarketPrice(district: string, category: string, pricePerKg: number): Promise<MarketPriceEntry> {
  const { price } = await api.post<{ price: MarketPriceEntry }>('/market-prices', { district, category, pricePerKg })
  return price
}
