import { useEffect, useMemo, useState } from 'react'
import { Search, PackageSearch, X } from 'lucide-react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { EmptyState } from '@/components/common/EmptyState'
import { InlineSpinner } from '@/components/common/InlineSpinner'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import * as marketplaceService from '@/services/marketplaceService'
import { UGANDA_MAIZE_DISTRICTS } from '@/mocks/districts'
import { PRODUCT_CATEGORY_LABELS, type Product, type ProductCategory } from '@/types/product'
import { cn } from '@/utils/cn'

type SortOption = 'newest' | 'price-asc' | 'price-desc'

const CATEGORIES = Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][]

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [district, setDistrict] = useState<string>('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const hasActiveFilters = category !== 'all' || district !== 'all' || minPrice !== '' || maxPrice !== ''

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const timeout = setTimeout(() => {
      marketplaceService
        .listProducts({ category, district, minPrice, maxPrice, search, sort })
        .then((result) => {
          if (!cancelled) setProducts(result)
        })
        .catch(() => {
          if (!cancelled) setError('Could not load listings. Please try again.')
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [search, category, district, minPrice, maxPrice, sort])

  const districts = useMemo(() => [...UGANDA_MAIZE_DISTRICTS].sort(), [])

  function clearFilters() {
    setCategory('all')
    setDistrict('all')
    setMinPrice('')
    setMaxPrice('')
  }

  return (
    <DashboardLayout title="Marketplace" subtitle="Buy and sell maize directly, no middlemen">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          aria-label="Search by product or district"
          placeholder="Search by product or district..."
          leadingIcon={<Search className="size-4.5" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <select
          aria-label="Sort products"
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
          aria-pressed={category === 'all'}
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
            aria-pressed={category === value}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              category === value ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="district-filter" className="mb-1 block text-xs font-medium text-on-surface-variant">
            District
          </label>
          <select
            id="district-filter"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="h-11 rounded-md border border-outline-variant bg-surface px-3.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="min-price-filter" className="mb-1 block text-xs font-medium text-on-surface-variant">
            Min price (UGX)
          </label>
          <input
            id="min-price-filter"
            type="number"
            min={0}
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-11 w-28 rounded-md border border-outline-variant bg-surface px-3.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label htmlFor="max-price-filter" className="mb-1 block text-xs font-medium text-on-surface-variant">
            Max price (UGX)
          </label>
          <input
            id="max-price-filter"
            type="number"
            min={0}
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-11 w-28 rounded-md border border-outline-variant bg-surface px-3.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="text" size="sm" leadingIcon={<X className="size-4" />} onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {loading ? (
        <InlineSpinner label="Loading listings…" />
      ) : error ? (
        <EmptyState icon={PackageSearch} title="Something went wrong" description={error} />
      ) : (
        <>
          <p className="mt-4 text-sm text-on-surface-variant">{products.length} listings found</p>

          {products.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No listings match your search"
              description="Try a different keyword, district, price range or category."
              action={
                hasActiveFilters ? (
                  <Button variant="outlined" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
