import { exec, query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { farmRow } from '../_lib/mappers'

export default methods({
  GET: withAuth(async (_req, res) => {
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
})
