import type { VercelRequest, VercelResponse } from '@vercel/node'
import { query } from '../_lib/db.js'
import { comparePassword, signToken } from '../_lib/auth.js'
import { methods } from '../_lib/handler.js'

interface AuthRow {
  id: string
  name: string
  email: string
  password_hash: string
  role: string
  organisation: string
  avatar: string
}

async function POST(req: VercelRequest, res: VercelResponse) {
  const { email, password } = (req.body ?? {}) as { email?: string; password?: string }
  if (!email || !password) {
    res.status(400).json({ error: 'email and password required' })
    return
  }
  const rows = await query<AuthRow>('SELECT * FROM auth_users WHERE LOWER(email) = LOWER(?) LIMIT 1', [email])
  const row = rows[0]
  if (!row || !(await comparePassword(password, row.password_hash))) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }
  const token = signToken({ id: row.id, email: row.email, role: row.role, organisation: row.organisation })
  res.status(200).json({
    token,
    user: {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      organisation: row.organisation,
      avatar: row.avatar ?? '',
    },
  })
}

export default methods({ POST })
