import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw, WifiOff } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      registration?.update()
    },
  })

  useEffect(() => {
    if (!offlineReady) return
    const timer = setTimeout(() => setOfflineReady(false), 4000)
    return () => clearTimeout(timer)
  }, [offlineReady, setOfflineReady])

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md animate-slide-up items-center gap-3 rounded-lg bg-surface-container-high px-4 py-3.5 shadow-elevation-3 sm:inset-x-auto sm:right-4">
      {needRefresh ? (
        <>
          <RefreshCw className="size-5 shrink-0 text-primary" />
          <p className="flex-1 text-sm text-on-surface">A new version of Farm Bhade is available.</p>
          <Button size="sm" onClick={() => updateServiceWorker(true)}>
            Reload
          </Button>
          <button
            onClick={() => setNeedRefresh(false)}
            className="text-xs font-semibold text-on-surface-variant"
          >
            Later
          </button>
        </>
      ) : (
        <>
          <WifiOff className="size-5 shrink-0 text-primary" />
          <p className="flex-1 text-sm text-on-surface">Farm Bhade is ready to work offline.</p>
        </>
      )}
    </div>
  )
}
