import { exec, query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { bankRow } from '../_lib/mappers'

export default methods({
  GET: withAuth(async (_req, res) => {
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
})
