import type { NextFunction, Request, Response } from 'express'
import type { User, UserRole } from '@prisma/client'
import { verifyAuthToken } from '../lib/jwt.js'
import { prisma } from '../lib/prisma.js'
import { unauthorized, forbidden } from '../lib/httpError.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) throw unauthorized('Missing bearer token')

    const token = header.slice('Bearer '.length)
    const payload = verifyAuthToken(token)

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) throw unauthorized('User not found')
    if (user.status === 'suspended') throw forbidden('Account suspended')

    req.user = user
    next()

    const staleForOverAMinute = !user.lastSeenAt || Date.now() - user.lastSeenAt.getTime() > 60_000
    if (staleForOverAMinute) {
      prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } }).catch(() => {})
    }
  } catch (err) {
    next(err instanceof Error ? unauthorized(err.message) : unauthorized())
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized())
    if (!roles.includes(req.user.role)) return next(forbidden('Insufficient role'))
    next()
  }
}

// Gates admin-management actions (promoting/revoking other admins, acting on
// another admin's account) that only the supreme admin may perform — regular
// admins have every other requireRole('admin') capability but not this one.
export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(unauthorized())
  if (req.user.role !== 'admin' || !req.user.isSuperAdmin) return next(forbidden('Super admin only'))
  next()
}
