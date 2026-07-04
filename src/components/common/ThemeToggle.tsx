import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high',
        className,
      )}
    >
      {mode === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </button>
  )
}
