import { api } from '@/lib/apiClient'
import type { CropDiagnosis } from '@/types/cropDoctor'

export async function diagnosePhoto(file: File): Promise<CropDiagnosis> {
  const formData = new FormData()
  formData.append('photo', file)
  const { diagnosis } = await api.post<{ diagnosis: CropDiagnosis }>('/crop-doctor/diagnose', formData)
  return diagnosis
}

export async function getDiagnosisHistory(): Promise<CropDiagnosis[]> {
  const { diagnoses } = await api.get<{ diagnoses: CropDiagnosis[] }>('/crop-doctor/history')
  return diagnoses
}
