export type OrderStatus = 'pending' | 'confirmed' | 'in-transit' | 'completed' | 'cancelled'

export interface Order {
  id: string
  productTitle: string
  category: string
  counterpartyName: string
  quantity: string
  totalAmount: number
  status: OrderStatus
  createdAt: string
}

export type BuyerRequestStatus = 'open' | 'negotiating' | 'fulfilled' | 'closed'

export interface BuyerRequest {
  id: string
  buyerName: string
  district: string
  category: string
  quantityNeeded: string
  targetPrice: number
  notes: string
  status: BuyerRequestStatus
  postedAt: string
}
