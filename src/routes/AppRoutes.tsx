import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { LoadingScreen } from '@/components/common/LoadingScreen'

const SplashScreen = lazy(() => import('@/pages/SplashScreen'))
const LandingPage = lazy(() => import('@/pages/landing/LandingPage'))
const OnboardingPage = lazy(() => import('@/pages/onboarding/OnboardingPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))

const FarmerDashboardPage = lazy(() => import('@/pages/dashboard/FarmerDashboardPage'))
const BuyerDashboardPage = lazy(() => import('@/pages/dashboard/BuyerDashboardPage'))
const ProcessorDashboardPage = lazy(() => import('@/pages/dashboard/ProcessorDashboardPage'))
const AdminDashboardPage = lazy(() => import('@/pages/dashboard/AdminDashboardPage'))

const PlanningPage = lazy(() => import('@/pages/journey/PlanningPage'))
const GrowingPage = lazy(() => import('@/pages/journey/GrowingPage'))
const HarvestingPage = lazy(() => import('@/pages/journey/HarvestingPage'))
const StoragePage = lazy(() => import('@/pages/journey/StoragePage'))
const SellingPage = lazy(() => import('@/pages/journey/SellingPage'))
const ProcessingPage = lazy(() => import('@/pages/journey/ProcessingPage'))

const MarketplacePage = lazy(() => import('@/pages/marketplace/MarketplacePage'))
const ProductDetailsPage = lazy(() => import('@/pages/marketplace/ProductDetailsPage'))
const MyListingsPage = lazy(() => import('@/pages/marketplace/MyListingsPage'))
const BuyerRequestsPage = lazy(() => import('@/pages/marketplace/BuyerRequestsPage'))
const FavoritesPage = lazy(() => import('@/pages/marketplace/FavoritesPage'))
const OrderHistoryPage = lazy(() => import('@/pages/marketplace/OrderHistoryPage'))

const AiCropDoctorPage = lazy(() => import('@/pages/crop-doctor/AiCropDoctorPage'))
const MarketPricesPage = lazy(() => import('@/pages/market/MarketPricesPage'))
const WeatherPage = lazy(() => import('@/pages/market/WeatherPage'))

const MessagesPage = lazy(() => import('@/pages/messages/MessagesPage'))
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))

const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'))
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'))
const SubscriptionPage = lazy(() => import('@/pages/subscription/SubscriptionPage'))

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path={ROUTES.splash} element={<SplashScreen />} />
        <Route path={ROUTES.welcome} element={<LandingPage />} />
        <Route path={ROUTES.onboarding} element={<OnboardingPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />

        <Route
          path={ROUTES.farmerDashboard}
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.buyerDashboard}
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.processorDashboard}
          element={
            <ProtectedRoute allowedRoles={['processor']}>
              <ProcessorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.adminDashboard}
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.planning}
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <PlanningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.growing}
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <GrowingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.harvesting}
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <HarvestingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.storage}
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <StoragePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.selling}
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <SellingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.processing}
          element={
            <ProtectedRoute allowedRoles={['processor']}>
              <ProcessingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.marketplace}
          element={
            <ProtectedRoute allowedRoles={['farmer', 'buyer', 'processor']}>
              <MarketplacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.productDetails}
          element={
            <ProtectedRoute allowedRoles={['farmer', 'buyer', 'processor']}>
              <ProductDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.myListings}
          element={
            <ProtectedRoute allowedRoles={['farmer', 'processor']}>
              <MyListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.buyerRequests}
          element={
            <ProtectedRoute allowedRoles={['farmer', 'buyer', 'processor']}>
              <BuyerRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.favorites}
          element={
            <ProtectedRoute allowedRoles={['farmer', 'buyer', 'processor']}>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.orderHistory}
          element={
            <ProtectedRoute allowedRoles={['farmer', 'buyer', 'processor']}>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.aiCropDoctor}
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <AiCropDoctorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.marketPrices}
          element={
            <ProtectedRoute allowedRoles={['farmer', 'buyer', 'processor']}>
              <MarketPricesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.weather}
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <WeatherPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.messages}
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.notifications}
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.profile}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.settings}
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.reports}
          element={
            <ProtectedRoute allowedRoles={['processor', 'admin']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.analytics}
          element={
            <ProtectedRoute allowedRoles={['processor', 'admin']}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.subscription}
          element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
