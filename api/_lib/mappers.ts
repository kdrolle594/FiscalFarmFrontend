// Convert DB rows (snake_case, JSON columns parsed by mysql2 automatically when type is JSON)
// to the frontend's camelCase interfaces.

export function bankRow(r: any) {
  return {
    id: r.id,
    title: r.title,
    logo: r.logo ?? '',
    swiftCode: r.swift_code ?? '',
    contactFirstName: r.contact_first_name ?? '',
    contactLastName: r.contact_last_name ?? '',
    contactEmail: r.contact_email ?? '',
    contactPhone: r.contact_phone ?? '',
    endpointUrl: r.endpoint_url ?? '',
    apiKey: r.api_key ?? '',
    adminUsername: r.admin_username ?? '',
    adminPassword: r.admin_password ?? '',
    require2FA: !!r.require_2fa,
  }
}

export function cooperativeRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    organisationType: r.organisation_type,
    createdAt: r.created_at ?? '',
  }
}

export function farmRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    country: r.country ?? '',
    province: r.province ?? '',
    village: r.village ?? '',
    address: r.address ?? '',
    size: Number(r.size ?? 0),
    ownerId: r.owner_id ?? '',
  }
}

export function platformUserRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    organisation: r.organisation ?? '',
    organisationId: r.organisation_id ?? '',
    active: !!r.active,
    createdAt: r.created_at ?? '',
  }
}

export function loanProgramRow(r: any) {
  return {
    id: r.id,
    title: r.title,
    logo: r.logo ?? '',
    cooperative: { id: r.cooperative_id ?? '', name: r.coop_name ?? '' },
    bank: { id: r.bank_id ?? '', name: r.bank_name ?? '', logo: r.bank_logo ?? '' },
    status: r.status,
    currency: r.currency ?? '',
    loanAmountMin: Number(r.loan_amount_min ?? 0),
    loanAmountMax: Number(r.loan_amount_max ?? 0),
    termMonths: Number(r.term_months ?? 0),
    interestRate: Number(r.interest_rate ?? 0),
    typeOfFinancing: r.type_of_financing ?? '',
    gracePeriodMonths: Number(r.grace_period_months ?? 0),
    crops: parseJson(r.crops, []),
    country: r.country ?? '',
    regions: parseJson(r.regions, []),
    description: r.description ?? '',
    applicationDeadline: r.application_deadline ?? '',
    paymentFrequency: r.payment_frequency ?? '',
    conditionsRequirements: r.conditions_requirements ?? '',
    applicationProcess: parseJson(r.application_process, []),
  }
}

export function loanApplicationRow(
  r: any,
  disbursement: any[] = [],
  repayment: any[] = [],
  activity: any[] = [],
) {
  return {
    id: r.id,
    submissionDate: r.submission_date ?? '',
    applicantName: r.applicant_name ?? '',
    applicantEmail: r.applicant_email ?? '',
    applicantPhone: r.applicant_phone ?? '',
    applicantNationalId: r.applicant_national_id ?? '',
    loanProgramId: r.loan_program_id ?? '',
    loanProgramTitle: r.loan_program_title ?? '',
    loanProgramLogo: r.loan_program_logo ?? '',
    bankName: r.bank_name ?? '',
    bankLogo: r.bank_logo ?? '',
    amount: Number(r.amount ?? 0),
    currency: r.currency ?? '',
    status: r.status,
    farm: parseJson(r.farm, {}),
    farmReports: parseJson(r.farm_reports, {}),
    additionalQuestions: parseJson(r.additional_questions, {}),
    documents: parseJson(r.documents, []),
    loanDetails: parseJson(r.loan_details, undefined),
    disbursementSchedule: disbursement.map(d => ({
      number: d.number,
      amount: Number(d.amount),
      date: d.date,
      transactionId: d.transaction_id,
      status: d.status,
    })),
    repaymentSchedule: repayment.map(d => ({
      installment: d.installment,
      dueDate: d.due_date,
      principal: Number(d.principal),
      interest: Number(d.interest),
      total: Number(d.total),
      transactionId: d.transaction_id,
      status: d.status,
    })),
    activityLog: activity.map(d => ({
      user: d.user,
      action: d.action,
      dateTime: d.date_time,
      ipAddress: d.ip_address,
    })),
  }
}

function parseJson<T>(v: any, fallback: T): T {
  if (v == null) return fallback
  if (typeof v === 'object') return v as T
  try {
    return JSON.parse(v) as T
  } catch {
    return fallback
  }
}
