import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PROMO_SLIDES } from '@/mocks/promos'
import { cn } from '@/utils/cn'

const ROTATE_MS = 5500

const toneStyles = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
}

export function PromoBanner() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % PROMO_SLIDES.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [paused])

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-elevation-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {PROMO_SLIDES.map(({ id, icon: Icon, text, href, tone }) => (
          <Link
            key={id}
            to={href}
            className={cn('flex w-full shrink-0 items-center gap-3 px-4 py-3', toneStyles[tone])}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface/50">
              <Icon className="size-4.5" />
            </span>
            <p className="min-w-0 flex-1 truncate text-sm font-semibold">{text}</p>
          </Link>
        ))}
      </div>

      <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1.5">
        {PROMO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setIndex(i)}
            aria-label={`Show promo ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === index ? 'w-4 bg-on-surface/70' : 'w-1.5 bg-on-surface/30',
            )}
          />
        ))}
      </div>
    </div>
  )
}
