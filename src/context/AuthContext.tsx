import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as authService from '@/services/authService'
import type { AuthCredentials, RegisterPayload, User } from '@/types/user'

const STORAGE_KEY = 'farm-bhade-user'

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
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User)
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsInitializing(false)
  }, [])

  const persist = useCallback((next: User | null) => {
    setUser(next)
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      const loggedInUser = await authService.login(credentials)
      persist(loggedInUser)
      return loggedInUser
    },
    [persist],
  )

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const newUser = await authService.register(payload)
      persist(newUser)
      return newUser
    },
    [persist],
  )

  const logout = useCallback(() => persist(null), [persist])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isInitializing, login, register, logout }),
    [user, isInitializing, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
