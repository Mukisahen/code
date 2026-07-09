import multer from 'multer'

// Node's default heap plus Render's free-tier RAM can't safely buffer a
// 500MB multipart upload in memory (multer's memoryStorage holds the whole
// file before we write it to disk) — capped at a size that's generous for
// photos and documents without risking an out-of-memory crash on the pilot
// deployment. Raise this if the app moves to disk-streaming uploads and a
// larger instance.
export const CHAT_MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024

const BLOCKED_EXTENSIONS = new Set(['.exe', '.sh', '.bat', '.cmd', '.msi', '.apk'])

export const chatUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: CHAT_MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = `.${file.originalname.split('.').pop()?.toLowerCase() ?? ''}`
    if (BLOCKED_EXTENSIONS.has(ext)) {
      cb(new Error('This file type is not allowed'))
      return
    }
    cb(null, true)
  },
})
