export type ApplicationStatus = 'Pending' | 'Waiting Signatures' | 'Sent to Bank' | 'Approved' | 'Rejected'

export interface LoanApplication {
  id: string
  submissionDate: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  applicantNationalId: string
  loanProgramId: string
  loanProgramTitle: string
  loanProgramLogo: string
  bankName: string
  bankLogo: string
  amount: number
  currency: string
  status: ApplicationStatus
  farm: {
    name: string
    country: string
    province: string
    village: string
    size: number
  }
  farmReports: {
    yieldPrediction: { predictedYield: string; confidence: number }
    loanSuitability: { rating: string; notes: string }
    soilAnalysis: { ph: number; organicMatter: number; classification: string }
  }
  additionalQuestions: {
    loanPurpose: string
    comments: string
    landOwnershipProof: string
  }
  documents: { name: string; type: 'pdf' | 'img' | 'doc' }[]
  loanDetails?: {
    totalAmount: number
    interestRate: number
    installments: number
    gracePeriod: number
    firstDisbursement: string
  }
  disbursementSchedule: {
    number: number
    amount: number
    date: string
    transactionId: string
    status: string
  }[]
  repaymentSchedule: {
    installment: number
    dueDate: string
    principal: number
    interest: number
    total: number
    transactionId: string
    status: string
  }[]
  activityLog: {
    user: string
    action: string
    dateTime: string
    ipAddress: string
  }[]
}

export type DataFieldType = 'Text Field' | 'Text Field Numeric' | 'Dropdown' | 'Attach File' | 'Group'

export interface ApplicationFormField {
  id: string
  label: string
  type: DataFieldType
  mandatory: boolean
  subdata?: { label: string; value: string }[]
  children?: ApplicationFormField[]
}
