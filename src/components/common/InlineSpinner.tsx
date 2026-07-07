import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

export function InlineSpinner({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-2 py-10 text-sm text-on-surface-variant', className)}>
      <Loader2 className="size-5 animate-spin text-primary" />
      {label ?? 'Loading…'}
    </div>
  )
}
