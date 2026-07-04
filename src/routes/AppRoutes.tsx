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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
