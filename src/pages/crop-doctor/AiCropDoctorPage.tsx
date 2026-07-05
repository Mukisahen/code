import { useRef, useState } from 'react'
import {
  Camera,
  Upload,
  Loader2,
  Sprout,
  RotateCcw,
  History as HistoryIcon,
  Sparkles,
  ImageOff,
} from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { EmptyState } from '@/components/common/EmptyState'
import { AskAiChat } from '@/components/crop-doctor/AskAiChat'
import { MOCK_DIAGNOSIS_HISTORY } from '@/mocks/diagnoses'
import type { CropDiagnosis } from '@/types/cropDoctor'
import { formatRelativeTime } from '@/utils/format'
import { looksLikeCropPhoto } from '@/utils/imageHeuristics'
import { cn } from '@/utils/cn'

type Mode = 'capture' | 'analyzing' | 'result' | 'unrecognized'
type Tab = 'diagnose' | 'ask-ai' | 'history'

const TAB_LABEL: Record<Tab, string> = { diagnose: 'Diagnose', 'ask-ai': 'Ask AI', history: 'History' }

const SEVERITY_TONE: Record<CropDiagnosis['severity'], 'success' | 'warning' | 'error'> = {
  healthy: 'success',
  low: 'warning',
  moderate: 'warning',
  severe: 'error',
}

const MOCK_RESULT_POOL: Omit<CropDiagnosis, 'id' | 'createdAt' | 'imageColor'>[] = [
  {
    condition: 'Northern Corn Leaf Blight',
    severity: 'moderate',
    confidence: 89,
    summary: 'Grey-green cigar-shaped lesions detected on lower leaves, consistent with early blight infection.',
    recommendations: [
      'Apply a mancozeb-based fungicide within 48 hours.',
      'Remove and burn severely affected leaves.',
      'Improve field drainage to reduce leaf wetness duration.',
      'Rotate with a non-host crop next season.',
    ],
  },
  {
    condition: 'Healthy Crop',
    severity: 'healthy',
    confidence: 96,
    summary: 'No visible signs of disease or pest damage. Leaf colour and structure look strong.',
    recommendations: [
      'Continue current fertilizer schedule.',
      'Scout weekly for fall armyworm during vegetative stage.',
    ],
  },
  {
    condition: 'Fall Armyworm Damage',
    severity: 'severe',
    confidence: 92,
    summary: 'Characteristic window-pane feeding and frass detected in the whorl.',
    recommendations: [
      'Apply an approved insecticide targeting armyworm larvae immediately.',
      'Scout neighbouring plots to contain spread.',
      'Consider biological control (Bt-based products) for future prevention.',
    ],
  },
  {
    condition: 'Nitrogen Deficiency',
    severity: 'low',
    confidence: 84,
    summary: 'Yellowing (chlorosis) starting from leaf tips in a V-shape, typical of nitrogen deficiency.',
    recommendations: [
      'Apply top-dressing nitrogen fertilizer (Urea or CAN).',
      'Recheck soil pH — nutrient uptake drops below pH 5.5.',
      'Re-assess crop colour in 7-10 days after application.',
    ],
  },
]

export default function AiCropDoctorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<Tab>('diagnose')
  const [mode, setMode] = useState<Mode>('capture')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<CropDiagnosis | null>(null)
  const [history, setHistory] = useState<CropDiagnosis[]>(MOCK_DIAGNOSIS_HISTORY)

  async function handleFileSelected(file: File | undefined) {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setMode('analyzing')

    const [isCropPhoto] = await Promise.all([
      looksLikeCropPhoto(file).catch(() => true),
      new Promise((resolve) => setTimeout(resolve, 1800)),
    ])

    if (!isCropPhoto) {
      setMode('unrecognized')
      return
    }

    const template = MOCK_RESULT_POOL[Math.floor(Math.random() * MOCK_RESULT_POOL.length)]
    const diagnosis: CropDiagnosis = {
      ...template,
      id: `diag-${Date.now()}`,
      imageColor: '#4C7A3A',
      createdAt: new Date().toISOString(),
    }
    setResult(diagnosis)
    setHistory((prev) => [diagnosis, ...prev])
    setMode('result')
  }

  function reset() {
    setMode('capture')
    setPreviewUrl(null)
    setResult(null)
  }

  return (
    <DashboardLayout title="AI Assistant" subtitle="Diagnose crop problems and get farming advice, in English or Luganda">
      <div role="tablist" className="mb-5 flex gap-2 rounded-full bg-surface-variant p-1 w-fit">
        {(['diagnose', 'ask-ai', 'history'] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              tab === t ? 'bg-surface text-on-surface shadow-elevation-1' : 'text-on-surface-variant',
            )}
          >
            {t === 'ask-ai' && <Sparkles className="size-3.5" />}
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      {tab === 'ask-ai' && <AskAiChat />}

      {tab === 'diagnose' && (
        <Card className="mx-auto max-w-xl">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
          />

          {mode === 'capture' && !previewUrl && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <span className="flex size-20 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                <Sprout className="size-9" />
              </span>
              <div>
                <p className="font-bold text-on-surface">Photograph a maize leaf or cob</p>
                <p className="mt-1 max-w-xs text-sm text-on-surface-variant">
                  Get an instant AI diagnosis with treatment recommendations.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Button
                  leadingIcon={<Camera className="size-4.5" />}
                  onClick={() => {
                    fileInputRef.current?.setAttribute('capture', 'environment')
                    fileInputRef.current?.click()
                  }}
                >
                  Take Photo
                </Button>
                <Button
                  variant="outlined"
                  leadingIcon={<Upload className="size-4.5" />}
                  onClick={() => {
                    fileInputRef.current?.removeAttribute('capture')
                    fileInputRef.current?.click()
                  }}
                >
                  Upload Image
                </Button>
              </div>
            </div>
          )}

          {mode === 'analyzing' && previewUrl && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <img src={previewUrl} alt="Crop preview" className="h-52 w-full rounded-lg object-cover" />
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Loader2 className="size-5 animate-spin text-primary" />
                <span className="text-sm font-semibold">Analyzing image with AI Crop Doctor&hellip;</span>
              </div>
            </div>
          )}

          {mode === 'unrecognized' && previewUrl && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <img src={previewUrl} alt="Uploaded photo" className="h-52 w-full rounded-lg object-cover opacity-60" />
              <span className="flex size-14 items-center justify-center rounded-full bg-error-container text-on-error-container">
                <ImageOff className="size-7" />
              </span>
              <div>
                <p className="font-bold text-on-surface">We couldn&apos;t detect a maize plant in this photo</p>
                <p className="mt-1 max-w-xs text-sm text-on-surface-variant">
                  Try a clear, well-lit photo of a maize leaf, cob, stalk or field — filling most of the frame.
                </p>
              </div>
              <Button variant="outlined" leadingIcon={<RotateCcw className="size-4" />} onClick={reset}>
                Try another photo
              </Button>
            </div>
          )}

          {mode === 'result' && result && previewUrl && (
            <div className="flex flex-col gap-4">
              <img src={previewUrl} alt="Crop preview" className="h-52 w-full rounded-lg object-cover" />
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-on-surface">{result.condition}</h2>
                  <Badge tone={SEVERITY_TONE[result.severity]}>{result.severity}</Badge>
                </div>
                <p className="mt-1 text-xs text-on-surface-variant">{result.confidence}% confidence</p>
                <p className="mt-3 text-sm text-on-surface">{result.summary}</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-on-surface">Recommendations</p>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <Button variant="outlined" leadingIcon={<RotateCcw className="size-4" />} onClick={reset}>
                Diagnose another photo
              </Button>
            </div>
          )}
        </Card>
      )}

      {tab === 'history' && (
        <div className="mx-auto max-w-xl space-y-3">
          {history.length === 0 ? (
            <EmptyState icon={HistoryIcon} title="No diagnoses yet" />
          ) : (
            history.map((diag) => (
              <Card key={diag.id} className="flex items-center gap-3">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: diag.imageColor + '33' }}
                >
                  <Sprout className="size-5" style={{ color: diag.imageColor }} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-on-surface">{diag.condition}</p>
                  <p className="text-xs text-on-surface-variant">{formatRelativeTime(diag.createdAt)}</p>
                </div>
                <Badge tone={SEVERITY_TONE[diag.severity]}>{diag.severity}</Badge>
              </Card>
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
