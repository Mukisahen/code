import type { Product, User } from '@prisma/client'
import { CATEGORY_TO_CLIENT, UNIT_TO_CLIENT } from './mappers.js'
import { toSellerView } from './serialize.js'

export function toClientProduct(product: Product & { seller: User }) {
  return {
    id: product.id,
    title: product.title,
    category: CATEGORY_TO_CLIENT[product.category],
    pricePerUnit: product.pricePerUnit,
    unit: UNIT_TO_CLIENT[product.unit],
    quantityAvailable: product.quantityAvailable,
    district: product.district,
    description: product.description,
    seller: toSellerView(product.seller),
    imageUrl: product.imageUrl ?? undefined,
    postedAt: product.postedAt.toISOString(),
    featured: product.featured,
    moisturePercent: product.moisturePercent ?? undefined,
    variety: product.variety ?? undefined,
    grade: product.grade ?? undefined,
    harvestDate: product.harvestDate ? product.harvestDate.toISOString() : undefined,
  }
}
