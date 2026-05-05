import { exec, query } from './_lib/db.js'
import { methods, withAuth } from './_lib/handler.js'
import { bankRow } from './_lib/mappers.js'

export default methods({
  GET: withAuth(async (req, res) => {
    const id = req.query.id as string | undefined
    if (id) {
      const rows = await query('SELECT * FROM banks WHERE id = ?', [id])
      if (!rows[0]) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(bankRow(rows[0]))
    }
    const rows = await query('SELECT * FROM banks ORDER BY title')
    res.status(200).json(rows.map(bankRow))
  }),
  POST: withAuth(async (req, res) => {
    const b = req.body ?? {}
    const id = b.id ?? `bank-${Date.now()}`
    await exec(
      `INSERT INTO banks (id, title, logo, swift_code, contact_first_name, contact_last_name,
         contact_email, contact_phone, endpoint_url, api_key, admin_username, admin_password, require_2fa)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, b.title, b.logo ?? '', b.swiftCode ?? '', b.contactFirstName ?? '', b.contactLastName ?? '',
       b.contactEmail ?? '', b.contactPhone ?? '', b.endpointUrl ?? '', b.apiKey ?? '',
       b.adminUsername ?? '', b.adminPassword ?? '', !!b.require2FA],
    )
    const rows = await query('SELECT * FROM banks WHERE id = ?', [id])
    res.status(201).json(bankRow(rows[0]))
  }),
  PUT: withAuth(async (req, res) => {
    const id = req.query.id as string
    const b = req.body ?? {}
    await exec(
      `UPDATE banks SET title=?, logo=?, swift_code=?, contact_first_name=?, contact_last_name=?,
         contact_email=?, contact_phone=?, endpoint_url=?, api_key=?, admin_username=?,
         admin_password=?, require_2fa=? WHERE id=?`,
      [b.title, b.logo ?? '', b.swiftCode ?? '', b.contactFirstName ?? '', b.contactLastName ?? '',
       b.contactEmail ?? '', b.contactPhone ?? '', b.endpointUrl ?? '', b.apiKey ?? '',
       b.adminUsername ?? '', b.adminPassword ?? '', !!b.require2FA, id],
    )
    const rows = await query('SELECT * FROM banks WHERE id = ?', [id])
    res.status(200).json(bankRow(rows[0]))
  }),
  DELETE: withAuth(async (req, res) => {
    await exec('DELETE FROM banks WHERE id = ?', [req.query.id])
    res.status(204).end()
  }),
})
