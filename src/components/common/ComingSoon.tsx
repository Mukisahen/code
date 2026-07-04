import { Construction } from 'lucide-react'

export function ComingSoon({ label }: { label: string }) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-outline-variant bg-surface py-16 text-center">
      <Construction className="size-9 text-on-surface-variant" />
      <div>
        <p className="font-semibold text-on-surface">{label}</p>
        <p className="mt-1 text-sm text-on-surface-variant">This module is coming in the next build.</p>
      </div>
    </div>
  )
}
