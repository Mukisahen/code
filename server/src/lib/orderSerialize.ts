import type { Order, User } from '@prisma/client'

export function toClientOrder(order: Order & { buyer: User; seller: User }, viewerRole: 'buyer' | 'seller') {
  return {
    id: order.id,
    productTitle: order.productTitle,
    category: order.category,
    counterpartyName: viewerRole === 'buyer' ? order.seller.fullName : order.buyer.fullName,
    quantity: `${order.quantityAmount.toLocaleString()} ${order.quantityUnit}`,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  }
}
