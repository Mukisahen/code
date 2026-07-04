export type DiagnosisSeverity = 'healthy' | 'low' | 'moderate' | 'severe'

export interface CropDiagnosis {
  id: string
  imageColor: string
  condition: string
  severity: DiagnosisSeverity
  confidence: number
  summary: string
  recommendations: string[]
  createdAt: string
}
