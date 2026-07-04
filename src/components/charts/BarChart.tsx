import { useState } from 'react'
import { cn } from '@/utils/cn'

interface BarChartDatum {
  label: string
  value: number
}

interface BarChartProps {
  data: BarChartDatum[]
  height?: number
  valueFormatter?: (value: number) => string
  color?: string
}

const PALETTE = ['var(--chart-cat-1)', 'var(--chart-cat-2)', 'var(--chart-cat-3)', 'var(--chart-cat-4)']

export function BarChart({ data, height = 180, valueFormatter = (v) => v.toLocaleString(), color }: BarChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.value)) || 1

  return (
    <div>
      <div className="flex items-end gap-3" style={{ height }}>
        {data.map((d, i) => {
          const barColor = color ?? PALETTE[i % PALETTE.length]
          const pct = (d.value / max) * 100
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-2 h-full">
              <div className="relative flex w-full flex-1 items-end justify-center">
                {hoverIndex === i && (
                  <div className="absolute -top-7 rounded-md bg-surface-container-high px-2 py-1 text-xs font-semibold text-on-surface shadow-elevation-2 whitespace-nowrap">
                    {valueFormatter(d.value)}
                  </div>
                )}
                <div
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className={cn(
                    'w-full max-w-9 rounded-t-[4px] transition-opacity',
                    hoverIndex !== null && hoverIndex !== i && 'opacity-60',
                  )}
                  style={{ height: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-3 border-t border-outline-variant/70 pt-2">
        {data.map((d) => (
          <p key={d.label} className="flex-1 truncate text-center text-xs font-medium text-on-surface-variant">
            {d.label}
          </p>
        ))}
      </div>
    </div>
  )
}
