import type { Product, ProductOffer, User } from '@prisma/client'

export function toClientOffer(offer: ProductOffer & { product: Product; buyer: User }) {
  return {
    id: offer.id,
    productTitle: offer.product.title,
    buyerName: offer.buyer.fullName,
    offerAmount: offer.offerAmount,
    unit: offer.unit,
    quantity: offer.quantity,
    status: offer.status,
    createdAt: offer.createdAt.toISOString(),
  }
}
