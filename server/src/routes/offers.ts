import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { toClientOffer } from '../lib/offerSerialize.js'
import { forbidden, notFound } from '../lib/httpError.js'

export const offersRouter = Router()

offersRouter.use(requireAuth)

const createSchema = z.object({
  productId: z.string(),
  offerAmount: z.number().positive(),
  unit: z.string(),
  quantity: z.string(),
})

offersRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const payload = createSchema.parse(req.body)

    const product = await prisma.product.findUnique({ where: { id: payload.productId } })
    if (!product) throw notFound('Listing not found')

    const offer = await prisma.productOffer.create({
      data: {
        productId: payload.productId,
        buyerId: req.user!.id,
        offerAmount: payload.offerAmount,
        unit: payload.unit,
        quantity: payload.quantity,
      },
      include: { product: true, buyer: true },
    })

    await prisma.notification.create({
      data: {
        userId: product.sellerId,
        type: 'order',
        title: 'New offer received',
        description: `${req.user!.fullName} offered UGX ${payload.offerAmount.toLocaleString()} for ${product.title}`,
      },
    })

    res.status(201).json({ offer: toClientOffer(offer) })
  }),
)

offersRouter.get(
  '/mine',
  asyncHandler(async (req, res) => {
    const offers = await prisma.productOffer.findMany({
      where: { buyerId: req.user!.id },
      include: { product: true, buyer: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ offers: offers.map(toClientOffer) })
  }),
)

offersRouter.get(
  '/received',
  asyncHandler(async (req, res) => {
    const offers = await prisma.productOffer.findMany({
      where: { product: { sellerId: req.user!.id } },
      include: { product: true, buyer: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ offers: offers.map(toClientOffer) })
  }),
)

const decisionSchema = z.object({ status: z.enum(['accepted', 'declined']) })

offersRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { status } = decisionSchema.parse(req.body)

    const existing = await prisma.productOffer.findUnique({
      where: { id: req.params.id },
      include: { product: true },
    })
    if (!existing) throw notFound('Offer not found')
    if (existing.product.sellerId !== req.user!.id) throw forbidden('You do not own this listing')

    const offer = await prisma.productOffer.update({
      where: { id: req.params.id },
      data: { status },
      include: { product: true, buyer: true },
    })

    await prisma.notification.create({
      data: {
        userId: offer.buyerId,
        type: 'order',
        title: status === 'accepted' ? 'Your offer was accepted' : 'Your offer was declined',
        description: `${offer.product.title} — UGX ${offer.offerAmount.toLocaleString()}`,
      },
    })

    res.json({ offer: toClientOffer(offer) })
  }),
)
