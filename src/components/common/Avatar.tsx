import { cn } from '@/utils/cn'

interface AvatarProps {
  initials: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'primary' | 'secondary'
  className?: string
}

const sizeStyles = {
  sm: 'size-9 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-16 text-lg',
}

const toneStyles = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
}

export function Avatar({ initials, imageUrl, size = 'md', tone = 'primary', className }: AvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className={cn('inline-block shrink-0 rounded-full object-cover', sizeStyles[size], className)}
      />
    )
  }

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold',
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {initials}
    </span>
  )
}
