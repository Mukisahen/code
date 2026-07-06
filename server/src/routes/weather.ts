import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { fetchWeatherForCoordinates } from '../lib/openMeteo.js'
import { DISTRICT_COORDINATES, UGANDA_FALLBACK_COORDINATES } from '../lib/districtCoordinates.js'

export const weatherRouter = Router()

const CACHE_TTL_MS = 60 * 60 * 1000

weatherRouter.get(
  '/:district',
  asyncHandler(async (req, res) => {
    const district = req.params.district

    const cached = await prisma.weatherCache.findUnique({ where: { district } })
    if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_TTL_MS) {
      return res.json({ weather: { district, ...(cached.payload as object) } })
    }

    const { lat, lon } = DISTRICT_COORDINATES[district] ?? UGANDA_FALLBACK_COORDINATES
    const payload = await fetchWeatherForCoordinates(lat, lon)

    await prisma.weatherCache.upsert({
      where: { district },
      create: { district, payload },
      update: { payload, fetchedAt: new Date() },
    })

    res.json({ weather: { district, ...payload } })
  }),
)
