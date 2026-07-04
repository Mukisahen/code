import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprout, Stethoscope, Store, TrendingUp } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/utils/cn'

const SLIDES = [
  {
    icon: Sprout,
    title: 'Plan every season with confidence',
    description: 'Guided planting calendars and AI recommendations tailored to your district.',
  },
  {
    icon: Stethoscope,
    title: 'Diagnose crop problems instantly',
    description: 'Photograph a leaf or cob and let AI Crop Doctor spot disease and pests early.',
  },
  {
    icon: TrendingUp,
    title: 'Know your maize is worth',
    description: 'Real-time market prices across Uganda so you never sell below value.',
  },
  {
    icon: Store,
    title: 'Sell directly to buyers',
    description: 'Reach verified buyers and processors on the Farm Bhade marketplace.',
  },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [, setHasSeenOnboarding] = useLocalStorage('farm-bhade-onboarding-seen', false)
  const isLastStep = step === SLIDES.length - 1
  const slide = SLIDES[step]
  const Icon = slide.icon

  function finish() {
    setHasSeenOnboarding(true)
    navigate(ROUTES.register)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background safe-top safe-bottom">
      <div className="flex justify-end px-5 pt-4 sm:px-8">
        <Button variant="text" size="sm" onClick={finish}>
          Skip
        </Button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center sm:px-8">
        <div
          key={step}
          className="flex size-32 animate-scale-in items-center justify-center rounded-[2rem] bg-primary-container text-on-primary-container"
        >
          <Icon className="size-14" strokeWidth={1.75} />
        </div>
        <h1 key={`title-${step}`} className="mt-8 max-w-sm animate-slide-up text-2xl font-bold text-on-surface">
          {slide.title}
        </h1>
        <p key={`desc-${step}`} className="mt-3 max-w-sm animate-slide-up text-sm text-on-surface-variant">
          {slide.description}
        </p>
      </div>

      <div className="px-6 pb-8 sm:px-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-2 rounded-full transition-all',
                i === step ? 'w-6 bg-primary' : 'w-2 bg-outline-variant',
              )}
            />
          ))}
        </div>
        <Button
          fullWidth
          size="lg"
          onClick={() => (isLastStep ? finish() : setStep((s) => s + 1))}
        >
          {isLastStep ? 'Create My Account' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
