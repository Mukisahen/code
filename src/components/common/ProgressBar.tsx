import { cn } from '@/utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  tone?: 'primary' | 'secondary' | 'error'
  className?: string
}

const toneStyles = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  error: 'bg-error',
}

export function ProgressBar({ value, max = 100, tone = 'primary', className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-variant', className)}>
      <div className={cn('h-full rounded-full transition-all', toneStyles[tone])} style={{ width: `${pct}%` }} />
    </div>
  )
}
