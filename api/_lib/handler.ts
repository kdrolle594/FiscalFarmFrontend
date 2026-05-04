import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyToken, type JwtUser } from './auth'

export type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void> | void
export type AuthedHandler = (req: VercelRequest, res: VercelResponse, user: JwtUser) => Promise<void> | void

export function withAuth(handler: AuthedHandler): Handler {
  return async (req, res) => {
    const user = verifyToken(req)
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    await handler(req, res, user)
  }
}

export function methods(map: Partial<Record<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', Handler>>): Handler {
  return async (req, res) => {
    const fn = map[req.method as keyof typeof map]
    if (!fn) {
      res.setHeader('Allow', Object.keys(map).join(', '))
      res.status(405).json({ error: 'Method Not Allowed' })
      return
    }
    try {
      await fn(req, res)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: (err as Error).message })
    }
  }
}
