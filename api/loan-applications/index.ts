import { query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { loanApplicationRow } from '../_lib/mappers'

export default methods({
  GET: withAuth(async (req, res) => {
    const programId = (req.query.programId as string | undefined) || null
    const status = (req.query.status as string | undefined) || null
    const where: string[] = []
    const params: any[] = []
    if (programId) { where.push('loan_program_id = ?'); params.push(programId) }
    if (status) { where.push('status = ?'); params.push(status) }
    const sql = `SELECT * FROM loan_applications ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY submission_date DESC`
    const apps = await query(sql, params)
    if (apps.length === 0) {
      res.status(200).json([])
      return
    }
    const ids = apps.map((a: any) => a.id)
    const placeholders = ids.map(() => '?').join(',')
    const [disbursements, repayments, activity] = await Promise.all([
      query(`SELECT * FROM disbursement_schedule WHERE application_id IN (${placeholders}) ORDER BY number`, ids),
      query(`SELECT * FROM repayment_schedule WHERE application_id IN (${placeholders}) ORDER BY installment`, ids),
      query(`SELECT * FROM activity_log WHERE application_id IN (${placeholders}) ORDER BY id`, ids),
    ])
    const groupBy = <T extends { application_id: string }>(arr: T[]) => {
      const m = new Map<string, T[]>()
      for (const r of arr) {
        const k = r.application_id
        if (!m.has(k)) m.set(k, [])
        m.get(k)!.push(r)
      }
      return m
    }
    const dByApp = groupBy(disbursements as any[])
    const rByApp = groupBy(repayments as any[])
    const aByApp = groupBy(activity as any[])
    res.status(200).json(apps.map((a: any) =>
      loanApplicationRow(a, dByApp.get(a.id) ?? [], rByApp.get(a.id) ?? [], aByApp.get(a.id) ?? []),
    ))
  }),
})
