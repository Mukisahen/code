import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { notFound } from '../lib/httpError.js'

export const notificationsRouter = Router()

notificationsRouter.use(requireAuth)

notificationsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const since = req.query.since ? new Date(String(req.query.since)) : undefined

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id, ...(since ? { createdAt: { gt: since } } : {}) },
      orderBy: { createdAt: 'desc' },
      take: since ? undefined : 50,
    })

    res.json({
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        description: n.description,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      })),
    })
  }),
)

notificationsRouter.patch(
  '/:id/read',
  asyncHandler(async (req, res) => {
    const existing = await prisma.notification.findUnique({ where: { id: req.params.id } })
    if (!existing || existing.userId !== req.user!.id) throw notFound('Notification not found')

    await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } })
    res.status(204).send()
  }),
)

notificationsRouter.post(
  '/read-all',
  asyncHandler(async (req, res) => {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, read: false },
      data: { read: true },
    })
    res.status(204).send()
  }),
)
