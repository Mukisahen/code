import { useCallback, useEffect, useState } from 'react'
import * as marketplaceService from '@/services/marketplaceService'

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    marketplaceService
      .listFavorites()
      .then((products) => setFavoriteIds(products.map((p) => p.id)))
      .catch(() => {})
  }, [])

  const isFavorite = useCallback((productId: string) => favoriteIds.includes(productId), [favoriteIds])

  const toggleFavorite = useCallback(
    (productId: string) => {
      const currentlyFavorited = favoriteIds.includes(productId)
      setFavoriteIds((prev) => (currentlyFavorited ? prev.filter((id) => id !== productId) : [...prev, productId]))

      const request = currentlyFavorited
        ? marketplaceService.removeFavorite(productId)
        : marketplaceService.addFavorite(productId)

      request.catch(() => {
        setFavoriteIds((prev) => (currentlyFavorited ? [...prev, productId] : prev.filter((id) => id !== productId)))
      })
    },
    [favoriteIds],
  )

  return { favoriteIds, toggleFavorite, isFavorite }
}
