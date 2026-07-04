import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type Variant = 'elevated' | 'filled' | 'outlined'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
}

const variantStyles: Record<Variant, string> = {
  elevated: 'bg-surface-container-low shadow-elevation-1',
  filled: 'bg-surface-container',
  outlined: 'bg-surface border border-outline-variant',
}

export function Card({ variant = 'elevated', className, children, ...props }: CardProps) {
  return (
    <div className={cn('rounded-lg p-5', variantStyles[variant], className)} {...props}>
      {children}
    </div>
  )
}
