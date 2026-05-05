import { query } from './_lib/db.js'
import { methods, withAuth } from './_lib/handler.js'

export default methods({
  GET: withAuth(async (req, res) => {
    const period = (req.query.period as string) || 'month'
    if (!['month', 'quarter', 'year'].includes(period)) {
      return res.status(400).json({ error: 'period must be month|quarter|year' })
    }
    const rows = await query<{ data: any }>(
      'SELECT data FROM dashboard_snapshots WHERE period = ? LIMIT 1',
      [period],
    )
    if (!rows[0]) return res.status(404).json({ error: 'Snapshot not found' })
    const data = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data
    res.status(200).json(data)
  }),
})
