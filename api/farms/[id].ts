import { exec, query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { farmRow } from '../_lib/mappers'

export default methods({
  GET: withAuth(async (req, res) => {
    const rows = await query('SELECT * FROM farms WHERE id = ?', [req.query.id])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.status(200).json(farmRow(rows[0]))
  }),
  PUT: withAuth(async (req, res) => {
    const id = req.query.id as string
    const f = req.body ?? {}
    await exec(
      `UPDATE farms SET name=?, country=?, province=?, village=?, address=?, size=?, owner_id=? WHERE id=?`,
      [f.name, f.country ?? '', f.province ?? '', f.village ?? '', f.address ?? '', f.size ?? 0, f.ownerId ?? null, id],
    )
    const rows = await query('SELECT * FROM farms WHERE id = ?', [id])
    res.status(200).json(farmRow(rows[0]))
  }),
  DELETE: withAuth(async (req, res) => {
    await exec('DELETE FROM farms WHERE id = ?', [req.query.id])
    res.status(204).end()
  }),
})
