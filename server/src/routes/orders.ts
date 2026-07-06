import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { toClientOrder } from '../lib/orderSerialize.js'
import { CATEGORY_TO_CLIENT } from '../lib/mappers.js'
import { forbidden, notFound } from '../lib/httpError.js'

export const ordersRouter = Router()

ordersRouter.use(requireAuth)

const createSchema = z.object({
  productId: z.string(),
  quantityAmount: z.number().positive(),
  quantityUnit: z.string(),
  totalAmount: z.number().positive(),
})

ordersRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const payload = createSchema.parse(req.body)

    const product = await prisma.product.findUnique({ where: { id: payload.productId } })
    if (!product) throw notFound('Listing not found')

    const order = await prisma.order.create({
      data: {
        productId: product.id,
        productTitle: product.title,
        category: CATEGORY_TO_CLIENT[product.category],
        quantityAmount: payload.quantityAmount,
        quantityUnit: payload.quantityUnit,
        totalAmount: payload.totalAmount,
        buyerId: req.user!.id,
        sellerId: product.sellerId,
      },
      include: { buyer: true, seller: true },
    })

    await prisma.notification.create({
      data: {
        userId: product.sellerId,
        type: 'order',
        title: 'New order placed',
        description: `${req.user!.fullName} ordered ${product.title}`,
      },
    })

    res.status(201).json({ order: toClientOrder(order, 'buyer') })
  }),
)

ordersRouter.get(
  '/mine',
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { buyerId: req.user!.id },
      include: { buyer: true, seller: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ orders: orders.map((o) => toClientOrder(o, 'buyer')) })
  }),
)

ordersRouter.get(
  '/selling',
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { sellerId: req.user!.id },
      include: { buyer: true, seller: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ orders: orders.map((o) => toClientOrder(o, 'seller')) })
  }),
)

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'in_transit', 'completed', 'cancelled']),
})

ordersRouter.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = statusSchema.parse(req.body)

    const existing = await prisma.order.findUnique({ where: { id: req.params.id } })
    if (!existing) throw notFound('Order not found')
    if (existing.sellerId !== req.user!.id) throw forbidden('You do not own this order')

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { buyer: true, seller: true },
    })

    await prisma.notification.create({
      data: {
        userId: order.buyerId,
        type: 'order',
        title: 'Order status updated',
        description: `${order.productTitle} is now ${status.replace('_', ' ')}`,
      },
    })

    res.json({ order: toClientOrder(order, 'buyer') })
  }),
)
