import { prisma } from './prisma.js'

export function writeAuditLog(actorId: string, action: string, target: string) {
  return prisma.auditLogEntry.create({ data: { actorId, action, target } })
}
