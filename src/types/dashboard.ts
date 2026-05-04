export interface DashboardData {
  loanApplicationsChart: {
    months: string[]
    approved: number[]
    pending: number[]
    waiting: number[]
    rejected: number[]
  }
  processingTimeChart: {
    months: string[]
    days: number[]
  }
  applicationsByRegion: {
    regions: string[]
    counts: number[]
  }
  stats: {
    avgProcessingTime: { value: number; unit: string; trend: number }
    totalApplications: { value: number; trend: number }
    approvalPercentage: { value: number; unit: string; trend: number }
  }
}
