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

export const JOURNEY_STAGE_DESCRIPTIONS: Record<JourneyStage, string> = {
  planning: "You're in the Planning stage. Choose your seed variety and prepare your land before the rains.",
  growing: "You're in the Growing stage. Keep scouting for pests and weeds weekly.",
  harvesting: "You're in the Harvesting stage. Time it right — overripe cobs lose value fast.",
  storage: "You're in the Storage stage. Dry grain below 13% moisture before bagging to avoid mould.",
  selling: "You're in the Selling stage. Check today's market prices before you commit to a buyer.",
  processing: "You're in the Processing stage. Track your output grade to price it right.",
}
