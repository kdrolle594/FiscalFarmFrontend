export interface LoanProgram {
  id: string
  title: string
  logo: string
  cooperative: { id: string; name: string }
  bank: { id: string; name: string; logo: string }
  status: 'Active' | 'Inactive' | 'Draft'
  currency: string
  loanAmountMin: number
  loanAmountMax: number
  termMonths: number
  interestRate: number
  typeOfFinancing: string
  gracePeriodMonths: number
  crops: string[]
  country: string
  regions: string[]
  description: string
  applicationDeadline: string
  paymentFrequency: string
  conditionsRequirements: string
  applicationProcess: string[]
}
