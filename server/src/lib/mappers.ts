import type { ProductCategory, ProductUnit } from '@prisma/client'

export const CATEGORY_TO_CLIENT: Record<ProductCategory, string> = {
  green_maize: 'green-maize',
  wet_maize: 'wet-maize',
  dry_grain: 'dry-grain',
  dry_cobs: 'dry-cobs',
  roasted_maize: 'roasted-maize',
  maize_flour: 'maize-flour',
  seed_maize: 'seed-maize',
}

export const CATEGORY_FROM_CLIENT: Record<string, ProductCategory> = Object.fromEntries(
  Object.entries(CATEGORY_TO_CLIENT).map(([db, client]) => [client, db as ProductCategory]),
)

export const UNIT_TO_CLIENT: Record<ProductUnit, string> = {
  kg: 'kg',
  bag_100kg: 'bag (100kg)',
  bag_50kg: 'bag (50kg)',
  cob: 'cob',
}

export const UNIT_FROM_CLIENT: Record<string, ProductUnit> = Object.fromEntries(
  Object.entries(UNIT_TO_CLIENT).map(([db, client]) => [client, db as ProductUnit]),
)
