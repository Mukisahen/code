import { useEffect, useState } from 'react'

export function LiveBadge({ lastUpdated }: { lastUpdated: number }) {
  const [, forceTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const secondsAgo = Math.max(0, Math.round((Date.now() - lastUpdated) / 1000))
  const label = secondsAgo < 1 ? 'just now' : `${secondsAgo}s ago`

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      Live &middot; updated {label}
    </span>
  )
}
