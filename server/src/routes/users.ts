import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { toPublicUser } from '../lib/serialize.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { badRequest } from '../lib/httpError.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  district: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional(),
})

usersRouter.patch(
  '/me',
  asyncHandler(async (req, res) => {
    if (!req.user) throw badRequest('No authenticated user')
    const payload = updateSchema.parse(req.body)

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: payload,
    })

    res.json({ user: toPublicUser(user) })
  }),
)
