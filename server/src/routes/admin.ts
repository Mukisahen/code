import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth, requireRole, requireSuperAdmin } from '../middleware/auth.js'
import { writeAuditLog } from '../lib/auditLog.js'
import { askAdminAssistant } from '../services/adminAssistant.js'
import { notFound, forbidden, badRequest } from '../lib/httpError.js'

export const adminRouter = Router()

adminRouter.use(requireAuth, requireRole('admin'))

// ---- Overview ----
adminRouter.get(
  '/overview',
  asyncHandler(async (_req, res) => {
    const [totalUsers, activeListings, pendingVerifications, openTickets, usersByRole, recentAuditLogs] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.verificationRequest.count({ where: { status: 'pending' } }),
      prisma.supportTicket.count({ where: { status: 'open' } }),
      prisma.user.groupBy({ by: ['role'], _count: { role: true } }),
      prisma.auditLogEntry.findMany({ orderBy: { timestamp: 'desc' }, take: 4, include: { actor: true } }),
    ])

    res.json({
      totalUsers,
      activeListings,
      pendingVerifications,
      openTickets,
      usersByRole: usersByRole.map((r) => ({ role: r.role, count: r._count.role })),
      recentAuditLogs: recentAuditLogs.map((log) => ({
        id: log.id,
        actor: log.actor.fullName,
        action: log.action,
        target: log.target,
        timestamp: log.timestamp.toISOString(),
      })),
    })
  }),
)

// ---- Users ----
adminRouter.get(
  '/users',
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({
      users: users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        role: u.role,
        isSuperAdmin: u.isSuperAdmin,
        district: u.district,
        status: u.status,
        joinedAt: u.createdAt.toISOString(),
      })),
    })
  }),
)

const statusSchema = z.object({ status: z.enum(['active', 'suspended', 'pending']) })

adminRouter.patch(
  '/users/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = statusSchema.parse(req.body)
    const target = await prisma.user.findUnique({ where: { id: req.params.id } })
    if (!target) throw notFound('User not found')
    if (target.isSuperAdmin && !req.user!.isSuperAdmin) throw forbidden('Only a super admin can act on a super admin')

    const user = await prisma.user.update({ where: { id: req.params.id }, data: { status } })
    await writeAuditLog(req.user!.id, `Set user status to ${status}`, user.fullName)

    res.json({ user: { id: user.id, status: user.status } })
  }),
)

// ---- Admin management (supreme admin only) ----
adminRouter.post(
  '/admins/:userId',
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const target = await prisma.user.findUnique({ where: { id: req.params.userId } })
    if (!target) throw notFound('User not found')
    if (target.role === 'admin') throw badRequest('User is already an admin')

    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { role: 'admin', isSuperAdmin: false },
    })
    await writeAuditLog(req.user!.id, 'Promoted to admin', user.fullName)

    res.json({ user: { id: user.id, role: user.role, isSuperAdmin: user.isSuperAdmin } })
  }),
)

adminRouter.delete(
  '/admins/:userId',
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const target = await prisma.user.findUnique({ where: { id: req.params.userId } })
    if (!target) throw notFound('User not found')
    if (target.role !== 'admin') throw badRequest('User is not an admin')
    if (target.isSuperAdmin) throw forbidden('The supreme admin cannot be demoted')

    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { role: 'farmer' },
    })
    await writeAuditLog(req.user!.id, 'Revoked admin access', user.fullName)

    res.json({ user: { id: user.id, role: user.role } })
  }),
)

// ---- Marketplace moderation ----
adminRouter.get(
  '/listings',
  asyncHandler(async (_req, res) => {
    const listings = await prisma.product.findMany({
      include: { seller: true },
      orderBy: { postedAt: 'desc' },
    })
    res.json({
      listings: listings.map((l) => ({
        id: l.id,
        title: l.title,
        sellerName: l.seller.fullName,
        district: l.district,
        pricePerUnit: l.pricePerUnit,
        postedAt: l.postedAt.toISOString(),
      })),
    })
  }),
)

adminRouter.delete(
  '/listings/:id',
  asyncHandler(async (req, res) => {
    const listing = await prisma.product.findUnique({ where: { id: req.params.id } })
    if (!listing) throw notFound('Listing not found')

    await prisma.product.delete({ where: { id: req.params.id } })
    await writeAuditLog(req.user!.id, 'Removed listing', listing.title)

    res.status(204).send()
  }),
)

// ---- Verification ----
adminRouter.get(
  '/verifications',
  asyncHandler(async (_req, res) => {
    const requests = await prisma.verificationRequest.findMany({
      include: { applicant: true },
      orderBy: { submittedAt: 'desc' },
    })
    res.json({
      requests: requests.map((r) => ({
        id: r.id,
        applicantName: r.applicant.fullName,
        role: r.applicant.role,
        district: r.applicant.district,
        documentType: r.documentType,
        submittedAt: r.submittedAt.toISOString(),
        status: r.status,
      })),
    })
  }),
)

const decisionSchema = z.object({ status: z.enum(['approved', 'rejected']) })

adminRouter.post(
  '/verifications/:id/decision',
  asyncHandler(async (req, res) => {
    const { status } = decisionSchema.parse(req.body)

    const request = await prisma.verificationRequest.findUnique({ where: { id: req.params.id }, include: { applicant: true } })
    if (!request) throw notFound('Verification request not found')

    const updated = await prisma.verificationRequest.update({
      where: { id: req.params.id },
      data: { status, reviewerId: req.user!.id, reviewedAt: new Date() },
    })

    if (status === 'approved') {
      await prisma.user.update({ where: { id: request.applicantId }, data: { verified: true } })
    }

    await prisma.notification.create({
      data: {
        userId: request.applicantId,
        type: 'system',
        title: status === 'approved' ? 'Verification approved' : 'Verification rejected',
        description: `Your ${request.documentType} verification was ${status}.`,
      },
    })

    await writeAuditLog(req.user!.id, `Verification ${status}`, request.applicant.fullName)

    res.json({ request: { id: updated.id, status: updated.status } })
  }),
)

// ---- Support tickets ----
adminRouter.get(
  '/tickets',
  asyncHandler(async (_req, res) => {
    const tickets = await prisma.supportTicket.findMany({
      include: { requester: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    })
    res.json({
      tickets: tickets.map((t) => ({
        id: t.id,
        subject: t.subject,
        requester: t.requester.fullName,
        priority: t.priority,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
      })),
    })
  }),
)

const ticketStatusSchema = z.object({ status: z.enum(['open', 'in_progress', 'resolved']) })

adminRouter.patch(
  '/tickets/:id',
  asyncHandler(async (req, res) => {
    const { status } = ticketStatusSchema.parse(req.body)
    const ticket = await prisma.supportTicket.findUnique({ where: { id: req.params.id } })
    if (!ticket) throw notFound('Ticket not found')

    const updated = await prisma.supportTicket.update({ where: { id: req.params.id }, data: { status } })
    await writeAuditLog(req.user!.id, `Set ticket status to ${status}`, ticket.subject)

    res.json({ ticket: { id: updated.id, status: updated.status } })
  }),
)

// ---- Audit logs ----
adminRouter.get(
  '/audit-logs',
  asyncHandler(async (_req, res) => {
    const logs = await prisma.auditLogEntry.findMany({
      include: { actor: true },
      orderBy: { timestamp: 'desc' },
      take: 200,
    })
    res.json({
      logs: logs.map((l) => ({
        id: l.id,
        actor: l.actor.fullName,
        action: l.action,
        target: l.target,
        timestamp: l.timestamp.toISOString(),
      })),
    })
  }),
)

// ---- Subscriptions ----
adminRouter.get(
  '/subscriptions',
  asyncHandler(async (_req, res) => {
    const subscriptions = await prisma.subscription.findMany({ include: { user: true } })
    res.json({
      subscriptions: subscriptions.map((s) => ({
        id: s.id,
        userName: s.user.fullName,
        tier: s.tier,
        renewsAt: s.renewsAt.toISOString(),
        amount: s.amount,
      })),
    })
  }),
)

// ---- System health ----
adminRouter.get(
  '/system-health',
  asyncHandler(async (_req, res) => {
    const metrics: { label: string; value: string; status: 'operational' | 'degraded' | 'down' }[] = []

    metrics.push({ label: 'API uptime', value: `${Math.floor(process.uptime() / 60)} min`, status: 'operational' })

    const dbStart = Date.now()
    try {
      await prisma.$queryRaw`SELECT 1`
      metrics.push({ label: 'Database', value: `${Date.now() - dbStart}ms response`, status: 'operational' })
    } catch {
      metrics.push({ label: 'Database', value: 'Unreachable', status: 'down' })
    }

    // Pilot-scope note: SMS delivery and payments gateway metrics are
    // intentionally omitted here since no SMS or payments provider is
    // integrated yet — see README "Known limitations".

    res.json({ metrics })
  }),
)

// ---- Analytics ----
adminRouter.get(
  '/analytics',
  asyncHandler(async (_req, res) => {
    const [users, orders, usersByRole, usersByDistrict] = await Promise.all([
      prisma.user.findMany({ select: { createdAt: true } }),
      prisma.order.findMany({ where: { status: 'completed' }, select: { createdAt: true, totalAmount: true } }),
      prisma.user.groupBy({ by: ['role'], _count: { role: true } }),
      prisma.user.groupBy({ by: ['district'], _count: { district: true }, orderBy: { _count: { district: 'desc' } }, take: 6 }),
    ])

    const monthKey = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
    const monthLabel = (key: string) => new Date(`${key}-01`).toLocaleString('en-US', { month: 'short' })

    const usersByMonth = new Map<string, number>()
    for (const u of users) usersByMonth.set(monthKey(u.createdAt), (usersByMonth.get(monthKey(u.createdAt)) ?? 0) + 1)

    const revenueByMonth = new Map<string, number>()
    const ordersByMonth = new Map<string, number>()
    for (const o of orders) {
      const key = monthKey(o.createdAt)
      revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + o.totalAmount)
      ordersByMonth.set(key, (ordersByMonth.get(key) ?? 0) + 1)
    }

    const months = [...new Set([...usersByMonth.keys(), ...revenueByMonth.keys()])].sort()

    res.json({
      platformGrowth: months.map((key) => ({
        label: monthLabel(key),
        users: usersByMonth.get(key) ?? 0,
        orders: ordersByMonth.get(key) ?? 0,
      })),
      usersByRole: usersByRole.map((r) => ({ role: r.role, count: r._count.role })),
      usersByDistrict: usersByDistrict.map((d) => ({ district: d.district, count: d._count.district })),
      revenueByMonth: months.map((key) => ({ label: monthLabel(key), amount: revenueByMonth.get(key) ?? 0 })),
    })
  }),
)

// ---- AI assistant ----
const assistantSchema = z.object({ message: z.string().min(1) })

adminRouter.post(
  '/assistant',
  asyncHandler(async (req, res) => {
    const { message } = assistantSchema.parse(req.body)
    const reply = await askAdminAssistant(message)
    res.json({ reply })
  }),
)
