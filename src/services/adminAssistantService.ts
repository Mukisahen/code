import { ADMIN_FAQ, ADMIN_FALLBACK_RESPONSE } from '@/mocks/adminFaq'
import { MOCK_ADMIN_USERS, MOCK_VERIFICATION_REQUESTS, MOCK_SUPPORT_TICKETS, MOCK_SYSTEM_HEALTH } from '@/mocks/admin'
import { PLATFORM_GROWTH } from '@/mocks/analytics'

const RESPONSE_DELAY_MS = 650

function delay<T>(value: T, ms = RESPONSE_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function tryAnswerFromLiveData(input: string): string | null {
  const q = input.toLowerCase()

  if (q.includes('pending verification') || (q.includes('verification') && q.includes('how many'))) {
    const pending = MOCK_VERIFICATION_REQUESTS.filter((v) => v.status === 'pending').length
    return `There ${pending === 1 ? 'is' : 'are'} currently ${pending} pending verification request${pending === 1 ? '' : 's'}. Check the Verification tab to review them.`
  }

  if (q.includes('open ticket') || (q.includes('ticket') && q.includes('how many'))) {
    const open = MOCK_SUPPORT_TICKETS.filter((t) => t.status !== 'resolved').length
    const highPriority = MOCK_SUPPORT_TICKETS.filter((t) => t.status !== 'resolved' && t.priority === 'high').length
    return `There ${open === 1 ? 'is' : 'are'} ${open} open support ticket${open === 1 ? '' : 's'}${highPriority > 0 ? `, including ${highPriority} high-priority` : ''}. See the Support tab for details.`
  }

  if (q.includes('suspended')) {
    const suspended = MOCK_ADMIN_USERS.filter((u) => u.status === 'suspended').length
    return `${suspended} account${suspended === 1 ? ' is' : 's are'} currently suspended.`
  }

  if (q.includes('how many user') || q.includes('total user')) {
    const total = PLATFORM_GROWTH.at(-1)?.users ?? MOCK_ADMIN_USERS.length
    return `The platform has ${total.toLocaleString()} registered users so far.`
  }

  if (q.includes('system') && (q.includes('status') || q.includes('health') || q.includes('issue'))) {
    const degraded = MOCK_SYSTEM_HEALTH.filter((m) => m.status !== 'operational')
    if (degraded.length === 0) return 'All systems are operational — no issues detected right now.'
    return `${degraded.length} system${degraded.length === 1 ? ' is' : 's are'} not fully operational: ${degraded.map((m) => `${m.label} (${m.status})`).join(', ')}.`
  }

  return null
}

function scoreEntry(input: string, keywords: string[]): number {
  const normalized = input.toLowerCase()
  return keywords.reduce((score, keyword) => (normalized.includes(keyword.toLowerCase()) ? score + 1 : score), 0)
}

export async function askAdminAssistant(input: string): Promise<string> {
  const liveAnswer = tryAnswerFromLiveData(input)
  if (liveAnswer) return delay(liveAnswer)

  let bestScore = 0
  let bestAnswer: string | null = null
  for (const entry of ADMIN_FAQ) {
    const score = scoreEntry(input, entry.keywords)
    if (score > bestScore) {
      bestScore = score
      bestAnswer = entry.answer
    }
  }

  return delay(bestAnswer ?? ADMIN_FALLBACK_RESPONSE)
}
