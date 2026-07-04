export type BatchStatus = 'queued' | 'processing' | 'done'

export interface ProductionBatch {
  id: string
  batchName: string
  inputProduct: string
  inputKg: number
  outputBags: number
  outputProduct: string
  status: BatchStatus
  qualityGrade: 'A' | 'B' | 'C' | null
  startedAt: string
  completedAt: string | null
}
