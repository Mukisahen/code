import type { AdminFaqEntry } from '@/types/adminAssistant'

/** How-to guidance for common admin operational questions. */
export const ADMIN_FAQ: AdminFaqEntry[] = [
  {
    id: 'admin-faq-verify',
    keywords: ['verify', 'verification', 'approve user', 'kyc'],
    question: 'How do I verify a new user?',
    answer:
      'Open the Verification tab to review pending applications. Check the submitted document type and district, then Approve or Reject — approved users are notified automatically.',
  },
  {
    id: 'admin-faq-suspend',
    keywords: ['suspend', 'ban', 'block user', 'suspicious'],
    question: 'How do I suspend a suspicious account?',
    answer:
      'Go to the Users tab, find the account, and click Suspend. This immediately blocks their marketplace and messaging access. You can Reactivate the same way once resolved.',
  },
  {
    id: 'admin-faq-ticket',
    keywords: ['ticket', 'support request', 'complaint'],
    question: 'How do I resolve a support ticket?',
    answer:
      'Support tickets are listed under the Support tab, sorted by priority. High-priority tickets (payments, account access) should be triaged first.',
  },
  {
    id: 'admin-faq-report',
    keywords: ['report', 'export', 'download report'],
    question: 'How do I export a report?',
    answer:
      'Head to Reports for downloadable summaries (sales, quality, inventory), or Analytics for live charts on growth, revenue and user distribution.',
  },
  {
    id: 'admin-faq-listing',
    keywords: ['listing', 'flagged', 'remove product'],
    question: 'What do I do with a flagged listing?',
    answer:
      'Flagged or suspicious listings show up under the Marketplace tab. Review the listing details and seller history before removing it — removals are logged to Audit Logs.',
  },
  {
    id: 'admin-faq-greeting',
    keywords: ['hello', 'hi', 'hey'],
    question: 'Hello!',
    answer:
      'Hello! I\'m your admin assistant. Ask me things like "how many pending verifications" or "how do I suspend a user".',
  },
]

export const ADMIN_FALLBACK_RESPONSE =
  "I don't have an answer for that yet. Try asking about verifications, suspending users, support tickets, reports, or flagged listings — or a quick stat like \"how many open tickets\"."
