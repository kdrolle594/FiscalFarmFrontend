import { exec, query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { loanApplicationRow } from '../_lib/mappers'

async function fetchOne(id: string) {
  const [apps, disbursements, repayments, activity] = await Promise.all([
    query('SELECT * FROM loan_applications WHERE id = ?', [id]),
    query('SELECT * FROM disbursement_schedule WHERE application_id = ? ORDER BY number', [id]),
    query('SELECT * FROM repayment_schedule WHERE application_id = ? ORDER BY installment', [id]),
    query('SELECT * FROM activity_log WHERE application_id = ? ORDER BY id', [id]),
  ])
  if (!apps[0]) return null
  return loanApplicationRow(apps[0], disbursements, repayments, activity)
}

export default methods({
  GET: withAuth(async (req, res) => {
    const app = await fetchOne(req.query.id as string)
    if (!app) return res.status(404).json({ error: 'Not found' })
    res.status(200).json(app)
  }),
  PATCH: withAuth(async (req, res) => {
    const id = req.query.id as string
    const { status } = (req.body ?? {}) as { status?: string }
    if (!status) return res.status(400).json({ error: 'status required' })
    await exec('UPDATE loan_applications SET status = ? WHERE id = ?', [status, id])
    const app = await fetchOne(id)
    res.status(200).json(app)
  }),
})
