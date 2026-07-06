import jwt from 'jsonwebtoken'
import { env } from '../env.js'
import type { UserRole } from '@prisma/client'

export interface AuthTokenPayload {
  sub: string
  role: UserRole
}

const EXPIRES_IN = '30d'

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: EXPIRES_IN })
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload
}
