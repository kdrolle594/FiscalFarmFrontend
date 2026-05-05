import { exec, query } from './_lib/db.js'
import { methods, withAuth } from './_lib/handler.js'
import { platformUserRow } from './_lib/mappers.js'

export default methods({
  GET: withAuth(async (req, res) => {
    const id = req.query.id as string | undefined
    if (id) {
      const rows = await query('SELECT * FROM platform_users WHERE id = ?', [id])
      if (!rows[0]) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(platformUserRow(rows[0]))
    }
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
  PUT: withAuth(async (req, res) => {
    const id = req.query.id as string
    const u = req.body ?? {}
    await exec(
      `UPDATE platform_users SET name=?, email=?, organisation=?, organisation_id=?, active=? WHERE id=?`,
      [u.name, u.email, u.organisation ?? '', u.organisationId ?? '', !!u.active, id],
    )
    const rows = await query('SELECT * FROM platform_users WHERE id = ?', [id])
    res.status(200).json(platformUserRow(rows[0]))
  }),
  DELETE: withAuth(async (req, res) => {
    await exec('DELETE FROM platform_users WHERE id = ?', [req.query.id])
    res.status(204).end()
  }),
})
