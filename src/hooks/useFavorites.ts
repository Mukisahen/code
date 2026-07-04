import { useLocalStorage } from '@/hooks/useLocalStorage'

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>('farm-bhade-favorites', [])

  function toggleFavorite(productId: string) {
    setFavoriteIds(
      favoriteIds.includes(productId)
        ? favoriteIds.filter((id) => id !== productId)
        : [...favoriteIds, productId],
    )
  }

  function isFavorite(productId: string) {
    return favoriteIds.includes(productId)
  }

  return { favoriteIds, toggleFavorite, isFavorite }
}
