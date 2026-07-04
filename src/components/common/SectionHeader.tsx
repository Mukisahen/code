import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  seeAllHref?: string
  right?: ReactNode
}

export function SectionHeader({ title, subtitle, seeAllHref, right }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-base font-bold text-on-surface sm:text-lg">{title}</h2>
        {subtitle && <p className="text-xs text-on-surface-variant sm:text-sm">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {right}
        {seeAllHref && (
          <Link
            to={seeAllHref}
            className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
          >
            See all
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
