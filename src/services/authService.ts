import { api, ApiError, setToken } from '@/lib/apiClient'
import type { AuthCredentials, RegisterPayload, User } from '@/types/user'

export class AuthError extends Error {}

interface AuthResponse {
  token: string
  user: User
}

function toAuthError(err: unknown): AuthError {
  if (err instanceof ApiError) return new AuthError(err.message)
  return new AuthError('Something went wrong. Please try again.')
}

export async function login({ phone, password }: AuthCredentials): Promise<User> {
  try {
    const { token, user } = await api.post<AuthResponse>('/auth/login', { phone, password })
    setToken(token)
    return user
  } catch (err) {
    throw toAuthError(err)
  }
}

export async function register(payload: RegisterPayload): Promise<User> {
  try {
    const { token, user } = await api.post<AuthResponse>('/auth/register', payload)
    setToken(token)
    return user
  } catch (err) {
    throw toAuthError(err)
  }
}

export async function requestPasswordReset(phone: string): Promise<{ sent: boolean }> {
  try {
    return await api.post<{ sent: boolean }>('/auth/password-reset', { phone })
  } catch (err) {
    throw toAuthError(err)
  }
}

export async function fetchCurrentUser(): Promise<User> {
  const { user } = await api.get<{ user: User }>('/auth/me')
  return user
}
