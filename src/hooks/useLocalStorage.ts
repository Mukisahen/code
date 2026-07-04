import { useCallback, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (next: T) => {
      setValue(next)
      window.localStorage.setItem(key, JSON.stringify(next))
    },
    [key],
  )

  return [value, setStoredValue] as const
}
