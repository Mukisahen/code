import { Loader2 } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm text-on-surface-variant">Loading Farm Bhade&hellip;</p>
    </div>
  )
}
