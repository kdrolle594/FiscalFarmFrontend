import { exec, query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { cooperativeRow } from '../_lib/mappers'

export default methods({
  GET: withAuth(async (req, res) => {
    const rows = await query('SELECT * FROM cooperatives WHERE id = ?', [req.query.id])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.status(200).json(cooperativeRow(rows[0]))
  }),
  PUT: withAuth(async (req, res) => {
    const id = req.query.id as string
    const c = req.body ?? {}
    await exec(
      `UPDATE cooperatives SET name=?, organisation_type=? WHERE id=?`,
      [c.name, c.organisationType ?? 'Cooperative', id],
    )
    const rows = await query('SELECT * FROM cooperatives WHERE id = ?', [id])
    res.status(200).json(cooperativeRow(rows[0]))
  }),
  DELETE: withAuth(async (req, res) => {
    await exec('DELETE FROM cooperatives WHERE id = ?', [req.query.id])
    res.status(204).end()
  }),
})
