import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Tone = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary'

const toneStyles: Record<Tone, string> = {
  neutral: 'bg-surface-variant text-on-surface-variant',
  success: 'bg-primary-container text-on-primary-container',
  warning: 'bg-secondary-container text-on-secondary-container',
  error: 'bg-error-container text-on-error-container',
  info: 'bg-tertiary-container text-on-tertiary-container',
  primary: 'bg-primary text-on-primary',
  secondary: 'bg-secondary text-on-secondary',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
