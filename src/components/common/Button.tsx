import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

type Variant = 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  filled: 'bg-primary text-on-primary hover:brightness-110 active:brightness-95 shadow-elevation-1',
  tonal: 'bg-primary-container text-on-primary-container hover:brightness-105',
  outlined: 'border border-outline text-primary hover:bg-primary-container/40',
  text: 'text-primary hover:bg-primary-container/40',
  elevated: 'bg-surface-container-low text-primary shadow-elevation-2 hover:shadow-elevation-3',
  danger: 'bg-error text-on-error hover:brightness-110',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-13 px-8 text-base gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'filled',
      size = 'md',
      fullWidth,
      loading,
      leadingIcon,
      trailingIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-150',
          'disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          leadingIcon
        )}
        {children}
        {!loading && trailingIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'
