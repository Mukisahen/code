import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as authService from '@/services/authService'
import { getToken, setToken } from '@/lib/apiClient'
import type { AuthCredentials, RegisterPayload, User } from '@/types/user'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (credentials: AuthCredentials) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function rehydrate() {
      if (!getToken()) {
        setIsInitializing(false)
        return
      }
      try {
        const current = await authService.fetchCurrentUser()
        if (!cancelled) setUser(current)
      } catch {
        setToken(null)
      } finally {
        if (!cancelled) setIsInitializing(false)
      }
    }

    rehydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials: AuthCredentials) => {
    const loggedInUser = await authService.login(credentials)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const newUser = await authService.register(payload)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isInitializing, login, register, logout }),
    [user, isInitializing, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
