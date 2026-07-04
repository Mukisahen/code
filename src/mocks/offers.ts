import type { ProductOffer } from '@/types/selling'

export const MOCK_OFFERS: ProductOffer[] = [
  {
    id: 'offer-1',
    productTitle: 'Dry Grain Maize — Grade A',
    buyerName: 'Kigongo Milling Co.',
    offerAmount: 1380,
    unit: 'kg',
    quantity: '2,000 kg',
    status: 'pending',
    createdAt: '2026-07-04T08:30:00Z',
  },
  {
    id: 'offer-2',
    productTitle: 'Fresh Green Maize — Longe 10H',
    buyerName: 'Okello Moses',
    offerAmount: 750,
    unit: 'cob',
    quantity: '400 cobs',
    status: 'pending',
    createdAt: '2026-07-03T16:10:00Z',
  },
  {
    id: 'offer-3',
    productTitle: 'Roasted Maize — Ready to Eat',
    buyerName: 'Nabirye Milling Ltd.',
    offerAmount: 950,
    unit: 'cob',
    quantity: '300 cobs',
    status: 'accepted',
    createdAt: '2026-06-29T09:00:00Z',
  },
  {
    id: 'offer-4',
    productTitle: 'Dry Grain Maize — Grade A',
    buyerName: 'Aine Patricia',
    offerAmount: 1250,
    unit: 'kg',
    quantity: '500 kg',
    status: 'declined',
    createdAt: '2026-06-25T11:20:00Z',
  },
]
