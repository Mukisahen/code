import type { CropDiagnosis } from '@/types/cropDoctor'

export const MOCK_DIAGNOSIS_HISTORY: CropDiagnosis[] = [
  {
    id: 'diag-1',
    imageColor: '#4C7A3A',
    condition: 'Northern Corn Leaf Blight',
    severity: 'moderate',
    confidence: 89,
    summary: 'Grey-green lesions detected on lower leaves, consistent with early blight infection.',
    recommendations: [
      'Apply a mancozeb-based fungicide within 48 hours.',
      'Remove and burn severely affected leaves.',
      'Improve field drainage to reduce leaf wetness duration.',
      'Rotate with a non-host crop next season.',
    ],
    createdAt: '2026-07-03T14:00:00Z',
  },
  {
    id: 'diag-2',
    imageColor: '#6FA84B',
    condition: 'Healthy Crop',
    severity: 'healthy',
    confidence: 96,
    summary: 'No visible signs of disease or pest damage. Leaf colour and structure look strong.',
    recommendations: [
      'Continue current fertilizer schedule.',
      'Scout weekly for fall armyworm during vegetative stage.',
    ],
    createdAt: '2026-06-20T11:20:00Z',
  },
  {
    id: 'diag-3',
    imageColor: '#8A6D3B',
    condition: 'Fall Armyworm Damage',
    severity: 'severe',
    confidence: 92,
    summary: 'Characteristic window-pane feeding and frass detected in the whorl.',
    recommendations: [
      'Apply an approved insecticide targeting armyworm larvae immediately.',
      'Scout neighbouring plots to contain spread.',
      'Consider biological control (Bt-based products) for future prevention.',
    ],
    createdAt: '2026-06-05T09:45:00Z',
  },
]
