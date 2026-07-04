import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leadingIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leadingIcon, id, type, className, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-on-surface-variant">
            {label}
          </label>
        )}
        <div className="relative">
          {leadingIcon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={!!error}
            className={cn(
              'h-12 w-full rounded-md border bg-surface px-4 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/70',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              error ? 'border-error focus:border-error focus:ring-error/20' : 'border-outline-variant',
              leadingIcon && 'pl-11',
              isPassword && 'pr-11',
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-error">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-on-surface-variant">{helperText}</p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
