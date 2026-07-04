import { Sprout } from 'lucide-react'
import { cn } from '@/utils/cn'
import { APP_NAME } from '@/constants/app'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  withWordmark?: boolean
  className?: string
}

const sizeMap = {
  sm: { box: 'size-8', icon: 'size-4.5', text: 'text-base' },
  md: { box: 'size-11', icon: 'size-6', text: 'text-xl' },
  lg: { box: 'size-16', icon: 'size-9', text: 'text-3xl' },
}

export function Logo({ size = 'md', withWordmark = true, className }: LogoProps) {
  const s = sizeMap[size]
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-on-primary shadow-elevation-1',
          s.box,
        )}
      >
        <Sprout className={s.icon} strokeWidth={2.25} />
      </span>
      {withWordmark && (
        <span className={cn('font-extrabold tracking-tight text-on-surface', s.text)}>
          {APP_NAME}
        </span>
      )}
    </div>
  )
}
