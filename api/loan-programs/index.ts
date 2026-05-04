import { exec, query } from '../_lib/db'
import { methods, withAuth } from '../_lib/handler'
import { loanProgramRow } from '../_lib/mappers'

const SELECT_LP = `
  SELECT lp.*, c.name AS coop_name, b.title AS bank_name, b.logo AS bank_logo
  FROM loan_programs lp
  LEFT JOIN cooperatives c ON c.id = lp.cooperative_id
  LEFT JOIN banks b ON b.id = lp.bank_id
`

export default methods({
  GET: withAuth(async (_req, res) => {
    const rows = await query(`${SELECT_LP} ORDER BY lp.title`)
    res.status(200).json(rows.map(loanProgramRow))
  }),
  POST: withAuth(async (req, res) => {
    const p = req.body ?? {}
    const id = p.id ?? `lp-${Date.now()}`
    await exec(
      `INSERT INTO loan_programs (id, title, logo, cooperative_id, bank_id, status, currency,
         loan_amount_min, loan_amount_max, term_months, interest_rate, type_of_financing,
         grace_period_months, crops, country, regions, description, application_deadline,
         payment_frequency, conditions_requirements, application_process)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id, p.title, p.logo ?? '', p.cooperative?.id ?? null, p.bank?.id ?? null, p.status ?? 'Draft',
        p.currency ?? 'USD', p.loanAmountMin ?? 0, p.loanAmountMax ?? 0, p.termMonths ?? 0,
        p.interestRate ?? 0, p.typeOfFinancing ?? '', p.gracePeriodMonths ?? 0,
        JSON.stringify(p.crops ?? []), p.country ?? '', JSON.stringify(p.regions ?? []),
        p.description ?? '', p.applicationDeadline ?? '', p.paymentFrequency ?? '',
        p.conditionsRequirements ?? '', JSON.stringify(p.applicationProcess ?? []),
      ],
    )
    const rows = await query(`${SELECT_LP} WHERE lp.id = ?`, [id])
    res.status(201).json(loanProgramRow(rows[0]))
  }),
})
