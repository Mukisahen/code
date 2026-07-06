import 'dotenv/config'

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export const env = {
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  port: Number(process.env.PORT ?? 4000),
  uploadsDir: process.env.UPLOADS_DIR ?? './uploads',
  publicUploadsBaseUrl: process.env.PUBLIC_UPLOADS_BASE_URL ?? 'http://localhost:4000/uploads',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
}
