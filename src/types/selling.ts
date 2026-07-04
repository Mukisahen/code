export type OfferStatus = 'pending' | 'accepted' | 'declined'

export interface ProductOffer {
  id: string
  productTitle: string
  buyerName: string
  offerAmount: number
  unit: string
  quantity: string
  status: OfferStatus
  createdAt: string
}
