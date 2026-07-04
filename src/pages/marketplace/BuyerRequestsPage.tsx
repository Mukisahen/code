import { useState, type FormEvent } from 'react'
import { PlusCircle, ClipboardList } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { EmptyState } from '@/components/common/EmptyState'
import { MOCK_BUYER_REQUESTS } from '@/mocks/orders'
import type { BuyerRequest, BuyerRequestStatus } from '@/types/order'
import { useAuth } from '@/hooks/useAuth'
import { formatRelativeTime } from '@/utils/format'

const STATUS_TONE: Record<BuyerRequestStatus, 'neutral' | 'warning' | 'success' | 'error'> = {
  open: 'success',
  negotiating: 'warning',
  fulfilled: 'neutral',
  closed: 'error',
}

export default function BuyerRequestsPage() {
  const { user } = useAuth()
  const canPostRequests = user?.role === 'buyer' || user?.role === 'processor'
  const [requests, setRequests] = useState<BuyerRequest[]>(MOCK_BUYER_REQUESTS)
  const [isAdding, setIsAdding] = useState(false)
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [targetPrice, setTargetPrice] = useState('')

  function handleAdd(event: FormEvent) {
    event.preventDefault()
    if (!category.trim() || !quantity.trim() || !user) return
    setRequests((prev) => [
      {
        id: `req-${Date.now()}`,
        buyerName: user.fullName,
        district: user.district,
        category,
        quantityNeeded: quantity,
        targetPrice: Number(targetPrice) || 0,
        notes: '',
        status: 'open',
        postedAt: new Date().toISOString(),
      },
      ...prev,
    ])
    setCategory('')
    setQuantity('')
    setTargetPrice('')
    setIsAdding(false)
  }

  return (
    <DashboardLayout
      title={canPostRequests ? 'My Requests' : 'Buyer Requests'}
      subtitle={
        canPostRequests
          ? 'Post what you need and let farmers respond'
          : 'Browse open requests from buyers and processors'
      }
      actions={
        canPostRequests ? (
          <Button size="sm" leadingIcon={<PlusCircle className="size-4" />} onClick={() => setIsAdding((v) => !v)}>
            <span className="hidden sm:inline">New request</span>
          </Button>
        ) : undefined
      }
    >
      {isAdding && (
        <Card className="mb-5">
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input placeholder="Category, e.g. Dry Grain" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <Input placeholder="Quantity, e.g. 5,000 kg" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            <Input
              type="number"
              placeholder="Target price (UGX/kg)"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
            <Button type="submit" className="sm:col-span-3">
              Post request
            </Button>
          </form>
        </Card>
      )}

      {requests.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No requests yet" />
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-on-surface">
                  {req.category} &middot; {req.quantityNeeded}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {req.buyerName} &middot; {req.district} &middot; {formatRelativeTime(req.postedAt)}
                </p>
                {req.notes && <p className="mt-1 text-sm text-on-surface-variant">{req.notes}</p>}
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                {req.targetPrice > 0 && (
                  <p className="text-sm font-semibold text-on-surface">UGX {req.targetPrice.toLocaleString()}/kg</p>
                )}
                <Badge tone={STATUS_TONE[req.status]}>{req.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
