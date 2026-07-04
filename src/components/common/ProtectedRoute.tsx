import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { dashboardRouteForRole } from '@/utils/roleRoutes'
import type { UserRole } from '@/types/user'
import { LoadingScreen } from '@/components/common/LoadingScreen'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) return <LoadingScreen />

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={dashboardRouteForRole(user.role)} replace />
  }

  return <>{children}</>
}
