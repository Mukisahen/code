import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Heart,
  Phone,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Star,
  Package,
  CheckCircle2,
} from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Avatar } from '@/components/common/Avatar'
import { EmptyState } from '@/components/common/EmptyState'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import * as marketplaceService from '@/services/marketplaceService'
import { CATEGORY_IMAGES } from '@/mocks/categoryImages'
import { PRODUCT_CATEGORY_LABELS, type Product } from '@/types/product'
import { useFavorites } from '@/hooks/useFavorites'
import { ROUTES } from '@/constants/routes'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'

export default function ProductDetailsPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const [offerSent, setOfferSent] = useState(false)
  const [offerError, setOfferError] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setProductNotFound] = useState(false)

  useEffect(() => {
    if (!productId) return
    let cancelled = false

    marketplaceService
      .getProduct(productId)
      .then((result) => {
        if (!cancelled) setProduct(result)
      })
      .catch(() => {
        if (!cancelled) setProductNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [productId])

  if (loading) {
    return (
      <DashboardLayout title="Product Details">
        <InlineSpinner label="Loading listing…" />
      </DashboardLayout>
    )
  }

  if (notFound || !product) {
    return (
      <DashboardLayout title="Product not found">
        <EmptyState
          icon={Package}
          title="This listing no longer exists"
          description="It may have been sold or removed."
          action={
            <Link to={ROUTES.marketplace}>
              <Button>Back to Marketplace</Button>
            </Link>
          }
        />
      </DashboardLayout>
    )
  }

  const favorited = isFavorite(product.id)

  async function handleOffer(event: FormEvent) {
    event.preventDefault()
    if (!offerAmount.trim() || !product) return
    setOfferError(null)
    try {
      await marketplaceService.createOffer({
        productId: product.id,
        offerAmount: Number(offerAmount),
        unit: product.unit,
        quantity: offerMessage.trim() || `1 ${product.unit}`,
      })
      setOfferSent(true)
    } catch {
      setOfferError('Could not send your offer. Please try again.')
    }
  }

  return (
    <DashboardLayout title="Product Details">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="relative flex h-56 items-end sm:h-72" style={{ backgroundColor: product.imageColor }}>
              <img
                src={CATEGORY_IMAGES[product.category].full}
                alt={PRODUCT_CATEGORY_LABELS[product.category]}
                className="absolute inset-0 size-full object-cover"
              />
              <span className="relative m-3 rounded-md bg-black/50 px-3 py-1.5 text-sm font-semibold text-white sm:text-lg">
                {PRODUCT_CATEGORY_LABELS[product.category]}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-on-surface sm:text-2xl">{product.title}</h1>
                  <p className="mt-1 flex items-center gap-1 text-sm text-on-surface-variant">
                    <MapPin className="size-4" /> {product.district}
                    <span className="mx-1">&middot;</span>
                    Posted {formatRelativeTime(product.postedAt)}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  aria-label="Toggle favourite"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container"
                >
                  <Heart className={cn('size-5', favorited ? 'fill-error text-error' : 'text-on-surface-variant')} />
                </button>
              </div>

              <p className="mt-4 text-2xl font-bold text-primary">
                UGX {product.pricePerUnit.toLocaleString()}{' '}
                <span className="text-sm font-medium text-on-surface-variant">/ {product.unit}</span>
              </p>
              <p className="text-sm text-on-surface-variant">
                {product.quantityAvailable.toLocaleString()} {product.unit}s available
              </p>

              <p className="mt-4 text-sm text-on-surface">{product.description}</p>
            </div>
          </Card>

          <Card className="mt-5">
            <h2 className="font-bold text-on-surface">Make an offer</h2>
            {offerSent ? (
              <div className="mt-3 flex items-center gap-2 rounded-md bg-primary-container px-3.5 py-2.5 text-sm text-on-primary-container">
                <CheckCircle2 className="size-4.5 shrink-0" />
                Your offer of UGX {Number(offerAmount).toLocaleString()} was sent to {product.seller.name}.
              </div>
            ) : (
              <form onSubmit={handleOffer} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
                <Input
                  type="number"
                  placeholder="Your offer (UGX)"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="sm:max-w-[200px]"
                  required
                />
                <Input
                  placeholder="Message (optional)"
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  className="flex-1"
                  error={offerError ?? undefined}
                />
                <Button type="submit">Send Offer</Button>
              </form>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center gap-3">
              <Avatar initials={product.seller.avatarInitials} size="lg" />
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate font-bold text-on-surface">
                  {product.seller.name}
                  {product.seller.verified && <ShieldCheck className="size-4 shrink-0 text-primary" />}
                </p>
                <p className="text-xs capitalize text-on-surface-variant">{product.seller.role}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="flex items-center gap-1 font-semibold text-on-surface">
                  <Star className="size-4 fill-secondary text-secondary" /> {product.seller.rating}
                </p>
                <p className="text-xs text-on-surface-variant">Rating</p>
              </div>
              <div>
                <p className="font-semibold text-on-surface">{product.seller.totalSales}</p>
                <p className="text-xs text-on-surface-variant">Sales completed</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-on-surface">{product.district}</p>
                <p className="text-xs text-on-surface-variant">District</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <Link to={ROUTES.messages}>
                <Button fullWidth leadingIcon={<MessageCircle className="size-4" />}>
                  Chat with seller
                </Button>
              </Link>
              <a href={`tel:${product.seller.phone}`}>
                <Button variant="outlined" fullWidth leadingIcon={<Phone className="size-4" />}>
                  Call {product.seller.phone}
                </Button>
              </a>
            </div>

            {!product.seller.verified && (
              <Badge tone="warning" className="mt-4 w-full justify-center">
                Unverified seller — trade with caution
              </Badge>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
