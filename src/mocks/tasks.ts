import type { FarmTask, PlanEntry, GrowingLogEntry, HarvestRecord, StorageBatch } from '@/types/task'

export const MOCK_TODAY_TASKS: FarmTask[] = [
  { id: 'task-1', title: 'Apply top-dressing fertilizer to Plot B', stage: 'growing', dueLabel: 'Today', done: false },
  { id: 'task-2', title: 'Scout for fall armyworm in Plot A', stage: 'growing', dueLabel: 'Today', done: false },
  { id: 'task-3', title: 'Check moisture levels in storage batch #2', stage: 'storage', dueLabel: 'Today', done: true },
  { id: 'task-4', title: 'Confirm delivery time with Kigongo Milling Co.', stage: 'selling', dueLabel: 'Tomorrow', done: false },
]

export const MOCK_PLAN_ENTRIES: PlanEntry[] = [
  { id: 'plan-1', activity: 'Land preparation & ploughing', window: 'Mar 1 – Mar 10', status: 'done', notes: 'Plot A and B ploughed and harrowed.' },
  { id: 'plan-2', activity: 'Planting — Longe 10H hybrid seed', window: 'Mar 15 – Mar 20', status: 'done', notes: 'Planted at recommended 75x30cm spacing.' },
  { id: 'plan-3', activity: 'First top-dressing (Urea)', window: 'Apr 20 – Apr 25', status: 'in-progress', notes: 'Apply after confirming no rain for 24 hours.' },
  { id: 'plan-4', activity: 'Pest & disease scouting', window: 'Weekly', status: 'in-progress', notes: 'Focus on fall armyworm and leaf blight.' },
  { id: 'plan-5', activity: 'Second top-dressing', window: 'May 15 – May 20', status: 'upcoming', notes: 'Plan fertilizer purchase 1 week ahead.' },
  { id: 'plan-6', activity: 'Harvest window', window: 'Aug 1 – Aug 15', status: 'upcoming', notes: 'Book drying and storage space in advance.' },
]

export const MOCK_GROWING_LOG: GrowingLogEntry[] = [
  { id: 'grow-1', week: 'Week 4', stage: 'Vegetative (V4)', healthScore: 92, note: 'Strong uniform growth across Plot A.' },
  { id: 'grow-2', week: 'Week 6', stage: 'Vegetative (V6)', healthScore: 88, note: 'Minor nitrogen deficiency observed on leaf tips.' },
  { id: 'grow-3', week: 'Week 8', stage: 'Tasseling', healthScore: 81, note: 'Early signs of leaf blight on 3 plants — under treatment.' },
  { id: 'grow-4', week: 'Week 10', stage: 'Silking', healthScore: 90, note: 'Recovered well after fungicide application.' },
]

export const MOCK_HARVEST_RECORDS: HarvestRecord[] = [
  { id: 'harv-1', season: '2025 Season B', yieldBags: 84, qualityGrade: 'A', moistureLevel: 13.2, harvestedAt: '2025-08-10T00:00:00Z' },
  { id: 'harv-2', season: '2025 Season A', yieldBags: 71, qualityGrade: 'B', moistureLevel: 14.8, harvestedAt: '2025-03-02T00:00:00Z' },
  { id: 'harv-3', season: '2024 Season B', yieldBags: 68, qualityGrade: 'B', moistureLevel: 15.1, harvestedAt: '2024-08-05T00:00:00Z' },
]

export const MOCK_STORAGE_BATCHES: StorageBatch[] = [
  { id: 'store-1', name: 'Batch #1 — Plot A', quantityBags: 40, moistureLevel: 12.8, daysStored: 14, facility: 'Home store (hermetic bags)', status: 'good' },
  { id: 'store-2', name: 'Batch #2 — Plot B', quantityBags: 32, moistureLevel: 13.9, daysStored: 21, facility: 'Community warehouse', status: 'watch' },
  { id: 'store-3', name: 'Batch #3 — Purchased grain', quantityBags: 12, moistureLevel: 15.6, daysStored: 35, facility: 'Home store (sacks)', status: 'at-risk' },
]
