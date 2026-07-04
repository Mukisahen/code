export const APP_NAME = 'Farm Bhade'
export const APP_TAGLINE = 'From Seed to Market'
export const APP_BRAND_PROMISE = 'Your AI Farm Friend'

export const JOURNEY_STAGES = [
  'planning',
  'growing',
  'harvesting',
  'storage',
  'selling',
  'processing',
] as const

export type JourneyStage = (typeof JOURNEY_STAGES)[number]

export const JOURNEY_STAGE_LABELS: Record<JourneyStage, string> = {
  planning: 'Planning',
  growing: 'Growing',
  harvesting: 'Harvesting',
  storage: 'Storage',
  selling: 'Selling',
  processing: 'Processing',
}
