/**
 * Seeds the Aiven MySQL database from the existing src/data/mock*.ts files.
 * Run: npm run seed
 *
 * Reads AIVEN_MYSQL_URI (and optional AIVEN_CA_CERT or ./ca.pem) from .env.local.
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
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

function getSslConfig() {
  if (process.env.AIVEN_CA_CERT) {
    return { ca: process.env.AIVEN_CA_CERT }
  }
  const caPath = path.resolve(__dirname, '..', 'ca.pem')
  if (fs.existsSync(caPath)) {
    return { ca: fs.readFileSync(caPath, 'utf-8') }
  }
  return { rejectUnauthorized: true }
}

async function main() {
  const uri = process.env.AIVEN_MYSQL_URI
  if (!uri) throw new Error('AIVEN_MYSQL_URI not set')

  const conn = await mysql.createConnection({
    uri,
    ssl: getSslConfig(),
    multipleStatements: true,
  })

  console.log('Applying schema...')
  const schema = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf-8')
  await conn.query(schema)

  console.log('Seeding banks...')
  for (const b of mockBanks) {
    await conn.execute(
      `INSERT INTO banks (id, title, logo, swift_code, contact_first_name, contact_last_name,
         contact_email, contact_phone, endpoint_url, api_key, admin_username, admin_password, require_2fa)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [b.id, b.title, b.logo, b.swiftCode, b.contactFirstName, b.contactLastName,
       b.contactEmail, b.contactPhone, b.endpointUrl, b.apiKey, b.adminUsername, b.adminPassword, b.require2FA],
    )
  }

  console.log('Seeding cooperatives...')
  for (const c of mockCooperatives) {
    await conn.execute(
      `INSERT INTO cooperatives (id, name, organisation_type, created_at) VALUES (?,?,?,?)`,
      [c.id, c.name, c.organisationType, c.createdAt],
    )
  }

  console.log('Seeding auth_users (bcrypt-hashing passwords)...')
  for (const u of mockUsers) {
    const hash = await bcrypt.hash(u.password, 10)
    await conn.execute(
      `INSERT INTO auth_users (id, name, email, password_hash, role, organisation, avatar)
       VALUES (?,?,?,?,?,?,?)`,
      [u.id, u.name, u.email, hash, u.role, u.organisation, u.avatar],
    )
  }

  console.log('Seeding farms...')
  for (const f of mockFarms) {
    await conn.execute(
      `INSERT INTO farms (id, name, country, province, village, address, size, owner_id)
       VALUES (?,?,?,?,?,?,?,?)`,
      [f.id, f.name, f.country, f.province, f.village, f.address, f.size, f.ownerId],
    )
  }

  console.log('Seeding platform_users...')
  for (const p of mockPlatformUsers) {
    await conn.execute(
      `INSERT INTO platform_users (id, name, email, organisation, organisation_id, active, created_at)
       VALUES (?,?,?,?,?,?,?)`,
      [p.id, p.name, p.email, p.organisation, p.organisationId, p.active, p.createdAt],
    )
  }

  console.log('Seeding loan_programs...')
  for (const lp of mockLoanPrograms) {
    await conn.execute(
      `INSERT INTO loan_programs (id, title, logo, cooperative_id, bank_id, status, currency,
         loan_amount_min, loan_amount_max, term_months, interest_rate, type_of_financing,
         grace_period_months, crops, country, regions, description, application_deadline,
         payment_frequency, conditions_requirements, application_process)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        lp.id, lp.title, lp.logo, lp.cooperative.id, lp.bank.id, lp.status, lp.currency,
        lp.loanAmountMin, lp.loanAmountMax, lp.termMonths, lp.interestRate, lp.typeOfFinancing,
        lp.gracePeriodMonths, JSON.stringify(lp.crops), lp.country, JSON.stringify(lp.regions),
        lp.description, lp.applicationDeadline, lp.paymentFrequency, lp.conditionsRequirements,
        JSON.stringify(lp.applicationProcess),
      ],
    )
  }

  console.log('Seeding loan_applications...')
  for (const a of mockLoanApplications) {
    await conn.execute(
      `INSERT INTO loan_applications (id, submission_date, applicant_name, applicant_email,
         applicant_phone, applicant_national_id, loan_program_id, loan_program_title,
         loan_program_logo, bank_name, bank_logo, amount, currency, status,
         farm, farm_reports, additional_questions, documents, loan_details)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        a.id, a.submissionDate, a.applicantName, a.applicantEmail, a.applicantPhone,
        a.applicantNationalId, a.loanProgramId, a.loanProgramTitle, a.loanProgramLogo,
        a.bankName, a.bankLogo, a.amount, a.currency, a.status,
        JSON.stringify(a.farm), JSON.stringify(a.farmReports),
        JSON.stringify(a.additionalQuestions), JSON.stringify(a.documents),
        a.loanDetails ? JSON.stringify(a.loanDetails) : null,
      ],
    )
    for (const d of a.disbursementSchedule) {
      await conn.execute(
        `INSERT INTO disbursement_schedule (application_id, number, amount, date, transaction_id, status)
         VALUES (?,?,?,?,?,?)`,
        [a.id, d.number, d.amount, d.date, d.transactionId, d.status],
      )
    }
    for (const r of a.repaymentSchedule) {
      await conn.execute(
        `INSERT INTO repayment_schedule (application_id, installment, due_date, principal, interest, total, transaction_id, status)
         VALUES (?,?,?,?,?,?,?,?)`,
        [a.id, r.installment, r.dueDate, r.principal, r.interest, r.total, r.transactionId, r.status],
      )
    }
    for (const l of a.activityLog) {
      await conn.execute(
        `INSERT INTO activity_log (application_id, user, action, date_time, ip_address)
         VALUES (?,?,?,?,?)`,
        [a.id, l.user, l.action, l.dateTime, l.ipAddress],
      )
    }
  }

  console.log('Seeding application_form_fields...')
  let order = 0
  async function insertField(field: ApplicationFormField, parentId: string | null) {
    await conn.execute(
      `INSERT INTO application_form_fields (id, parent_id, label, type, mandatory, subdata, sort_order)
       VALUES (?,?,?,?,?,?,?)`,
      [field.id, parentId, field.label, field.type, field.mandatory,
       field.subdata ? JSON.stringify(field.subdata) : null, order++],
    )
    for (const child of field.children ?? []) {
      await insertField(child, field.id)
    }
  }
  for (const f of mockApplicationFormFields) await insertField(f, null)

  console.log('Seeding dashboard_snapshots...')
  for (const [period, data] of [
    ['month', mockDashboardMonth],
    ['quarter', mockDashboardQuarter],
    ['year', mockDashboardYear],
  ] as const) {
    await conn.execute(
      `INSERT INTO dashboard_snapshots (period, data) VALUES (?, ?)`,
      [period, JSON.stringify(data)],
    )
  }

  console.log('Seed complete.')
  await conn.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
