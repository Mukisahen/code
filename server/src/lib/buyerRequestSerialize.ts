import type { BuyerRequest, User } from '@prisma/client'

export function toClientBuyerRequest(request: BuyerRequest & { buyer: User }) {
  return {
    id: request.id,
    buyerId: request.buyerId,
    buyerName: request.buyer.fullName,
    district: request.district,
    category: request.category,
    quantityNeeded: request.quantityNeeded,
    targetPrice: request.targetPrice,
    notes: request.notes,
    status: request.status,
    postedAt: request.postedAt.toISOString(),
  }
}
