import { exec, query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { bankRow } from '../_lib/mappers'

export default methods({
  GET: withAuth(async (req, res) => {
    const rows = await query('SELECT * FROM banks WHERE id = ?', [req.query.id])
    if (!rows[0]) return res.status(404).json({ error: 'Not found' })
    res.status(200).json(bankRow(rows[0]))
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
