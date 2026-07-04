import { Link } from 'react-router-dom'
import { Store, ClipboardList, MessageCircle, TrendingUp, Heart, PackageCheck } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { StatTile } from '@/components/common/StatTile'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Badge } from '@/components/common/Badge'
import { LiveBadge } from '@/components/common/LiveBadge'
import { useAuth } from '@/hooks/useAuth'
import { useLivePrices } from '@/hooks/useLivePrices'
import { ROUTES } from '@/constants/routes'
import { MOCK_BUYER_REQUESTS, MOCK_ORDERS } from '@/mocks/orders'
import { MOCK_MARKET_PRICES } from '@/mocks/marketPrices'
import { MOCK_PRODUCTS } from '@/mocks/products'
import { useFavorites } from '@/hooks/useFavorites'
import { formatRelativeTime, formatUGX } from '@/utils/format'
import { cn } from '@/utils/cn'

const QUICK_ACTIONS = [
  { label: 'Marketplace', href: ROUTES.marketplace, icon: Store, tone: 'primary' as const },
  { label: 'Post Request', href: ROUTES.buyerRequests, icon: ClipboardList, tone: 'secondary' as const },
  { label: 'Messages', href: ROUTES.messages, icon: MessageCircle, tone: 'tertiary' as const },
  { label: 'Market Prices', href: ROUTES.marketPrices, icon: TrendingUp, tone: 'primary' as const },
]

const actionTone = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
}

export default function BuyerDashboardPage() {
  const { user } = useAuth()
  const { favoriteIds } = useFavorites()
  const myRequests = MOCK_BUYER_REQUESTS.filter((r) => r.status !== 'closed').slice(0, 3)
  const recentOrders = MOCK_ORDERS.slice(0, 3)
  const favoriteProducts = MOCK_PRODUCTS.filter((p) => favoriteIds.includes(p.id))
  const { prices: livePrices, lastUpdated } = useLivePrices(MOCK_MARKET_PRICES)
  const topPrices = livePrices.slice(0, 3)

  return (
    <DashboardLayout title="Buyer Dashboard" subtitle={`Welcome back, ${user?.fullName}`}>
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ label, href, icon: Icon, tone }) => (
          <Link
            key={label}
            to={href}
            className="flex flex-col items-center gap-2 rounded-lg bg-surface p-3 text-center shadow-elevation-1 transition-transform hover:-translate-y-0.5"
          >
            <span className={cn('flex size-11 items-center justify-center rounded-full', actionTone[tone])}>
              <Icon className="size-5" />
            </span>
            <span className="text-xs font-semibold text-on-surface">{label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile icon={ClipboardList} label="Open requests" value={String(myRequests.length)} tone="primary" />
        <StatTile icon={PackageCheck} label="Orders completed" value={String(MOCK_ORDERS.filter((o) => o.status === 'completed').length)} tone="secondary" />
        <StatTile icon={Heart} label="Favourite listings" value={String(favoriteProducts.length)} tone="tertiary" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeader title="My open requests" seeAllHref={ROUTES.buyerRequests} />
          <div className="space-y-3">
            {myRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-on-surface">
                    {req.category} &middot; {req.quantityNeeded}
                  </p>
                  <p className="text-xs text-on-surface-variant">{formatRelativeTime(req.postedAt)}</p>
                </div>
                <Badge tone={req.status === 'open' ? 'success' : 'warning'}>{req.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <SectionHeader title="Market prices" seeAllHref={ROUTES.marketPrices} right={<LiveBadge lastUpdated={lastUpdated} />} />
          <ul className="space-y-3">
            {topPrices.map((price) => (
              <li key={price.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-on-surface">{price.category}</p>
                  <p className="text-xs text-on-surface-variant">{price.district}</p>
                </div>
                <p className="font-semibold text-on-surface">UGX {price.pricePerKg.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <SectionHeader title="Recent orders" seeAllHref={ROUTES.orderHistory} />
          <div className="divide-y divide-outline-variant/60">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-sm">
                <div>
                  <p className="font-semibold text-on-surface">{order.productTitle}</p>
                  <p className="text-xs text-on-surface-variant">{order.counterpartyName} &middot; {order.quantity}</p>
                </div>
                <p className="font-semibold text-on-surface">{formatUGX(order.totalAmount)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
