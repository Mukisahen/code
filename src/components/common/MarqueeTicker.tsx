import { TrendingUp } from 'lucide-react'
import { cn } from '@/utils/cn'

export function MarqueeTicker({ items, className }: { items: string[]; className?: string }) {
  const track = [...items, ...items]

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 overflow-hidden rounded-full bg-surface-container px-3 py-2',
        className,
      )}
    >
      <TrendingUp className="size-4 shrink-0 text-primary" />
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap group-hover:[animation-play-state:paused]">
          {track.map((item, i) => (
            <span key={i} className="text-xs font-semibold text-on-surface-variant">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
