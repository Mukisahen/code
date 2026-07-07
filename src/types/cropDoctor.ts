export type DiagnosisSeverity = 'healthy' | 'low' | 'moderate' | 'severe'

export interface CropDiagnosis {
  id: string
  imageUrl: string
  isCropPhoto: boolean
  condition?: string
  severity?: DiagnosisSeverity
  confidence?: number
  summary?: string
  recommendations: string[]
  createdAt: string
}
