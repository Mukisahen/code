import { Component, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Logo } from '@/components/common/Logo'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

// Without this, any uncaught render error — or a lazy-loaded route chunk
// that fails to fetch after a redeploy replaces the old build's asset
// files — unmounts the whole React tree with nothing left in #root: a
// blank white screen with no way back in but a manual app restart.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Unhandled render error:', error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center safe-top safe-bottom">
        <Logo size="sm" />
        <AlertTriangle className="size-10 text-error" />
        <div>
          <p className="font-bold text-on-surface">Something went wrong</p>
          <p className="mt-1 max-w-xs text-sm text-on-surface-variant">
            Farm Bhade hit an unexpected error. Reloading usually fixes it.
          </p>
        </div>
        <Button leadingIcon={<RotateCcw className="size-4" />} onClick={() => window.location.reload()}>
          Reload app
        </Button>
      </div>
    )
  }
}
