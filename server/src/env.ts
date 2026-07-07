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

const corsOrigin = process.env.CORS_ORIGIN ?? '*'
if (isProduction && corsOrigin === '*') {
  throw new Error('CORS_ORIGIN must be set to your real frontend origin in production, not "*"')
}

export const env = {
  isProduction,
  databaseUrl: required('DATABASE_URL'),
  jwtSecret,
  port: Number(process.env.PORT ?? 4000),
  uploadsDir: process.env.UPLOADS_DIR ?? './uploads',
  publicUploadsBaseUrl: process.env.PUBLIC_UPLOADS_BASE_URL ?? 'http://localhost:4000/uploads',
  corsOrigin,
}
