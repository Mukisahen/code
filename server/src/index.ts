import { createApp } from './app.js'
import { env } from './env.js'
import { prisma } from './lib/prisma.js'

const app = createApp()

const server = app.listen(env.port, () => {
  console.log(`Farm Bhade API listening on port ${env.port}`)
})

function shutdown() {
  server.close(() => {
    prisma.$disconnect().finally(() => process.exit(0))
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
