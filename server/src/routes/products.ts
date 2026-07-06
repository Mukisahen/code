import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { toClientProduct } from '../lib/productSerialize.js'
import { CATEGORY_FROM_CLIENT, UNIT_FROM_CLIENT } from '../lib/mappers.js'
import { badRequest, forbidden, notFound } from '../lib/httpError.js'

export const productsRouter = Router()

const listQuerySchema = z.object({
  category: z.string().optional(),
  district: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc']).optional(),
})

productsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.parse(req.query)

    const products = await prisma.product.findMany({
      where: {
        category: query.category ? CATEGORY_FROM_CLIENT[query.category] : undefined,
        district: query.district,
        pricePerUnit: {
          gte: query.minPrice,
          lte: query.maxPrice,
        },
        ...(query.search
          ? {
              OR: [
                { title: { contains: query.search, mode: 'insensitive' } },
                { district: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { seller: true },
      orderBy:
        query.sort === 'price-asc'
          ? { pricePerUnit: 'asc' }
          : query.sort === 'price-desc'
            ? { pricePerUnit: 'desc' }
            : { postedAt: 'desc' },
    })

    res.json({ products: products.map(toClientProduct) })
  }),
)

productsRouter.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({
      where: { sellerId: req.user!.id },
      include: { seller: true },
      orderBy: { postedAt: 'desc' },
    })
    res.json({ products: products.map(toClientProduct) })
  }),
)

productsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { seller: true },
    })
    if (!product) throw notFound('Listing not found')
    res.json({ product: toClientProduct(product) })
  }),
)

const createSchema = z.object({
  title: z.string().min(3),
  category: z.string(),
  pricePerUnit: z.number().positive(),
  unit: z.string(),
  quantityAvailable: z.number().positive(),
  district: z.string().min(2),
  description: z.string().min(5),
  imageUrl: z.string().url().optional(),
})

productsRouter.post(
  '/',
  requireAuth,
  requireRole('farmer', 'processor'),
  asyncHandler(async (req, res) => {
    const payload = createSchema.parse(req.body)
    const category = CATEGORY_FROM_CLIENT[payload.category]
    const unit = UNIT_FROM_CLIENT[payload.unit]
    if (!category) throw badRequest(`Unknown category: ${payload.category}`)
    if (!unit) throw badRequest(`Unknown unit: ${payload.unit}`)

    const product = await prisma.product.create({
      data: {
        title: payload.title,
        category,
        pricePerUnit: payload.pricePerUnit,
        unit,
        quantityAvailable: payload.quantityAvailable,
        district: payload.district,
        description: payload.description,
        imageUrl: payload.imageUrl,
        sellerId: req.user!.id,
      },
      include: { seller: true },
    })

    res.status(201).json({ product: toClientProduct(product) })
  }),
)

const updateSchema = createSchema.partial()

productsRouter.patch(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } })
    if (!existing) throw notFound('Listing not found')
    if (existing.sellerId !== req.user!.id) throw forbidden('You do not own this listing')

    const payload = updateSchema.parse(req.body)
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...payload,
        category: payload.category ? CATEGORY_FROM_CLIENT[payload.category] : undefined,
        unit: payload.unit ? UNIT_FROM_CLIENT[payload.unit] : undefined,
      },
      include: { seller: true },
    })

    res.json({ product: toClientProduct(product) })
  }),
)

productsRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } })
    if (!existing) throw notFound('Listing not found')
    if (existing.sellerId !== req.user!.id) throw forbidden('You do not own this listing')

    await prisma.product.delete({ where: { id: req.params.id } })
    res.status(204).send()
  }),
)
