export interface MarketPriceEntry {
  id: string
  district: string
  category: string
  pricePerKg: number
  changePercent: number
  source?: 'admin' | 'live'
  updatedByName?: string
  updatedAt: string
}
