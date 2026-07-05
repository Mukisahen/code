import type { MarketPriceEntry } from '@/types/marketPrice'

export const MOCK_MARKET_PRICES: MarketPriceEntry[] = [
  { id: 'mp-1', district: 'Masindi', category: 'Dry Grain', pricePerKg: 1420, changePercent: 3.2, updatedAt: '2026-07-04T06:00:00Z' },
  { id: 'mp-2', district: 'Kapchorwa', category: 'Dry Grain', pricePerKg: 1450, changePercent: 6.1, updatedAt: '2026-07-04T06:00:00Z' },
  { id: 'mp-3', district: 'Iganga', category: 'Wet Maize', pricePerKg: 910, changePercent: -1.5, updatedAt: '2026-07-04T06:00:00Z' },
  { id: 'mp-4', district: 'Jinja', category: 'Green Maize', pricePerKg: 780, changePercent: 0.8, updatedAt: '2026-07-04T06:00:00Z' },
  { id: 'mp-5', district: 'Mubende', category: 'Dry Grain', pricePerKg: 1310, changePercent: -2.4, updatedAt: '2026-07-04T06:00:00Z' },
  { id: 'mp-6', district: 'Lira', category: 'Dry Cobs', pricePerKg: 610, changePercent: 1.1, updatedAt: '2026-07-04T06:00:00Z' },
  { id: 'mp-7', district: 'Mbale', category: 'Seed Maize', pricePerKg: 6300, changePercent: 4.5, updatedAt: '2026-07-04T06:00:00Z' },
  { id: 'mp-8', district: 'Bugiri', category: 'Maize Flour', pricePerKg: 3150, changePercent: 2.0, updatedAt: '2026-07-04T06:00:00Z' },
  { id: 'mp-9', district: 'Luwero', category: 'Dry Grain', pricePerKg: 1380, changePercent: 0.4, updatedAt: '2026-07-04T06:00:00Z' },
  { id: 'mp-10', district: 'Kiboga', category: 'Wet Maize', pricePerKg: 895, changePercent: -0.6, updatedAt: '2026-07-04T06:00:00Z' },
  { id: 'mp-11', district: 'Mukono', category: 'Dry Grain', pricePerKg: 1405, changePercent: 1.8, updatedAt: '2026-07-04T06:00:00Z' },
]

export const PRICE_TREND_7D = [1180, 1205, 1260, 1300, 1340, 1390, 1420]
