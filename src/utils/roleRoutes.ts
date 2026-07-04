import { ROUTES } from '@/constants/routes'
import type { UserRole } from '@/types/user'

export function dashboardRouteForRole(role: UserRole): string {
  switch (role) {
    case 'farmer':
      return ROUTES.farmerDashboard
    case 'buyer':
      return ROUTES.buyerDashboard
    case 'processor':
      return ROUTES.processorDashboard
    case 'admin':
      return ROUTES.adminDashboard
  }
}
