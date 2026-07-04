import { useState } from 'react'
import { Check, Crown, Receipt } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { useAuth } from '@/hooks/useAuth'
import { formatUGX } from '@/utils/format'
import { cn } from '@/utils/cn'

const FREE_FEATURES = ['Up to 3 active listings', 'Basic market prices', 'Standard support', 'AI Crop Doctor (3/month)']
const PREMIUM_FEATURES = [
  'Unlimited listings',
  'Real-time price alerts',
  'Priority support & verification',
  'Unlimited AI Crop Doctor scans',
  'Advanced analytics & reports',
  'Featured marketplace placement',
]

const BILLING_HISTORY = [
  { id: 'inv-1', label: 'Premium — Monthly', date: '2026-06-14', amount: 15000 },
  { id: 'inv-2', label: 'Premium — Monthly', date: '2026-05-14', amount: 15000 },
]

export default function SubscriptionPage() {
  const { user } = useAuth()
  const [upgraded, setUpgraded] = useState(user?.subscriptionTier === 'premium')

  return (
    <DashboardLayout title="Subscription" subtitle="Choose the plan that fits your farm business">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className={cn('flex flex-col', !upgraded && 'ring-2 ring-primary')}>
          <p className="font-bold text-on-surface">Free</p>
          <p className="mt-1 text-3xl font-bold text-on-surface">UGX 0</p>
          <p className="text-sm text-on-surface-variant">Forever</p>
          <ul className="mt-4 flex-1 space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-on-surface">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
          {!upgraded && (
            <Badge tone="success" className="mt-4 w-fit">
              Current plan
            </Badge>
          )}
        </Card>

        <Card className={cn('flex flex-col bg-secondary-container/30', upgraded && 'ring-2 ring-secondary')}>
          <p className="flex items-center gap-1.5 font-bold text-on-surface">
            <Crown className="size-4.5 text-secondary" /> Premium
          </p>
          <p className="mt-1 text-3xl font-bold text-on-surface">UGX 15,000</p>
          <p className="text-sm text-on-surface-variant">per month</p>
          <ul className="mt-4 flex-1 space-y-2.5">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-on-surface">
                <Check className="mt-0.5 size-4 shrink-0 text-secondary" /> {f}
              </li>
            ))}
          </ul>
          {upgraded ? (
            <Badge tone="warning" className="mt-4 w-fit">
              Current plan
            </Badge>
          ) : (
            <Button className="mt-4" onClick={() => setUpgraded(true)}>
              Upgrade to Premium
            </Button>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 font-bold text-on-surface">
          <Receipt className="size-4.5" /> Billing history
        </h2>
        {upgraded ? (
          <div className="divide-y divide-outline-variant/60">
            {BILLING_HISTORY.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 text-sm first:pt-0 last:pb-0">
                <div>
                  <p className="font-semibold text-on-surface">{item.label}</p>
                  <p className="text-xs text-on-surface-variant">{item.date}</p>
                </div>
                <p className="font-semibold text-on-surface">{formatUGX(item.amount)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant">No billing history yet — you&apos;re on the free plan.</p>
        )}
      </Card>
    </DashboardLayout>
  )
}
