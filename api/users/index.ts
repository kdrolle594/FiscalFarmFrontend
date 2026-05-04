import { exec, query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { platformUserRow } from '../_lib/mappers'

export default methods({
  GET: withAuth(async (_req, res) => {
    const rows = await query('SELECT * FROM platform_users ORDER BY name')
    res.status(200).json(rows.map(platformUserRow))
  }),
  POST: withAuth(async (req, res) => {
    const u = req.body ?? {}
    const id = u.id ?? `pu-${Date.now()}`
    await exec(
      `INSERT INTO platform_users (id, name, email, organisation, organisation_id, active, created_at)
       VALUES (?,?,?,?,?,?,?)`,
      [id, u.name, u.email, u.organisation ?? '', u.organisationId ?? '', u.active ?? true,
       u.createdAt ?? new Date().toISOString().slice(0, 10)],
    )
    const rows = await query('SELECT * FROM platform_users WHERE id = ?', [id])
    res.status(201).json(platformUserRow(rows[0]))
  }),
})
