import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export const marketPricesRouter = Router()

marketPricesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const prices = await prisma.marketPriceEntry.findMany({ orderBy: { district: 'asc' }, include: { updatedBy: true } })
    res.json({
      prices: prices.map((p) => ({
        id: p.id,
        district: p.district,
        category: p.category,
        pricePerKg: p.pricePerKg,
        changePercent: p.changePercent,
        source: p.source ?? undefined,
        updatedByName: p.updatedBy?.fullName,
        updatedAt: p.updatedAt.toISOString(),
      })),
    })
  }),
)

const trendQuerySchema = z.object({ district: z.string(), category: z.string() })

marketPricesRouter.get(
  '/trend',
  asyncHandler(async (req, res) => {
    const { district, category } = trendQuerySchema.parse(req.query)
    const history = await prisma.marketPriceHistory.findMany({
      where: { district, category },
      orderBy: { recordedAt: 'desc' },
      take: 7,
    })
    res.json({ trend: history.map((h) => h.pricePerKg).reverse() })
  }),
)

const upsertSchema = z.object({
  district: z.string().min(2),
  category: z.string().min(2),
  pricePerKg: z.number().positive(),
})

marketPricesRouter.post(
  '/',
  requireAuth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const payload = upsertSchema.parse(req.body)

    const previous = await prisma.marketPriceEntry.findUnique({
      where: { district_category: { district: payload.district, category: payload.category } },
    })
    const changePercent = previous
      ? Math.round(((payload.pricePerKg - previous.pricePerKg) / previous.pricePerKg) * 1000) / 10
      : 0

    const entry = await prisma.marketPriceEntry.upsert({
      where: { district_category: { district: payload.district, category: payload.category } },
      create: { ...payload, changePercent, source: 'admin', updatedById: req.user!.id },
      update: { pricePerKg: payload.pricePerKg, changePercent, source: 'admin', updatedById: req.user!.id, updatedAt: new Date() },
    })

    await prisma.marketPriceHistory.create({
      data: { district: payload.district, category: payload.category, pricePerKg: payload.pricePerKg },
    })

    res.json({
      price: {
        id: entry.id,
        district: entry.district,
        category: entry.category,
        pricePerKg: entry.pricePerKg,
        changePercent: entry.changePercent,
        source: entry.source ?? undefined,
        updatedByName: req.user!.fullName,
        updatedAt: entry.updatedAt.toISOString(),
      },
    })
  }),
)
