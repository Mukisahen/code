import { Router } from 'express'

export const districtsRouter = Router()

// Kept in sync with the frontend's src/mocks/districts.ts list.
const UGANDA_MAIZE_DISTRICTS = [
  'Kapchorwa',
  'Kasese',
  'Masindi',
  'Iganga',
  'Mayuge',
  'Mubende',
  'Kiboga',
  'Luwero',
  'Kayunga',
  'Mukono',
  'Jinja',
  'Mbale',
  'Ntungamo',
  'Kamwenge',
  'Kibaale',
  'Nakaseke',
  'Bugiri',
  'Serere',
  'Lira',
  'Gulu',
  'Kitgum',
]

districtsRouter.get('/', (_req, res) => {
  res.json({ districts: UGANDA_MAIZE_DISTRICTS })
})
