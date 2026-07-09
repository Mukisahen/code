import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, MapPin, ShieldCheck, Star, Phone, MessageCircle } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { productDetailsRoute, ROUTES } from '@/constants/routes'
import { PRODUCT_CATEGORY_LABELS, type Product } from '@/types/product'
import { CATEGORY_IMAGES } from '@/mocks/categoryImages'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'
import * as messagesService from '@/services/messagesService'
import { cn } from '@/utils/cn'

export function ProductCard({ product }: { product: Product }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [contacting, setContacting] = useState(false)
  const favorited = isFavorite(product.id)
  const isOwnListing = user?.id === product.seller.id

  async function handleChat(event: React.MouseEvent) {
    event.preventDefault()
    if (contacting) return
    setContacting(true)
    try {
      const conversationId = await messagesService.startDirectConversation(product.seller.id, product.title)
      navigate(ROUTES.messages, { state: { conversationId } })
    } catch {
      // ignore — user can still reach the seller from the product details page
    } finally {
      setContacting(false)
    }
  }

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

        {!isOwnListing && (
          <div className="mt-1 flex items-center gap-2 border-t border-outline-variant/60 pt-2">
            <a
              href={`tel:${product.seller.phone}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Call ${product.seller.name}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-surface-container py-1.5 text-xs font-semibold text-on-surface hover:bg-surface-variant"
            >
              <Phone className="size-3.5" /> Call
            </a>
            <button
              onClick={handleChat}
              disabled={contacting}
              aria-label={`Message ${product.seller.name}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary-container py-1.5 text-xs font-semibold text-on-primary-container hover:opacity-90 disabled:opacity-60"
            >
              <MessageCircle className="size-3.5" /> Chat
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
