import type { JourneyStage } from '@/constants/app'

export interface FarmTask {
  id: string
  title: string
  stage: JourneyStage
  dueLabel: string
  done: boolean
}

export interface PlanEntry {
  id: string
  activity: string
  window: string
  status: 'upcoming' | 'in-progress' | 'done'
  notes: string
}

export interface GrowingLogEntry {
  id: string
  week: string
  stage: string
  healthScore: number
  note: string
}

export interface HarvestRecord {
  id: string
  season: string
  yieldBags: number
  qualityGrade: 'A' | 'B' | 'C'
  moistureLevel: number
  harvestedAt: string
}

export interface StorageBatch {
  id: string
  name: string
  quantityBags: number
  moistureLevel: number
  daysStored: number
  facility: string
  status: 'good' | 'watch' | 'at-risk'
}
