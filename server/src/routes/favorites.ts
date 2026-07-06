import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { toClientProduct } from '../lib/productSerialize.js'
import { notFound } from '../lib/httpError.js'

export const favoritesRouter = Router()

favoritesRouter.use(requireAuth)

favoritesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.id },
      include: { product: { include: { seller: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ products: favorites.map((f) => toClientProduct(f.product)) })
  }),
)

const bodySchema = z.object({ productId: z.string() })

favoritesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { productId } = bodySchema.parse(req.body)

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw notFound('Listing not found')

    await prisma.favorite.upsert({
      where: { userId_productId: { userId: req.user!.id, productId } },
      create: { userId: req.user!.id, productId },
      update: {},
    })

    res.status(201).json({ favorited: true })
  }),
)

favoritesRouter.delete(
  '/:productId',
  asyncHandler(async (req, res) => {
    await prisma.favorite.deleteMany({
      where: { userId: req.user!.id, productId: req.params.productId },
    })
    res.status(204).send()
  }),
)
