import { useState, type FormEvent } from 'react'
import { PlusCircle, Pencil, Trash2, Store } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { EmptyState } from '@/components/common/EmptyState'
import { MOCK_PRODUCTS } from '@/mocks/products'
import { CATEGORY_IMAGES } from '@/mocks/categoryImages'
import { PRODUCT_CATEGORY_LABELS, type Product, type ProductCategory } from '@/types/product'
import { useAuth } from '@/hooks/useAuth'

const CATEGORY_OPTIONS = Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][]

export default function MyListingsPage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<Product[]>(MOCK_PRODUCTS.slice(0, 3))
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<ProductCategory>('dry-grain')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')

  function handleAdd(event: FormEvent) {
    event.preventDefault()
    if (!title.trim() || !price.trim() || !quantity.trim() || !user) return
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title,
      category,
      pricePerUnit: Number(price),
      unit: 'kg',
      quantityAvailable: Number(quantity),
      district: user.district,
      description: 'Newly added listing.',
      seller: {
        id: user.id,
        name: user.fullName,
        role: user.role === 'farmer' || user.role === 'processor' ? user.role : 'farmer',
        district: user.district,
        rating: 5,
        totalSales: 0,
        verified: user.verified,
        phone: user.phone,
        avatarInitials: user.fullName
          .split(' ')
          .map((p) => p[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        memberSince: user.createdAt,
      },
      imageColor: '#4C9A54',
      postedAt: new Date().toISOString(),
    }
    setListings((prev) => [newProduct, ...prev])
    setTitle('')
    setPrice('')
    setQuantity('')
    setIsAdding(false)
  }

  return (
    <DashboardLayout
      title="My Listings"
      subtitle="Manage the products you're selling"
      actions={
        <Button size="sm" leadingIcon={<PlusCircle className="size-4" />} onClick={() => setIsAdding((v) => !v)}>
          <span className="hidden sm:inline">New listing</span>
        </Button>
      }
    >
      {isAdding && (
        <Card className="mb-5">
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="h-12 rounded-md border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {CATEGORY_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Price per kg (UGX)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Quantity available (kg)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <Button type="submit" className="sm:col-span-2">
              Publish listing
            </Button>
          </form>
        </Card>
      )}

      {listings.length === 0 ? (
        <EmptyState
          icon={Store}
          title="You have no active listings"
          description="Create your first listing to start selling on the marketplace."
        />
      ) : (
        <div className="space-y-3">
          {listings.map((product) => (
            <Card key={product.id} className="flex items-center gap-4">
              <img
                src={CATEGORY_IMAGES[product.category].sm}
                alt={PRODUCT_CATEGORY_LABELS[product.category]}
                className="hidden size-14 shrink-0 rounded-lg object-cover sm:block"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-on-surface">{product.title}</p>
                <p className="text-sm text-on-surface-variant">
                  UGX {product.pricePerUnit.toLocaleString()}/{product.unit} &middot; {product.quantityAvailable.toLocaleString()}{' '}
                  {product.unit}s left
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button className="flex size-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container" aria-label="Edit listing">
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => setListings((prev) => prev.filter((p) => p.id !== product.id))}
                  className="flex size-9 items-center justify-center rounded-full text-error hover:bg-error-container"
                  aria-label="Delete listing"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
