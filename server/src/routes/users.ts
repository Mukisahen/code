import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { toPublicUser } from '../lib/serialize.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { imageUpload } from '../middleware/upload.js'
import { saveUploadedImage } from '../lib/imageStorage.js'
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

const JOURNEY_STAGES = ['planning', 'growing', 'harvesting', 'storage', 'selling', 'processing'] as const

const stageSchema = z.object({ stage: z.enum(JOURNEY_STAGES) })

usersRouter.patch(
  '/me/stage',
  asyncHandler(async (req, res) => {
    const { stage } = stageSchema.parse(req.body)

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { journeyStage: stage },
    })

    res.json({ user: toPublicUser(user) })
  }),
)

usersRouter.post(
  '/me/avatar',
  imageUpload.single('photo'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw badRequest('A photo is required')

    const avatarUrl = await saveUploadedImage(req.file.buffer, 'avatars', 512)

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatarUrl },
    })

    res.status(201).json({ user: toPublicUser(user) })
  }),
)
