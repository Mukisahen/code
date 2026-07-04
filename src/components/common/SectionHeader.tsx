import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  seeAllHref?: string
}

export function SectionHeader({ title, subtitle, seeAllHref }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div>
        <h2 className="text-base font-bold text-on-surface sm:text-lg">{title}</h2>
        {subtitle && <p className="text-xs text-on-surface-variant sm:text-sm">{subtitle}</p>}
      </div>
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
  )
}
