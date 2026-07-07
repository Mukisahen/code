import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Package, Handshake, Wallet, Check, X, PlusCircle } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { StatTile } from '@/components/common/StatTile'
import { SectionHeader } from '@/components/common/SectionHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import { MOCK_STORAGE_BATCHES } from '@/mocks/tasks'
import * as marketplaceService from '@/services/marketplaceService'
import { CATEGORY_IMAGES } from '@/mocks/categoryImages'
import { PRODUCT_CATEGORY_LABELS, type Product } from '@/types/product'
import type { Order } from '@/types/order'
import type { ProductOffer, OfferStatus } from '@/types/selling'
import { ROUTES } from '@/constants/routes'
import { formatRelativeTime, formatUGX } from '@/utils/format'
import { cn } from '@/utils/cn'

const OFFER_STATUS_TONE: Record<OfferStatus, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  accepted: 'success',
  declined: 'error',
}

export default function SellingPage() {
  const [offers, setOffers] = useState<ProductOffer[]>([])
  const [activeListings, setActiveListings] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const readyToSell = MOCK_STORAGE_BATCHES.filter((b) => b.status !== 'at-risk')

  useEffect(() => {
    Promise.all([
      marketplaceService.getMyProducts(),
      marketplaceService.getReceivedOffers(),
      marketplaceService.getSellingOrders(),
    ])
      .then(([products, receivedOffers, sellingOrders]) => {
        setActiveListings(products)
        setOffers(receivedOffers)
        setOrders(sellingOrders)
      })
      .finally(() => setLoading(false))
  }, [])

  const completedSales = orders.filter((o) => o.status === 'completed')
  const seasonRevenue = completedSales.reduce((sum, o) => sum + o.totalAmount, 0)
  const pendingOffers = offers.filter((o) => o.status === 'pending')

  async function decideOffer(id: string, status: OfferStatus) {
    const previous = offers
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    try {
      await marketplaceService.decideOffer(id, status)
    } catch {
      setOffers(previous)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Selling" subtitle="Turn ready stock into sales">
        <InlineSpinner label="Loading your selling activity…" />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Selling"
      subtitle="Turn ready stock into sales"
      actions={
        <Link to={ROUTES.myListings}>
          <Button size="sm" leadingIcon={<PlusCircle className="size-4" />}>
            <span className="hidden sm:inline">New listing</span>
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={Package} label="Ready to sell" value={`${readyToSell.reduce((s, b) => s + b.quantityBags, 0)} bags`} tone="primary" />
        <StatTile icon={ShoppingCart} label="Active listings" value={String(activeListings.length)} tone="secondary" />
        <StatTile icon={Handshake} label="Pending offers" value={String(pendingOffers.length)} tone="tertiary" />
        <StatTile icon={Wallet} label="Revenue this season" value={formatUGX(seasonRevenue)} tone="primary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionHeader title="Ready to sell" subtitle="From your storage batches" seeAllHref={ROUTES.storage} />
          {readyToSell.length === 0 ? (
            <EmptyState icon={Package} title="Nothing ready to sell yet" />
          ) : (
            <div className="space-y-3">
              {readyToSell.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-on-surface">{batch.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {batch.quantityBags} bags &middot; {batch.moistureLevel}% moisture
                    </p>
                  </div>
                  <Link to={ROUTES.myListings}>
                    <Button size="sm" variant="outlined">
                      List for sale
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionHeader title="Active listings" seeAllHref={ROUTES.myListings} />
          {activeListings.length === 0 ? (
            <EmptyState icon={ShoppingCart} title="No active listings yet" />
          ) : (
            <div className="space-y-3">
              {activeListings.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img
                    src={CATEGORY_IMAGES[product.category].sm}
                    alt={PRODUCT_CATEGORY_LABELS[product.category]}
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-on-surface">{product.title}</p>
                    <p className="text-xs text-on-surface-variant">
                      UGX {product.pricePerUnit.toLocaleString()}/{product.unit}
                    </p>
                  </div>
                  <Badge tone="success">Listed</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <SectionHeader title="Offers & negotiations" subtitle="Respond to buyer offers on your listings" />
          {offers.length === 0 ? (
            <EmptyState icon={Handshake} title="No offers yet" />
          ) : (
            <div className="space-y-3">
              {offers.map((offer) => (
                <div key={offer.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-on-surface">{offer.productTitle}</p>
                    <p className="text-sm text-on-surface-variant">
                      {offer.buyerName} offered UGX {offer.offerAmount.toLocaleString()}/{offer.unit} for {offer.quantity}
                    </p>
                    <p className="text-xs text-on-surface-variant">{formatRelativeTime(offer.createdAt)}</p>
                  </div>
                  {offer.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button size="sm" leadingIcon={<Check className="size-4" />} onClick={() => decideOffer(offer.id, 'accepted')}>
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        leadingIcon={<X className="size-4" />}
                        onClick={() => decideOffer(offer.id, 'declined')}
                      >
                        Decline
                      </Button>
                    </div>
                  ) : (
                    <Badge tone={OFFER_STATUS_TONE[offer.status]} className={cn('w-fit')}>
                      {offer.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <SectionHeader title="Recent sales" seeAllHref={ROUTES.orderHistory} />
          {completedSales.length === 0 ? (
            <EmptyState icon={Wallet} title="No completed sales yet" />
          ) : (
            <div className="divide-y divide-outline-variant/60">
              {completedSales.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 text-sm first:pt-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-on-surface">{order.productTitle}</p>
                    <p className="text-xs text-on-surface-variant">
                      {order.counterpartyName} &middot; {order.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-on-surface">{formatUGX(order.totalAmount)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
