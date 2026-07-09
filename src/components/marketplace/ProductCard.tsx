import { Link } from 'react-router-dom'
import { Heart, MapPin, ShieldCheck, Star } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { productDetailsRoute } from '@/constants/routes'
import { PRODUCT_CATEGORY_LABELS, type Product } from '@/types/product'
import { CATEGORY_IMAGES } from '@/mocks/categoryImages'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/utils/cn'

export function ProductCard({ product }: { product: Product }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(product.id)

  return (
    <Card className="group relative flex flex-col gap-0 overflow-hidden p-0">
      <Link to={productDetailsRoute(product.id)}>
        <div className="relative flex h-36 items-end" style={{ backgroundColor: product.imageColor }}>
          <img
            src={CATEGORY_IMAGES[product.category].sm}
            alt={PRODUCT_CATEGORY_LABELS[product.category]}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
          <span className="relative m-2 rounded-md bg-black/50 px-2 py-1 text-xs font-semibold text-white">
            {PRODUCT_CATEGORY_LABELS[product.category]}
          </span>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault()
          toggleFavorite(product.id)
        }}
        aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
        className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-surface/90 shadow-elevation-1"
      >
        <Heart className={cn('size-4', favorited ? 'fill-error text-error' : 'text-on-surface-variant')} />
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link to={productDetailsRoute(product.id)}>
          <p className="line-clamp-1 font-bold text-on-surface">{product.title}</p>
        </Link>
        <p className="text-sm font-semibold text-primary">
          UGX {product.pricePerUnit.toLocaleString()} / {product.unit}
        </p>
        <p className="flex items-center gap-1 text-xs text-on-surface-variant">
          <MapPin className="size-3.5" /> {product.district}
        </p>
        {(product.variety || product.grade) && (
          <p className="truncate text-xs text-on-surface-variant">
            {[product.variety, product.grade].filter(Boolean).join(' · ')}
          </p>
        )}
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1 truncate text-xs text-on-surface-variant">
            <span className="truncate">{product.seller.name}</span>
            {product.seller.verified && <ShieldCheck className="size-3.5 shrink-0 text-primary" />}
          </span>
          <span className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-on-surface-variant">
            <Star className="size-3.5 fill-secondary text-secondary" /> {product.seller.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Card>
  )
}
