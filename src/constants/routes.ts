export const ROUTES = {
  splash: '/',
  welcome: '/welcome',
  onboarding: '/onboarding',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',

  farmerDashboard: '/farmer',
  buyerDashboard: '/buyer',
  processorDashboard: '/processor',
  adminDashboard: '/admin',

  planning: '/planning',
  growing: '/growing',
  harvesting: '/harvesting',
  storage: '/storage',
  selling: '/selling',
  processing: '/processing',

  marketplace: '/marketplace',
  productDetails: '/marketplace/:productId',
  myListings: '/marketplace/my-listings',
  buyerRequests: '/marketplace/buyer-requests',
  favorites: '/marketplace/favorites',
  orderHistory: '/marketplace/orders',

  aiCropDoctor: '/ai-crop-doctor',
  marketPrices: '/market-prices',
  weather: '/weather',
  messages: '/messages',
  notifications: '/notifications',
  reports: '/reports',
  analytics: '/analytics',
  subscription: '/subscription',
  profile: '/profile',
  settings: '/settings',
  about: '/about',

  notFound: '/404',
} as const

export type RouteKey = keyof typeof ROUTES

export function productDetailsRoute(productId: string): string {
  return `/marketplace/${productId}`
}
