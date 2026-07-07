import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { EmptyState } from '@/components/common/EmptyState'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import { Button } from '@/components/common/Button'
import * as marketplaceService from '@/services/marketplaceService'
import type { Product } from '@/types/product'
import { ROUTES } from '@/constants/routes'

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    marketplaceService
      .listFavorites()
      .then(setFavoriteProducts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout title="Favourites" subtitle="Products you've saved for later">
      {loading ? (
        <InlineSpinner label="Loading favourites…" />
      ) : favoriteProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favourites yet"
          description="Tap the heart icon on any listing to save it here."
          action={
            <Link to={ROUTES.marketplace}>
              <Button>Browse Marketplace</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
