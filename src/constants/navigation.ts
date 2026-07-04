import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Sprout,
  Wheat,
  Warehouse,
  Store,
  Stethoscope,
  TrendingUp,
  CloudSun,
  MessageCircle,
  Bell,
  User,
  Settings,
  ClipboardList,
  Heart,
  History,
  Users,
  ShieldCheck,
  FileBarChart,
  PieChart,
  CreditCard,
  LifeBuoy,
  Activity,
  ScrollText,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import type { UserRole } from '@/types/user'
import { dashboardRouteForRole } from '@/utils/roleRoutes'

export interface NavItem {
  label: string
  route: string
  icon: LucideIcon
}

const FARMER_NAV: NavItem[] = [
  { label: 'Dashboard', route: ROUTES.farmerDashboard, icon: LayoutDashboard },
  { label: 'Planning', route: ROUTES.planning, icon: Sprout },
  { label: 'Growing', route: ROUTES.growing, icon: Wheat },
  { label: 'Harvesting', route: ROUTES.harvesting, icon: Wheat },
  { label: 'Storage', route: ROUTES.storage, icon: Warehouse },
  { label: 'Marketplace', route: ROUTES.marketplace, icon: Store },
  { label: 'AI Crop Doctor', route: ROUTES.aiCropDoctor, icon: Stethoscope },
  { label: 'Market Prices', route: ROUTES.marketPrices, icon: TrendingUp },
  { label: 'Weather', route: ROUTES.weather, icon: CloudSun },
  { label: 'Messages', route: ROUTES.messages, icon: MessageCircle },
  { label: 'Notifications', route: ROUTES.notifications, icon: Bell },
]

const BUYER_NAV: NavItem[] = [
  { label: 'Dashboard', route: ROUTES.buyerDashboard, icon: LayoutDashboard },
  { label: 'Marketplace', route: ROUTES.marketplace, icon: Store },
  { label: 'My Requests', route: ROUTES.buyerRequests, icon: ClipboardList },
  { label: 'Favourites', route: ROUTES.favorites, icon: Heart },
  { label: 'Order History', route: ROUTES.orderHistory, icon: History },
  { label: 'Market Prices', route: ROUTES.marketPrices, icon: TrendingUp },
  { label: 'Messages', route: ROUTES.messages, icon: MessageCircle },
  { label: 'Notifications', route: ROUTES.notifications, icon: Bell },
]

const PROCESSOR_NAV: NavItem[] = [
  { label: 'Dashboard', route: ROUTES.processorDashboard, icon: LayoutDashboard },
  { label: 'Marketplace', route: ROUTES.marketplace, icon: Store },
  { label: 'My Requests', route: ROUTES.buyerRequests, icon: ClipboardList },
  { label: 'Order History', route: ROUTES.orderHistory, icon: History },
  { label: 'Reports', route: ROUTES.reports, icon: FileBarChart },
  { label: 'Analytics', route: ROUTES.analytics, icon: PieChart },
  { label: 'Messages', route: ROUTES.messages, icon: MessageCircle },
  { label: 'Notifications', route: ROUTES.notifications, icon: Bell },
]

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', route: ROUTES.adminDashboard, icon: LayoutDashboard },
  { label: 'Users', route: ROUTES.adminDashboard + '#users', icon: Users },
  { label: 'Marketplace', route: ROUTES.adminDashboard + '#marketplace', icon: Store },
  { label: 'Verification', route: ROUTES.adminDashboard + '#verification', icon: ShieldCheck },
  { label: 'Reports', route: ROUTES.reports, icon: FileBarChart },
  { label: 'Analytics', route: ROUTES.analytics, icon: PieChart },
  { label: 'Subscriptions', route: ROUTES.adminDashboard + '#subscriptions', icon: CreditCard },
  { label: 'Support', route: ROUTES.adminDashboard + '#support', icon: LifeBuoy },
  { label: 'Audit Logs', route: ROUTES.adminDashboard + '#audit-logs', icon: ScrollText },
  { label: 'System Health', route: ROUTES.adminDashboard + '#system-health', icon: Activity },
]

const COMMON_TAIL: NavItem[] = [
  { label: 'Profile', route: ROUTES.profile, icon: User },
  { label: 'Settings', route: ROUTES.settings, icon: Settings },
]

export function getNavItemsForRole(role: UserRole): NavItem[] {
  switch (role) {
    case 'farmer':
      return [...FARMER_NAV, ...COMMON_TAIL]
    case 'buyer':
      return [...BUYER_NAV, ...COMMON_TAIL]
    case 'processor':
      return [...PROCESSOR_NAV, ...COMMON_TAIL]
    case 'admin':
      return [...ADMIN_NAV, ...COMMON_TAIL]
  }
}

export function getBottomNavItemsForRole(role: UserRole): NavItem[] {
  const dashboard = { label: 'Home', route: dashboardRouteForRole(role), icon: LayoutDashboard }
  switch (role) {
    case 'farmer':
      return [
        dashboard,
        { label: 'Planning', route: ROUTES.planning, icon: Sprout },
        { label: 'Market', route: ROUTES.marketplace, icon: Store },
        { label: 'Crop Doctor', route: ROUTES.aiCropDoctor, icon: Stethoscope },
        { label: 'Profile', route: ROUTES.profile, icon: User },
      ]
    case 'buyer':
      return [
        dashboard,
        { label: 'Market', route: ROUTES.marketplace, icon: Store },
        { label: 'Requests', route: ROUTES.buyerRequests, icon: ClipboardList },
        { label: 'Messages', route: ROUTES.messages, icon: MessageCircle },
        { label: 'Profile', route: ROUTES.profile, icon: User },
      ]
    case 'processor':
      return [
        dashboard,
        { label: 'Market', route: ROUTES.marketplace, icon: Store },
        { label: 'Reports', route: ROUTES.reports, icon: FileBarChart },
        { label: 'Messages', route: ROUTES.messages, icon: MessageCircle },
        { label: 'Profile', route: ROUTES.profile, icon: User },
      ]
    case 'admin':
      return [
        dashboard,
        { label: 'Users', route: ROUTES.adminDashboard + '#users', icon: Users },
        { label: 'Reports', route: ROUTES.reports, icon: FileBarChart },
        { label: 'Support', route: ROUTES.adminDashboard + '#support', icon: LifeBuoy },
        { label: 'Profile', route: ROUTES.profile, icon: User },
      ]
  }
}
