import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/theme/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { AppRoutes } from '@/routes/AppRoutes'
import { UpdatePrompt } from '@/components/common/UpdatePrompt'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <UpdatePrompt />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
