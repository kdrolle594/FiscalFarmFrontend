import { exec, query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { platformUserRow } from '../_lib/mappers'

export default methods({
  GET: withAuth(async (req, res) => {
    const rows = await query('SELECT * FROM platform_users WHERE id = ?', [req.query.id])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.status(200).json(platformUserRow(rows[0]))
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
