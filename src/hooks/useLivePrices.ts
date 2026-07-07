import { useEffect, useRef, useState } from 'react'
import type { MarketPriceEntry } from '@/types/marketPrice'

const TICK_MS = 6000
const MAX_NUDGE_PERCENT = 0.4

export function useLivePrices(initial: MarketPriceEntry[]) {
  const [prices, setPrices] = useState(initial)
  const [lastUpdated, setLastUpdated] = useState(() => Date.now())
  const initialRef = useRef(initial)

  useEffect(() => {
    initialRef.current = initial
    setPrices(initial)
  }, [initial])

  useEffect(() => {
    const id = setInterval(() => {
      setPrices((prev) =>
        prev.map((entry) => {
          const nudge = (Math.random() * 2 - 1) * MAX_NUDGE_PERCENT
          const nextPrice = Math.max(1, Math.round(entry.pricePerKg * (1 + nudge / 100)))
          const baseline = initialRef.current.find((e) => e.id === entry.id)?.pricePerKg ?? entry.pricePerKg
          const changePercent = Math.round(((nextPrice - baseline) / baseline) * 1000) / 10
          return { ...entry, pricePerKg: nextPrice, changePercent, updatedAt: new Date().toISOString() }
        }),
      )
      setLastUpdated(Date.now())
    }, TICK_MS)
    return () => clearInterval(id)
  }, [])

  return { prices, lastUpdated }
}
