import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/theme/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { AppRoutes } from '@/routes/AppRoutes'
import { UpdatePrompt } from '@/components/common/UpdatePrompt'
import { ToastContainer } from '@/components/common/ToastContainer'
import { useSimulatedNotifications } from '@/hooks/useSimulatedNotifications'

function AppShell() {
  useSimulatedNotifications()
  return (
    <>
      <AppRoutes />
      <UpdatePrompt />
      <ToastContainer />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
