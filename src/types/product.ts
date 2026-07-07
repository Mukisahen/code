export type ProductCategory =
  | 'green-maize'
  | 'wet-maize'
  | 'dry-grain'
  | 'dry-cobs'
  | 'roasted-maize'
  | 'maize-flour'
  | 'seed-maize'

export interface Seller {
  id: string
  name: string
  role: 'farmer' | 'buyer' | 'processor'
  district: string
  rating: number
  totalSales: number
  verified: boolean
  phone: string
  avatarInitials: string
  memberSince: string
}

export interface Product {
  id: string
  title: string
  category: ProductCategory
  pricePerUnit: number
  unit: 'kg' | 'bag (100kg)' | 'bag (50kg)' | 'cob'
  quantityAvailable: number
  district: string
  description: string
  seller: Seller
  imageColor?: string
  imageUrl?: string
  postedAt: string
  featured?: boolean
}

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  'green-maize': 'Green Maize',
  'wet-maize': 'Wet Maize',
  'dry-grain': 'Dry Grain',
  'dry-cobs': 'Dry Cobs',
  'roasted-maize': 'Roasted Maize',
  'maize-flour': 'Maize Flour',
  'seed-maize': 'Seed Maize',
}
