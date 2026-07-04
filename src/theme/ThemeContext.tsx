import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
  mode: ThemeMode
  toggleMode: () => void
  setMode: (mode: ThemeMode) => void
}

const STORAGE_KEY = 'farm-bhade-theme'

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    root.style.colorScheme = mode
    window.localStorage.setItem(STORAGE_KEY, mode)

    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', mode === 'dark' ? '#10140F' : '#1E7A34')
  }, [mode])

  const setMode = useCallback((next: ThemeMode) => setModeState(next), [])
  const toggleMode = useCallback(() => setModeState((prev) => (prev === 'light' ? 'dark' : 'light')), [])

  const value = useMemo(() => ({ mode, toggleMode, setMode }), [mode, toggleMode, setMode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
