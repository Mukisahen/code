import { useId, useState } from 'react'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  valueFormatter?: (value: number) => string
}

export function Sparkline({
  data,
  width = 240,
  height = 64,
  color = 'var(--color-primary)',
  valueFormatter = (v) => v.toLocaleString(),
}: SparklineProps) {
  const gradientId = useId()
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const padding = 4
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return { x, y, value }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  const hovered = hoverIndex !== null ? points[hoverIndex] : null

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        onMouseLeave={() => setHoverIndex(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const ratio = (e.clientX - rect.left) / rect.width
          const index = Math.round(ratio * (data.length - 1))
          setHoverIndex(Math.min(data.length - 1, Math.max(0, index)))
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={0}
              y2={height}
              stroke="var(--color-outline-variant)"
              strokeWidth={1}
            />
            <circle cx={hovered.x} cy={hovered.y} r={4} fill={color} stroke="var(--color-surface)" strokeWidth={2} />
          </>
        )}
        {!hovered && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={4}
            fill={color}
            stroke="var(--color-surface)"
            strokeWidth={2}
          />
        )}
      </svg>
      {hovered && (
        <div
          className="pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full rounded-md bg-surface-container-high px-2 py-1 text-xs font-semibold text-on-surface shadow-elevation-2"
          style={{ left: `${(hovered.x / width) * 100}%` }}
        >
          {valueFormatter(hovered.value)}
        </div>
      )}
    </div>
  )
}
