import { Router } from 'express'
import { z } from 'zod'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { requireAuth } from '../middleware/auth.js'
import { askClaude } from '../lib/claudeAssistant.js'

export const chatbotRouter = Router()

chatbotRouter.use(requireAuth)

const askSchema = z.object({
  message: z.string().min(1).max(1000),
  lang: z.enum(['en', 'lg']).default('en'),
})

chatbotRouter.post(
  '/ask',
  asyncHandler(async (req, res) => {
    const { message, lang } = askSchema.parse(req.body)
    const reply = await askClaude(message, lang)
    // `reply` is null when Claude isn't configured or the call failed — the
    // frontend falls back to its local keyword-matched FAQ in that case.
    res.json({ reply })
  }),
)
