import { Sparkles, TrendingUp, CloudRain, Handshake } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import type { LucideIcon } from 'lucide-react'

export interface PromoSlide {
  id: string
  icon: LucideIcon
  text: string
  href: string
  tone: 'primary' | 'secondary' | 'tertiary'
}

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'promo-premium',
    icon: Sparkles,
    text: 'Go Premium: unlimited AI Crop Doctor scans, price alerts and featured listings.',
    href: ROUTES.subscription,
    tone: 'secondary',
  },
  {
    id: 'promo-prices',
    icon: TrendingUp,
    text: 'Dry Grain Maize is up 6% in Kapchorwa this week — check today’s prices.',
    href: ROUTES.marketPrices,
    tone: 'primary',
  },
  {
    id: 'promo-weather',
    icon: CloudRain,
    text: 'Rain expected in Masindi tomorrow afternoon — a good window for planting.',
    href: ROUTES.weather,
    tone: 'tertiary',
  },
  {
    id: 'promo-requests',
    icon: Handshake,
    text: 'New buyer requests were posted today. See who’s looking for maize near you.',
    href: ROUTES.buyerRequests,
    tone: 'primary',
  },
]
