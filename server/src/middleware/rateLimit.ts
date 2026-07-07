import rateLimit from 'express-rate-limit'

// Real farmer phone numbers + passwords are at stake in the pilot, so auth
// endpoints get a strict per-IP limit against brute-force/credential-stuffing.
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
})
