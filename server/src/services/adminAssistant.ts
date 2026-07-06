import { prisma } from '../lib/prisma.js'
import { ADMIN_FAQ, ADMIN_FALLBACK_RESPONSE } from '../lib/adminFaq.js'

async function tryAnswerFromLiveData(input: string): Promise<string | null> {
  const lower = input.toLowerCase()

  if (lower.includes('pending verification') || (lower.includes('verification') && lower.includes('how many'))) {
    const count = await prisma.verificationRequest.count({ where: { status: 'pending' } })
    return `There ${count === 1 ? 'is' : 'are'} currently ${count} pending verification request${count === 1 ? '' : 's'}.`
  }

  if (lower.includes('open ticket') || (lower.includes('ticket') && lower.includes('how many'))) {
    const count = await prisma.supportTicket.count({ where: { status: 'open' } })
    return `There ${count === 1 ? 'is' : 'are'} currently ${count} open support ticket${count === 1 ? '' : 's'}.`
  }

  if (lower.includes('suspended')) {
    const count = await prisma.user.count({ where: { status: 'suspended' } })
    return `There ${count === 1 ? 'is' : 'are'} currently ${count} suspended account${count === 1 ? '' : 's'}.`
  }

  if (lower.includes('total user') || (lower.includes('user') && lower.includes('how many'))) {
    const count = await prisma.user.count()
    return `Farm Bhade currently has ${count} registered users.`
  }

  if (lower.includes('system health') || lower.includes('is the system') || lower.includes('platform status')) {
    return 'Check the System Health tab for live API and database status.'
  }

  return null
}

function answerFromFaq(input: string): string {
  const lower = input.toLowerCase()
  let best: { entry: (typeof ADMIN_FAQ)[number]; score: number } | null = null

  for (const entry of ADMIN_FAQ) {
    const score = entry.keywords.filter((k) => lower.includes(k)).length
    if (score > 0 && (!best || score > best.score)) best = { entry, score }
  }

  return best?.entry.answer ?? ADMIN_FALLBACK_RESPONSE
}

export async function askAdminAssistant(input: string): Promise<string> {
  const liveAnswer = await tryAnswerFromLiveData(input)
  if (liveAnswer) return liveAnswer
  return answerFromFaq(input)
}
