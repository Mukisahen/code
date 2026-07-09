import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { chatUpload } from '../middleware/chatUpload.js'
import { saveUploadedImage } from '../lib/imageStorage.js'
import { saveUploadedFile } from '../lib/fileStorage.js'
import { initials } from '../lib/serialize.js'
import { badRequest, forbidden, notFound } from '../lib/httpError.js'

export const conversationsRouter = Router()

conversationsRouter.use(requireAuth)

const ONLINE_WINDOW_MS = 5 * 60 * 1000

conversationsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const memberships = await prisma.conversationParticipant.findMany({
      where: { userId: req.user!.id, conversation: { type: 'direct' } },
      include: {
        conversation: {
          include: {
            participants: { include: { user: true } },
            messages: { orderBy: { sentAt: 'desc' }, take: 1 },
          },
        },
      },
      orderBy: { conversation: { lastMessageAt: 'desc' } },
    })

    const conversations = memberships.map((m) => {
      const other = m.conversation.participants.find((p) => p.userId !== req.user!.id)?.user
      const last = m.conversation.messages[0]
      return {
        id: m.conversation.id,
        participantName: other?.fullName ?? 'Unknown',
        participantInitials: other ? initials(other.fullName) : '?',
        participantAvatarUrl: other?.avatarUrl ?? undefined,
        participantRole: other?.role,
        participantPhone: other?.phone,
        lastMessage: last?.text ?? '',
        lastMessageAt: (last?.sentAt ?? m.conversation.lastMessageAt).toISOString(),
        unreadCount: m.unreadCount,
        productContext: m.conversation.productContext ?? undefined,
      }
    })

    res.json({ conversations })
  }),
)

const directSchema = z.object({ otherUserId: z.string(), productContext: z.string().optional() })

conversationsRouter.post(
  '/direct',
  asyncHandler(async (req, res) => {
    const { otherUserId, productContext } = directSchema.parse(req.body)
    if (otherUserId === req.user!.id) throw badRequest('Cannot start a conversation with yourself')

    const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } })
    if (!otherUser) throw notFound('User not found')

    const existing = await prisma.conversation.findFirst({
      where: {
        type: 'direct',
        AND: [
          { participants: { some: { userId: req.user!.id } } },
          { participants: { some: { userId: otherUserId } } },
        ],
      },
    })
    if (existing) return res.json({ conversationId: existing.id })

    const conversation = await prisma.conversation.create({
      data: {
        type: 'direct',
        productContext,
        participants: {
          create: [{ userId: req.user!.id }, { userId: otherUserId }],
        },
      },
    })

    res.status(201).json({ conversationId: conversation.id })
  }),
)

conversationsRouter.get(
  '/community',
  asyncHandler(async (req, res) => {
    let conversation = await prisma.conversation.findFirst({ where: { type: 'community' } })
    if (!conversation) {
      conversation = await prisma.conversation.create({ data: { type: 'community' } })
    }

    const participant = await prisma.conversationParticipant.upsert({
      where: { conversationId_userId: { conversationId: conversation.id, userId: req.user!.id } },
      create: { conversationId: conversation.id, userId: req.user!.id },
      update: {},
    })

    // Every non-admin role is discoverable here so farmers, buyers, and
    // processors can all find and message each other — admins have their own
    // channel via the support-ticket/feedback flow instead of open chat.
    const members = await prisma.user.findMany({
      where: { role: { in: ['farmer', 'buyer', 'processor'] }, id: { not: req.user!.id } },
      orderBy: { fullName: 'asc' },
    })

    const now = Date.now()
    res.json({
      conversationId: conversation.id,
      unreadCount: participant.unreadCount,
      members: members.map((f) => ({
        id: f.id,
        name: f.fullName,
        role: f.role,
        initials: initials(f.fullName),
        avatarUrl: f.avatarUrl ?? undefined,
        district: f.district,
        online: !!f.lastSeenAt && now - f.lastSeenAt.getTime() < ONLINE_WINDOW_MS,
      })),
    })
  }),
)

conversationsRouter.get(
  '/:id/messages',
  asyncHandler(async (req, res) => {
    const membership = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: req.params.id, userId: req.user!.id } },
    })
    if (!membership) throw forbidden('Not a participant in this conversation')

    const since = req.query.since ? new Date(String(req.query.since)) : undefined

    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id, ...(since ? { sentAt: { gt: since } } : {}) },
      orderBy: { sentAt: 'asc' },
      include: { sender: true },
    })

    if (!since) {
      await prisma.conversationParticipant.update({
        where: { id: membership.id },
        data: { unreadCount: 0 },
      })
    }

    res.json({
      messages: messages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId === req.user!.id ? 'me' : m.senderId,
        senderName: m.sender.fullName,
        text: m.text,
        sentAt: m.sentAt.toISOString(),
        attachmentUrl: m.attachmentUrl ?? undefined,
        attachmentType: m.attachmentType ?? undefined,
        attachmentName: m.attachmentName ?? undefined,
        attachmentSize: m.attachmentSize ?? undefined,
      })),
    })
  }),
)

const sendSchema = z.object({ text: z.string().min(1) })

conversationsRouter.post(
  '/:id/messages',
  asyncHandler(async (req, res) => {
    const { text } = sendSchema.parse(req.body)

    const membership = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: req.params.id, userId: req.user!.id } },
    })
    if (!membership) throw forbidden('Not a participant in this conversation')

    const message = await prisma.message.create({
      data: { conversationId: req.params.id, senderId: req.user!.id, text },
      include: { sender: true },
    })

    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { lastMessageAt: message.sentAt },
    })

    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: { conversationId: req.params.id, userId: { not: req.user!.id } },
    })

    await prisma.conversationParticipant.updateMany({
      where: { id: { in: otherParticipants.map((p) => p.id) } },
      data: { unreadCount: { increment: 1 } },
    })

    await prisma.notification.createMany({
      data: otherParticipants.map((p) => ({
        userId: p.userId,
        type: 'message' as const,
        title: `New message from ${req.user!.fullName}`,
        description: text.slice(0, 80),
      })),
    })

    res.status(201).json({
      message: {
        id: message.id,
        conversationId: message.conversationId,
        senderId: 'me',
        senderName: message.sender.fullName,
        text: message.text,
        sentAt: message.sentAt.toISOString(),
      },
    })
  }),
)

conversationsRouter.post(
  '/:id/attachments',
  chatUpload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw badRequest('A file is required')

    const membership = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: req.params.id, userId: req.user!.id } },
    })
    if (!membership) throw forbidden('Not a participant in this conversation')

    const isImage = req.file.mimetype.startsWith('image/')
    const attachmentUrl = isImage
      ? await saveUploadedImage(req.file.buffer, 'chat', 1600)
      : await saveUploadedFile(req.file.buffer, 'chat-files', req.file.originalname)

    const caption = typeof req.body.caption === 'string' ? req.body.caption.trim() : ''

    const message = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        senderId: req.user!.id,
        text: caption,
        attachmentUrl,
        attachmentType: isImage ? 'image' : 'file',
        attachmentName: req.file.originalname,
        attachmentSize: req.file.size,
      },
      include: { sender: true },
    })

    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { lastMessageAt: message.sentAt },
    })

    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: { conversationId: req.params.id, userId: { not: req.user!.id } },
    })

    await prisma.conversationParticipant.updateMany({
      where: { id: { in: otherParticipants.map((p) => p.id) } },
      data: { unreadCount: { increment: 1 } },
    })

    await prisma.notification.createMany({
      data: otherParticipants.map((p) => ({
        userId: p.userId,
        type: 'message' as const,
        title: `New message from ${req.user!.fullName}`,
        description: isImage ? '📷 Sent a photo' : `📎 Sent a file — ${req.file!.originalname}`,
      })),
    })

    res.status(201).json({
      message: {
        id: message.id,
        conversationId: message.conversationId,
        senderId: 'me',
        senderName: message.sender.fullName,
        text: message.text,
        sentAt: message.sentAt.toISOString(),
        attachmentUrl: message.attachmentUrl ?? undefined,
        attachmentType: message.attachmentType ?? undefined,
        attachmentName: message.attachmentName ?? undefined,
        attachmentSize: message.attachmentSize ?? undefined,
      },
    })
  }),
)
