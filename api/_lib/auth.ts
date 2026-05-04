import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { VercelRequest } from '@vercel/node'

export interface JwtUser {
  id: string
  email: string
  role: string
  organisation: string
}

function secret(): string {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET not set')
  return s
}

export function signToken(user: JwtUser): string {
  return jwt.sign(user, secret(), { expiresIn: '7d' })
}

export function verifyToken(req: VercelRequest): JwtUser | null {
  const header = req.headers.authorization || ''
  const m = /^Bearer\s+(.+)$/.exec(header)
  if (!m) return null
  try {
    return jwt.verify(m[1], secret()) as JwtUser
  } catch {
    return null
  }
}

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10)
export const comparePassword = (pw: string, hash: string) => bcrypt.compare(pw, hash)
