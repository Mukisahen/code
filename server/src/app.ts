import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'node:path'
import { env } from './env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'
import { productsRouter } from './routes/products.js'
import { offersRouter } from './routes/offers.js'
import { ordersRouter } from './routes/orders.js'
import { buyerRequestsRouter } from './routes/buyerRequests.js'
import { favoritesRouter } from './routes/favorites.js'
import { conversationsRouter } from './routes/conversations.js'
import { notificationsRouter } from './routes/notifications.js'
import { cropDoctorRouter } from './routes/cropDoctor.js'
import { marketPricesRouter } from './routes/marketPrices.js'
import { weatherRouter } from './routes/weather.js'
import { districtsRouter } from './routes/districts.js'
import { usersRouter } from './routes/users.js'
import { adminRouter } from './routes/admin.js'

export function createApp() {
  const app = express()

  // Behind the Caddy reverse proxy in production, so req.ip reflects the real
  // client (needed for the auth rate limiter) instead of the proxy's address.
  app.set('trust proxy', 1)

  // contentSecurityPolicy/CORP are tuned off: this is a JSON API plus a public
  // /uploads image host consumed by a separate frontend origin, not an HTML app.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(cors({ origin: env.corsOrigin }))
  app.use(express.json())
  app.use('/uploads', express.static(path.resolve(env.uploadsDir)))

  app.get('/health', (_req, res) => res.json({ status: 'ok' }))

  app.use('/api/auth', authRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/products', productsRouter)
  app.use('/api/offers', offersRouter)
  app.use('/api/orders', ordersRouter)
  app.use('/api/buyer-requests', buyerRequestsRouter)
  app.use('/api/favorites', favoritesRouter)
  app.use('/api/conversations', conversationsRouter)
  app.use('/api/notifications', notificationsRouter)
  app.use('/api/crop-doctor', cropDoctorRouter)
  app.use('/api/market-prices', marketPricesRouter)
  app.use('/api/weather', weatherRouter)
  app.use('/api/districts', districtsRouter)
  app.use('/api/admin', adminRouter)

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }))
  app.use(errorHandler)

  return app
}
