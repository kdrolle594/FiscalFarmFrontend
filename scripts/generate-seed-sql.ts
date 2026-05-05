/**
 * Generates a single SQL file (scripts/seed.sql) with all INSERT statements,
 * including bcrypt-hashed passwords. Lets us seed via the Supabase MCP without
 * needing a local DATABASE_URL.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'

import { mockUsers } from '../src/data/mockAuth'
import { mockBanks } from '../src/data/mockBanks'
import { mockCooperatives } from '../src/data/mockCooperatives'
import { mockFarms } from '../src/data/mockFarms'
import { mockPlatformUsers } from '../src/data/mockUsers'
import { mockLoanPrograms } from '../src/data/mockLoanPrograms'
import { mockLoanApplications } from '../src/data/mockLoanApplications'
import { mockApplicationFormFields } from '../src/data/mockApplicationForm'
import {
  mockDashboardMonth,
  mockDashboardQuarter,
  mockDashboardYear,
} from '../src/data/mockDashboard'
import type { ApplicationFormField } from '../src/types/loanApplication'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function q(v: any): string {
  if (v == null) return 'NULL'
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE'
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL'
  return `'${String(v).replace(/'/g, "''")}'`
}

function jsonb(v: any): string {
  if (v == null) return 'NULL'
  return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`
}

async function main() {
  const out: string[] = []
  out.push('-- AUTO-GENERATED. Apply scripts/schema.sql first.')

  out.push('\n-- banks')
  for (const b of mockBanks) {
    out.push(
      `INSERT INTO banks (id, title, logo, swift_code, contact_first_name, contact_last_name, contact_email, contact_phone, endpoint_url, api_key, admin_username, admin_password, require_2fa) VALUES (${[
        q(b.id), q(b.title), q(b.logo), q(b.swiftCode), q(b.contactFirstName), q(b.contactLastName),
        q(b.contactEmail), q(b.contactPhone), q(b.endpointUrl), q(b.apiKey),
        q(b.adminUsername), q(b.adminPassword), q(b.require2FA),
      ].join(', ')});`,
    )
  }

  out.push('\n-- cooperatives')
  for (const c of mockCooperatives) {
    out.push(
      `INSERT INTO cooperatives (id, name, organisation_type, created_at) VALUES (${[
        q(c.id), q(c.name), q(c.organisationType), q(c.createdAt),
      ].join(', ')});`,
    )
  }

  out.push('\n-- auth_users (bcrypt)')
  for (const u of mockUsers) {
    const hash = await bcrypt.hash(u.password, 10)
    out.push(
      `INSERT INTO auth_users (id, name, email, password_hash, role, organisation, avatar) VALUES (${[
        q(u.id), q(u.name), q(u.email), q(hash), q(u.role), q(u.organisation), q(u.avatar),
      ].join(', ')});`,
    )
  }

  out.push('\n-- farms')
  for (const f of mockFarms) {
    out.push(
      `INSERT INTO farms (id, name, country, province, village, address, size, owner_id) VALUES (${[
        q(f.id), q(f.name), q(f.country), q(f.province), q(f.village), q(f.address), q(f.size), q(f.ownerId),
      ].join(', ')});`,
    )
  }

  out.push('\n-- platform_users')
  for (const p of mockPlatformUsers) {
    out.push(
      `INSERT INTO platform_users (id, name, email, organisation, organisation_id, active, created_at) VALUES (${[
        q(p.id), q(p.name), q(p.email), q(p.organisation), q(p.organisationId), q(p.active), q(p.createdAt),
      ].join(', ')});`,
    )
  }

  out.push('\n-- loan_programs')
  for (const lp of mockLoanPrograms) {
    out.push(
      `INSERT INTO loan_programs (id, title, logo, cooperative_id, bank_id, status, currency, loan_amount_min, loan_amount_max, term_months, interest_rate, type_of_financing, grace_period_months, crops, country, regions, description, application_deadline, payment_frequency, conditions_requirements, application_process) VALUES (${[
        q(lp.id), q(lp.title), q(lp.logo), q(lp.cooperative.id), q(lp.bank.id), q(lp.status), q(lp.currency),
        q(lp.loanAmountMin), q(lp.loanAmountMax), q(lp.termMonths), q(lp.interestRate), q(lp.typeOfFinancing),
        q(lp.gracePeriodMonths), jsonb(lp.crops), q(lp.country), jsonb(lp.regions),
        q(lp.description), q(lp.applicationDeadline), q(lp.paymentFrequency), q(lp.conditionsRequirements),
        jsonb(lp.applicationProcess),
      ].join(', ')});`,
    )
  }

  out.push('\n-- loan_applications + children')
  for (const a of mockLoanApplications) {
    out.push(
      `INSERT INTO loan_applications (id, submission_date, applicant_name, applicant_email, applicant_phone, applicant_national_id, loan_program_id, loan_program_title, loan_program_logo, bank_name, bank_logo, amount, currency, status, farm, farm_reports, additional_questions, documents, loan_details) VALUES (${[
        q(a.id), q(a.submissionDate), q(a.applicantName), q(a.applicantEmail), q(a.applicantPhone),
        q(a.applicantNationalId), q(a.loanProgramId), q(a.loanProgramTitle), q(a.loanProgramLogo),
        q(a.bankName), q(a.bankLogo), q(a.amount), q(a.currency), q(a.status),
        jsonb(a.farm), jsonb(a.farmReports), jsonb(a.additionalQuestions), jsonb(a.documents),
        a.loanDetails ? jsonb(a.loanDetails) : 'NULL',
      ].join(', ')});`,
    )
    for (const d of a.disbursementSchedule) {
      out.push(
        `INSERT INTO disbursement_schedule (application_id, number, amount, date, transaction_id, status) VALUES (${[
          q(a.id), q(d.number), q(d.amount), q(d.date), q(d.transactionId), q(d.status),
        ].join(', ')});`,
      )
    }
    for (const r of a.repaymentSchedule) {
      out.push(
        `INSERT INTO repayment_schedule (application_id, installment, due_date, principal, interest, total, transaction_id, status) VALUES (${[
          q(a.id), q(r.installment), q(r.dueDate), q(r.principal), q(r.interest), q(r.total), q(r.transactionId), q(r.status),
        ].join(', ')});`,
      )
    }
    for (const l of a.activityLog) {
      out.push(
        `INSERT INTO activity_log (application_id, "user", action, date_time, ip_address) VALUES (${[
          q(a.id), q(l.user), q(l.action), q(l.dateTime), q(l.ipAddress),
        ].join(', ')});`,
      )
    }
  }

  out.push('\n-- application_form_fields')
  let order = 0
  function emitField(field: ApplicationFormField, parentId: string | null) {
    out.push(
      `INSERT INTO application_form_fields (id, parent_id, label, type, mandatory, subdata, sort_order) VALUES (${[
        q(field.id), q(parentId), q(field.label), q(field.type), q(field.mandatory),
        field.subdata ? jsonb(field.subdata) : 'NULL', q(order++),
      ].join(', ')});`,
    )
    for (const child of field.children ?? []) emitField(child, field.id)
  }
  for (const f of mockApplicationFormFields) emitField(f, null)

  out.push('\n-- dashboard_snapshots')
  for (const [period, data] of [
    ['month', mockDashboardMonth],
    ['quarter', mockDashboardQuarter],
    ['year', mockDashboardYear],
  ] as const) {
    out.push(`INSERT INTO dashboard_snapshots (period, data) VALUES (${q(period)}, ${jsonb(data)});`)
  }

  const outPath = path.resolve(__dirname, 'seed.sql')
  fs.writeFileSync(outPath, out.join('\n') + '\n', 'utf-8')
  console.log(`Wrote ${outPath} (${out.length} statements).`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
