import { exec, query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { cooperativeRow } from '../_lib/mappers'

export default methods({
  GET: withAuth(async (_req, res) => {
    const rows = await query('SELECT * FROM cooperatives ORDER BY name')
    res.status(200).json(rows.map(cooperativeRow))
  }),
  POST: withAuth(async (req, res) => {
    const c = req.body ?? {}
    const id = c.id ?? `coop-${Date.now()}`
    await exec(
      `INSERT INTO cooperatives (id, name, organisation_type, created_at) VALUES (?,?,?,?)`,
      [id, c.name, c.organisationType ?? 'Cooperative', c.createdAt ?? new Date().toISOString().slice(0, 10)],
    )
    const rows = await query('SELECT * FROM cooperatives WHERE id = ?', [id])
    res.status(201).json(cooperativeRow(rows[0]))
  }),
})
