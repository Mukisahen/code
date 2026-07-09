import { randomUUID } from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs/promises'
import { env } from '../env.js'

/** Saves an arbitrary (non-image) file to disk as-is and returns its public URL. */
export async function saveUploadedFile(buffer: Buffer, subdir: string, originalName: string): Promise<string> {
  const dir = path.resolve(env.uploadsDir, subdir)
  await fs.mkdir(dir, { recursive: true })

  const ext = path.extname(originalName).slice(0, 12).replace(/[^a-zA-Z0-9.]/g, '')
  const filename = `${randomUUID()}${ext}`
  await fs.writeFile(path.join(dir, filename), buffer)

  return `${env.publicUploadsBaseUrl}/${subdir}/${filename}`
}
