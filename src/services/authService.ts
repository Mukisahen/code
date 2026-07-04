import { MOCK_PASSWORD, MOCK_USERS } from '@/mocks/users'
import type { AuthCredentials, RegisterPayload, User } from '@/types/user'

const NETWORK_DELAY_MS = 650

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export class AuthError extends Error {}

/** In-memory store standing in for a real backend during frontend development. */
const registeredUsers: User[] = [...MOCK_USERS]

export async function login({ phone, password }: AuthCredentials): Promise<User> {
  const user = registeredUsers.find((u) => u.phone === phone)
  if (!user || password !== MOCK_PASSWORD) {
    await delay(null, 500)
    throw new AuthError('Invalid phone number or password.')
  }
  return delay(user)
}

export async function register(payload: RegisterPayload): Promise<User> {
  if (registeredUsers.some((u) => u.phone === payload.phone)) {
    await delay(null, 500)
    throw new AuthError('An account with this phone number already exists.')
  }
  const user: User = {
    id: `usr-${payload.role}-${Date.now()}`,
    fullName: payload.fullName,
    phone: payload.phone,
    role: payload.role,
    district: payload.district,
    subscriptionTier: 'free',
    verified: false,
    createdAt: new Date().toISOString(),
  }
  registeredUsers.push(user)
  return delay(user)
}

export async function requestPasswordReset(phone: string): Promise<{ sent: boolean }> {
  const exists = registeredUsers.some((u) => u.phone === phone)
  if (!exists) {
    await delay(null, 500)
    throw new AuthError('No account found for this phone number.')
  }
  return delay({ sent: true })
}
