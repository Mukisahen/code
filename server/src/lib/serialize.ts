import type { User } from '@prisma/client'

export function initials(fullName: string): string {
  return fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function toPublicUser(user: User) {
  return {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email ?? undefined,
    role: user.role,
    isSuperAdmin: user.isSuperAdmin,
    district: user.district,
    avatarUrl: user.avatarUrl ?? undefined,
    subscriptionTier: user.subscriptionTier,
    verified: user.verified,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  }
}

export function toSellerView(user: User) {
  return {
    id: user.id,
    name: user.fullName,
    role: user.role,
    district: user.district,
    rating: user.rating,
    totalSales: user.totalSales,
    verified: user.verified,
    phone: user.phone,
    avatarInitials: initials(user.fullName),
    avatarUrl: user.avatarUrl ?? undefined,
    memberSince: user.createdAt.toISOString(),
  }
}
