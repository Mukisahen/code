import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { ROUTES } from '@/constants/routes'
import { APP_NAME, APP_TAGLINE } from '@/constants/app'
import { dashboardRouteForRole } from '@/utils/roleRoutes'

const SPLASH_DURATION_MS = 1400

export default function SplashScreen() {
  const navigate = useNavigate()
  const { user, isInitializing } = useAuth()
  const [hasSeenOnboarding] = useLocalStorage('farm-bhade-onboarding-seen', false)

  useEffect(() => {
    if (isInitializing) return

    const timer = setTimeout(() => {
      if (user) {
        navigate(dashboardRouteForRole(user.role), { replace: true })
      } else if (hasSeenOnboarding) {
        navigate(ROUTES.login, { replace: true })
      } else {
        navigate(ROUTES.welcome, { replace: true })
      }
    }, SPLASH_DURATION_MS)

    return () => clearTimeout(timer)
  }, [navigate, user, isInitializing, hasSeenOnboarding])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-gradient-to-br from-primary to-primary/80 text-on-primary">
      <div className="flex size-24 animate-scale-in items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm">
        <Sprout className="size-12" strokeWidth={2} />
      </div>
      <div className="animate-fade-in text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">{APP_NAME}</h1>
        <p className="mt-1 text-sm font-medium text-on-primary/85">{APP_TAGLINE}</p>
      </div>
      <div className="mt-4 flex gap-1.5" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 animate-bounce rounded-full bg-on-primary/80"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
