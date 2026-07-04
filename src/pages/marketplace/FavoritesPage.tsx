import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/common/Button'
import { MOCK_PRODUCTS } from '@/mocks/products'
import { useFavorites } from '@/hooks/useFavorites'
import { ROUTES } from '@/constants/routes'

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites()
  const favoriteProducts = MOCK_PRODUCTS.filter((p) => favoriteIds.includes(p.id))

  return (
    <DashboardLayout title="Favourites" subtitle="Products you've saved for later">
      {favoriteProducts.length === 0 ? (
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
