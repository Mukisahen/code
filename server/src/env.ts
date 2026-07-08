import 'dotenv/config'

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

const isProduction = process.env.NODE_ENV === 'production'

const jwtSecret = required('JWT_SECRET')
if (jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters — generate one with `openssl rand -base64 48`')
}

const rawCorsOrigin = process.env.CORS_ORIGIN ?? '*'
if (isProduction && rawCorsOrigin === '*') {
  throw new Error('CORS_ORIGIN must be set to your real frontend origin(s) in production, not "*"')
}
// Comma-separated so the same deployment can serve both the web PWA (its own
// https:// origin) and the Capacitor Android app, which makes requests from
// an internal WebView origin (https://localhost by default), not the PWA's URL.
const corsOrigin = rawCorsOrigin === '*' ? '*' : rawCorsOrigin.split(',').map((o) => o.trim())

export const env = {
  isProduction,
  databaseUrl: required('DATABASE_URL'),
  jwtSecret,
  port: Number(process.env.PORT ?? 4000),
  uploadsDir: process.env.UPLOADS_DIR ?? './uploads',
  publicUploadsBaseUrl: process.env.PUBLIC_UPLOADS_BASE_URL ?? 'http://localhost:4000/uploads',
  corsOrigin,
  // Optional: without this, automatic market-price updates are simply
  // skipped and admin-entered prices remain the only source — see
  // lib/marketPriceFeed.ts.
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
}
