import { api } from '@/lib/apiClient'
import type { Product, ProductCategory } from '@/types/product'
import type { Order, OrderStatus, BuyerRequest, BuyerRequestStatus } from '@/types/order'
import type { ProductOffer, OfferStatus } from '@/types/selling'

function toClientOrderStatus(status: string): OrderStatus {
  return status === 'in_transit' ? 'in-transit' : (status as OrderStatus)
}

function toServerOrderStatus(status: OrderStatus): string {
  return status === 'in-transit' ? 'in_transit' : status
}

export interface ProductFilters {
  category?: ProductCategory | 'all'
  district?: string | 'all'
  minPrice?: string
  maxPrice?: string
  search?: string
  sort?: 'newest' | 'price-asc' | 'price-desc'
}

function buildProductQuery(filters: ProductFilters): string {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== 'all') params.set('category', filters.category)
  if (filters.district && filters.district !== 'all') params.set('district', filters.district)
  if (filters.minPrice) params.set('minPrice', filters.minPrice)
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
  if (filters.search) params.set('search', filters.search)
  if (filters.sort) params.set('sort', filters.sort)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const { products } = await api.get<{ products: Product[] }>(`/products${buildProductQuery(filters)}`)
  return products
}

export async function getMyProducts(): Promise<Product[]> {
  const { products } = await api.get<{ products: Product[] }>('/products/mine')
  return products
}

export async function getProduct(id: string): Promise<Product> {
  const { product } = await api.get<{ product: Product }>(`/products/${id}`)
  return product
}

export interface CreateProductPayload {
  title: string
  category: ProductCategory
  pricePerUnit: number
  unit: string
  quantityAvailable: number
  district: string
  description: string
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { product } = await api.post<{ product: Product }>('/products', payload)
  return product
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`)
}

export interface CreateOfferPayload {
  productId: string
  offerAmount: number
  unit: string
  quantity: string
}

export async function createOffer(payload: CreateOfferPayload): Promise<ProductOffer> {
  const { offer } = await api.post<{ offer: ProductOffer }>('/offers', payload)
  return offer
}

export async function getReceivedOffers(): Promise<ProductOffer[]> {
  const { offers } = await api.get<{ offers: ProductOffer[] }>('/offers/received')
  return offers
}

export async function getMyOffers(): Promise<ProductOffer[]> {
  const { offers } = await api.get<{ offers: ProductOffer[] }>('/offers/mine')
  return offers
}

export async function decideOffer(id: string, status: OfferStatus): Promise<ProductOffer> {
  const { offer } = await api.patch<{ offer: ProductOffer }>(`/offers/${id}`, { status })
  return offer
}

export interface CreateOrderPayload {
  productId: string
  quantityAmount: number
  quantityUnit: string
  totalAmount: number
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { order } = await api.post<{ order: Order }>('/orders', payload)
  return { ...order, status: toClientOrderStatus(order.status) }
}

export async function getMyOrders(): Promise<Order[]> {
  const { orders } = await api.get<{ orders: Order[] }>('/orders/mine')
  return orders.map((o) => ({ ...o, status: toClientOrderStatus(o.status) }))
}

export async function getSellingOrders(): Promise<Order[]> {
  const { orders } = await api.get<{ orders: Order[] }>('/orders/selling')
  return orders.map((o) => ({ ...o, status: toClientOrderStatus(o.status) }))
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const { order } = await api.patch<{ order: Order }>(`/orders/${id}/status`, { status: toServerOrderStatus(status) })
  return { ...order, status: toClientOrderStatus(order.status) }
}

export async function listBuyerRequests(): Promise<BuyerRequest[]> {
  const { requests } = await api.get<{ requests: BuyerRequest[] }>('/buyer-requests')
  return requests
}

export interface CreateBuyerRequestPayload {
  district: string
  category: string
  quantityNeeded: string
  targetPrice: number
  notes: string
}

export async function createBuyerRequest(payload: CreateBuyerRequestPayload): Promise<BuyerRequest> {
  const { request } = await api.post<{ request: BuyerRequest }>('/buyer-requests', payload)
  return request
}

export async function getMyBuyerRequests(): Promise<BuyerRequest[]> {
  const { requests } = await api.get<{ requests: BuyerRequest[] }>('/buyer-requests/mine')
  return requests
}

export async function updateBuyerRequestStatus(id: string, status: BuyerRequestStatus): Promise<BuyerRequest> {
  const { request } = await api.patch<{ request: BuyerRequest }>(`/buyer-requests/${id}`, { status })
  return request
}

export async function listFavorites(): Promise<Product[]> {
  const { products } = await api.get<{ products: Product[] }>('/favorites')
  return products
}

export async function addFavorite(productId: string): Promise<void> {
  await api.post('/favorites', { productId })
}

export async function removeFavorite(productId: string): Promise<void> {
  await api.delete(`/favorites/${productId}`)
}
