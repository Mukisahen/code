import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { hashPassword, verifyPassword } from '../lib/password.js'
import { signAuthToken } from '../lib/jwt.js'
import { toPublicUser } from '../lib/serialize.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { badRequest, conflict, notFound, unauthorized } from '../lib/httpError.js'

export const authRouter = Router()

// Admin accounts are never self-registered — only the seeded supreme admin
// or an existing super admin (via POST /admin/admins) can grant admin access.
const registerSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  password: z.string().min(8),
  role: z.enum(['farmer', 'buyer', 'processor']),
  district: z.string().min(2),
})

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const payload = registerSchema.parse(req.body)

    const existing = await prisma.user.findUnique({ where: { phone: payload.phone } })
    if (existing) throw conflict('An account with this phone number already exists')

    const passwordHash = await hashPassword(payload.password)
    const user = await prisma.user.create({
      data: {
        fullName: payload.fullName,
        phone: payload.phone,
        passwordHash,
        role: payload.role,
        district: payload.district,
      },
    })

    const token = signAuthToken({ sub: user.id, role: user.role })
    res.status(201).json({ token, user: toPublicUser(user) })
  }),
)

const loginSchema = z.object({
  phone: z.string().min(9),
  password: z.string().min(1),
})

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { phone, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { phone } })
    if (!user) throw unauthorized('Invalid phone number or password')

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) throw unauthorized('Invalid phone number or password')

    if (user.status === 'suspended') throw unauthorized('This account has been suspended')

    const token = signAuthToken({ sub: user.id, role: user.role })
    res.json({ token, user: toPublicUser(user) })
  }),
)

const resetSchema = z.object({ phone: z.string().min(9) })

authRouter.post(
  '/password-reset',
  asyncHandler(async (req, res) => {
    const { phone } = resetSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { phone } })
    if (!user) throw notFound('No account found with that phone number')

    // Pilot stub: no SMS gateway integrated yet. A real reset flow (OTP via SMS)
    // is a post-pilot backend addition once an SMS provider is chosen.
    res.json({ sent: true })
  }),
)

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!req.user) throw badRequest('No authenticated user')
    res.json({ user: toPublicUser(req.user) })
  }),
)
