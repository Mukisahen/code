import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'

export const ticketsRouter = Router()

ticketsRouter.use(requireAuth)

ticketsRouter.get(
  '/mine',
  asyncHandler(async (req, res) => {
    const tickets = await prisma.supportTicket.findMany({
      where: { requesterId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    })
    res.json({
      tickets: tickets.map((t) => ({
        id: t.id,
        subject: t.subject,
        message: t.message,
        priority: t.priority,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
      })),
    })
  }),
)

const createSchema = z.object({
  subject: z.string().min(3).max(120),
  message: z.string().min(1).max(4000),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
})

ticketsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const payload = createSchema.parse(req.body)

    const ticket = await prisma.supportTicket.create({
      data: {
        subject: payload.subject,
        message: payload.message,
        priority: payload.priority,
        requesterId: req.user!.id,
      },
    })

    res.status(201).json({
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        message: ticket.message,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt.toISOString(),
      },
    })
  }),
)
