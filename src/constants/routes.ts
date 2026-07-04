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
  marketplace: '/marketplace',
  aiCropDoctor: '/ai-crop-doctor',
  marketPrices: '/market-prices',
  weather: '/weather',
  messages: '/messages',
  notifications: '/notifications',
  profile: '/profile',
  settings: '/settings',

  notFound: '/404',
} as const

export type RouteKey = keyof typeof ROUTES
