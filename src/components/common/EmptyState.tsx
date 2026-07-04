import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-outline-variant bg-surface py-14 text-center">
      <Icon className="size-9 text-on-surface-variant" />
      <div>
        <p className="font-semibold text-on-surface">{title}</p>
        {description && <p className="mt-1 max-w-xs text-sm text-on-surface-variant">{description}</p>}
      </div>
      {action}
    </div>
  )
}
