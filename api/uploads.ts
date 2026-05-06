import { randomUUID } from 'node:crypto'
import { methods, withAuth } from './_lib/handler.js'
import { getSupabase, IMAGES_BUCKET } from './_lib/supabase.js'

const ALLOWED_KINDS: Record<string, string> = {
  avatar: 'avatars',
  'bank-logo': 'bank-logos',
  'loan-program-logo': 'loan-program-logos',
}

const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

const MAX_BYTES = 5 * 1024 * 1024

export const config = { api: { bodyParser: { sizeLimit: '8mb' } } }

export default methods({
  POST: withAuth(async (req, res) => {
    const { kind, contentType, dataBase64 } = req.body ?? {}
    const folder = ALLOWED_KINDS[kind]
    if (!folder) return res.status(400).json({ error: 'Invalid kind' })
    const ext = ALLOWED_TYPES[contentType]
    if (!ext) return res.status(400).json({ error: 'Unsupported content type' })
    if (typeof dataBase64 !== 'string' || !dataBase64) {
      return res.status(400).json({ error: 'Missing file data' })
    }

    const buffer = Buffer.from(dataBase64, 'base64')
    if (buffer.byteLength === 0) return res.status(400).json({ error: 'Empty file' })
    if (buffer.byteLength > MAX_BYTES) return res.status(413).json({ error: 'File too large' })

    const path = `${folder}/${randomUUID()}.${ext}`
    const supabase = getSupabase()
    const { error } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(path, buffer, { contentType, upsert: false })
    if (error) return res.status(500).json({ error: error.message })

    const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path)
    res.status(201).json({ path, publicUrl: data.publicUrl })
  }),
})
