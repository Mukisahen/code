import { api } from '@/lib/apiClient'
import type { User } from '@/types/user'
import type { JourneyStage } from '@/constants/app'

export interface UpdateProfilePayload {
  fullName?: string
  email?: string
  district?: string
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { user } = await api.patch<{ user: User }>('/users/me', payload)
  return user
}

export async function uploadAvatar(file: File): Promise<User> {
  const formData = new FormData()
  formData.append('photo', file)
  const { user } = await api.post<{ user: User }>('/users/me/avatar', formData)
  return user
}

export async function updateJourneyStage(stage: JourneyStage): Promise<User> {
  const { user } = await api.patch<{ user: User }>('/users/me/stage', { stage })
  return user
}
