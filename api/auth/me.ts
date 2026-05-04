import { query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'

export default methods({
  GET: withAuth(async (_req, res, jwtUser) => {
    const rows = await query<{
      id: string
      name: string
      email: string
      role: string
      organisation: string
      avatar: string
    }>(
      'SELECT id, name, email, role, organisation, avatar FROM auth_users WHERE id = ? LIMIT 1',
      [jwtUser.id],
    )
    if (!rows[0]) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.status(200).json(rows[0])
  }),
})
