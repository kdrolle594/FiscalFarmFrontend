import { exec, query } from './_lib/db.js'
import { methods, withAuth } from './_lib/handler.js'
import { farmRow } from './_lib/mappers.js'

export default methods({
  GET: withAuth(async (req, res) => {
    const id = req.query.id as string | undefined
    if (id) {
      const rows = await query('SELECT * FROM farms WHERE id = ?', [id])
      if (!rows[0]) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(farmRow(rows[0]))
    }
    const rows = await query('SELECT * FROM farms ORDER BY name')
    res.status(200).json(rows.map(farmRow))
  }),
  POST: withAuth(async (req, res) => {
    const f = req.body ?? {}
    const id = f.id ?? `farm-${Date.now()}`
    await exec(
      `INSERT INTO farms (id, name, country, province, village, address, size, owner_id)
       VALUES (?,?,?,?,?,?,?,?)`,
      [id, f.name, f.country ?? '', f.province ?? '', f.village ?? '', f.address ?? '',
       f.size ?? 0, f.ownerId ?? null],
    )
    const rows = await query('SELECT * FROM farms WHERE id = ?', [id])
    res.status(201).json(farmRow(rows[0]))
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
