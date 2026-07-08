import { createApp } from './app.js'
import { env } from './env.js'
import { prisma } from './lib/prisma.js'
import { runAutomaticMarketPriceUpdate } from './lib/marketPriceFeed.js'

const app = createApp()

const server = app.listen(env.port, () => {
  console.log(`Farm Bhade API listening on port ${env.port}`)
})

const MARKET_PRICE_UPDATE_INTERVAL_MS = 24 * 60 * 60 * 1000

function scheduleMarketPriceUpdates() {
  runAutomaticMarketPriceUpdate().then((result) => console.log('Automatic market price update:', result))
  const interval = setInterval(() => {
    runAutomaticMarketPriceUpdate().then((result) => console.log('Automatic market price update:', result))
  }, MARKET_PRICE_UPDATE_INTERVAL_MS)
  interval.unref()
}

scheduleMarketPriceUpdates()

function shutdown() {
  server.close(() => {
    prisma.$disconnect().finally(() => process.exit(0))
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
