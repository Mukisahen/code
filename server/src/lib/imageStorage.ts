import sharp from 'sharp'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs/promises'
import { env } from '../env.js'

export async function saveUploadedImage(buffer: Buffer, subdir: string, maxWidth = 1600): Promise<string> {
  const dir = path.resolve(env.uploadsDir, subdir)
  await fs.mkdir(dir, { recursive: true })

  const filename = `${randomUUID()}.jpg`
  await sharp(buffer).rotate().resize({ width: maxWidth, withoutEnlargement: true }).jpeg({ quality: 78 }).toFile(path.join(dir, filename))

  return `${env.publicUploadsBaseUrl}/${subdir}/${filename}`
}
