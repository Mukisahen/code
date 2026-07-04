import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { cn } from '@/utils/cn'

interface StatTileProps {
  icon: LucideIcon
  label: string
  value: string
  trend?: number
  tone?: 'primary' | 'secondary' | 'tertiary'
}

const toneStyles = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
}

export function StatTile({ icon: Icon, label, value, trend, tone = 'primary' }: StatTileProps) {
  return (
    <Card className="flex flex-col gap-3">
      <span className={cn('flex size-10 items-center justify-center rounded-full', toneStyles[tone])}>
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs font-medium text-on-surface-variant">{label}</p>
        <p className="mt-0.5 text-xl font-bold text-on-surface">{value}</p>
      </div>
      {trend !== undefined && (
        <span
          className={cn(
            'inline-flex w-fit items-center gap-0.5 text-xs font-semibold',
            trend >= 0 ? 'text-primary' : 'text-error',
          )}
        >
          {trend >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {Math.abs(trend)}%
        </span>
      )}
    </Card>
  )
}
