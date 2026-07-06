import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { toClientBuyerRequest } from '../lib/buyerRequestSerialize.js'
import { forbidden, notFound } from '../lib/httpError.js'

export const buyerRequestsRouter = Router()

buyerRequestsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const requests = await prisma.buyerRequest.findMany({
      include: { buyer: true },
      orderBy: { postedAt: 'desc' },
    })
    res.json({ requests: requests.map(toClientBuyerRequest) })
  }),
)

buyerRequestsRouter.use(requireAuth)

buyerRequestsRouter.get(
  '/mine',
  asyncHandler(async (req, res) => {
    const requests = await prisma.buyerRequest.findMany({
      where: { buyerId: req.user!.id },
      include: { buyer: true },
      orderBy: { postedAt: 'desc' },
    })
    res.json({ requests: requests.map(toClientBuyerRequest) })
  }),
)

const createSchema = z.object({
  district: z.string().min(2),
  category: z.string(),
  quantityNeeded: z.string(),
  targetPrice: z.number().positive(),
  notes: z.string(),
})

buyerRequestsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const payload = createSchema.parse(req.body)
    const request = await prisma.buyerRequest.create({
      data: { ...payload, buyerId: req.user!.id },
      include: { buyer: true },
    })
    res.status(201).json({ request: toClientBuyerRequest(request) })
  }),
)

const statusSchema = z.object({ status: z.enum(['open', 'negotiating', 'fulfilled', 'closed']) })

buyerRequestsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { status } = statusSchema.parse(req.body)
    const existing = await prisma.buyerRequest.findUnique({ where: { id: req.params.id } })
    if (!existing) throw notFound('Request not found')
    if (existing.buyerId !== req.user!.id) throw forbidden('You do not own this request')

    const request = await prisma.buyerRequest.update({
      where: { id: req.params.id },
      data: { status },
      include: { buyer: true },
    })
    res.json({ request: toClientBuyerRequest(request) })
  }),
)
