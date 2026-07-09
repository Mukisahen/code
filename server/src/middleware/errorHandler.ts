import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { MulterError } from 'multer'
import { HttpError } from '../lib/httpError.js'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: err.flatten() })
    return
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message })
    return
  }

  if (err instanceof MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : err.message
    res.status(400).json({ error: message })
    return
  }

  if (err instanceof Error && err.message === 'This file type is not allowed') {
    res.status(400).json({ error: err.message })
    return
  }

  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
