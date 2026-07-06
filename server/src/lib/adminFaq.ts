export interface AdminFaqEntry {
  id: string
  keywords: string[]
  question: string
  answer: string
}

export const ADMIN_FAQ: AdminFaqEntry[] = [
  {
    id: 'faq-verify',
    keywords: ['verify', 'verification', 'document', 'kyc'],
    question: 'How do I verify a new user?',
    answer:
      'Go to the Verification tab, review the submitted document type, and approve or reject. Approved users get a verified badge across the marketplace; rejections notify the applicant.',
  },
  {
    id: 'faq-suspend',
    keywords: ['suspend', 'ban', 'block', 'deactivate'],
    question: 'How do I suspend a user?',
    answer:
      'In the Users tab, find the account and use the Suspend action. Suspended users cannot log in until reactivated, and the action is written to the Audit Logs.',
  },
  {
    id: 'faq-listing',
    keywords: ['listing', 'flag', 'remove', 'suspicious', 'moderation'],
    question: 'What do I do about a suspicious listing?',
    answer:
      'Flagged or suspicious listings should be reviewed in the Marketplace tab. Removals are logged to Audit Logs so the action is traceable.',
  },
  {
    id: 'faq-ticket',
    keywords: ['ticket', 'support', 'complaint'],
    question: 'How are support tickets prioritized?',
    answer: 'Tickets are tagged low/medium/high priority by the reporter. Handle high-priority tickets first, especially payment or account-access issues.',
  },
  {
    id: 'faq-subscription',
    keywords: ['subscription', 'premium', 'billing', 'renew'],
    question: 'Where do I see subscription status?',
    answer: 'The Subscriptions tab lists each user\'s tier, renewal date, and amount. There is no self-serve billing portal yet in this pilot phase.',
  },
]

export const ADMIN_FALLBACK_RESPONSE =
  "I don't have a specific answer for that yet. Try asking about verification, suspending users, flagged listings, support tickets, or subscriptions."
