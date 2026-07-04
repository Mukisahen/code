import { useMemo, useState } from 'react'
import { Search, PackageSearch } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { EmptyState } from '@/components/common/EmptyState'
import { Input } from '@/components/common/Input'
import { MOCK_PRODUCTS } from '@/mocks/products'
import { PRODUCT_CATEGORY_LABELS, type ProductCategory } from '@/types/product'
import { cn } from '@/utils/cn'

type SortOption = 'newest' | 'price-asc' | 'price-desc'

const CATEGORIES = Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][]

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [sort, setSort] = useState<SortOption>('newest')

  const products = useMemo(() => {
    let list = MOCK_PRODUCTS.filter((p) => {
      const matchesSearch =
        !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.district.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || p.category === category
      return matchesSearch && matchesCategory
    })

    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.pricePerUnit - b.pricePerUnit
      if (sort === 'price-desc') return b.pricePerUnit - a.pricePerUnit
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    })

    return list
  }, [search, category, sort])

  return (
    <DashboardLayout title="Marketplace" subtitle="Buy and sell maize directly, no middlemen">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by product or district..."
          leadingIcon={<Search className="size-4.5" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="h-12 rounded-md border border-outline-variant bg-surface px-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-56"
        >
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setCategory('all')}
          className={cn(
            'shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
            category === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant',
          )}
        >
          All
        </button>
        {CATEGORIES.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              category === value ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-on-surface-variant">{products.length} listings found</p>

      {products.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No listings match your search"
          description="Try a different keyword or category."
        />
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
