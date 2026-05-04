import type { DashboardData } from '@/types/dashboard'

export const mockDashboardMonth: DashboardData = {
  loanApplicationsChart: {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    approved: [5, 8, 6, 4, 7, 18, 43, 12, 8, 6, 5, 7],
    pending: [3, 5, 4, 3, 5, 12, 28, 10, 6, 4, 3, 4],
    waiting: [2, 3, 2, 2, 3, 8, 18, 6, 4, 2, 2, 3],
    rejected: [1, 2, 1, 1, 2, 5, 6, 3, 2, 1, 1, 2],
  },
  processingTimeChart: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: [35, 30, 28, 32, 25, 22, 20, 23, 26, 24, 21, 19],
  },
  applicationsByRegion: {
    regions: ['Montesino', 'Kerala', 'Kuari'],
    counts: [85, 65, 42],
  },
  stats: {
    avgProcessingTime: { value: 23, unit: 'days', trend: 15 },
    totalApplications: { value: 132, trend: 10 },
    approvalPercentage: { value: 40, unit: '%', trend: -10 },
  },
}

export const mockDashboardQuarter: DashboardData = {
  loanApplicationsChart: {
    months: ['Q1', 'Q2', 'Q3', 'Q4'],
    approved: [19, 21, 38, 18],
    pending: [12, 16, 31, 11],
    waiting: [7, 10, 18, 7],
    rejected: [4, 6, 10, 4],
  },
  processingTimeChart: {
    months: ['Q1', 'Q2', 'Q3', 'Q4'],
    days: [28, 20, 29, 20],
  },
  applicationsByRegion: {
    regions: ['Montesino', 'Kerala', 'Kuari'],
    counts: [210, 180, 140],
  },
  stats: {
    avgProcessingTime: { value: 24, unit: 'days', trend: 8 },
    totalApplications: { value: 396, trend: 15 },
    approvalPercentage: { value: 45, unit: '%', trend: 5 },
  },
}

export const mockDashboardYear: DashboardData = {
  loanApplicationsChart: {
    months: ['2022', '2023', '2024', '2025'],
    approved: [65, 82, 96, 106],
    pending: [40, 55, 70, 65],
    waiting: [25, 32, 42, 38],
    rejected: [15, 20, 24, 22],
  },
  processingTimeChart: {
    months: ['2022', '2023', '2024', '2025'],
    days: [35, 30, 26, 23],
  },
  applicationsByRegion: {
    regions: ['Montesino', 'Kerala', 'Kuari'],
    counts: [520, 440, 380],
  },
  stats: {
    avgProcessingTime: { value: 28, unit: 'days', trend: -12 },
    totalApplications: { value: 1340, trend: 22 },
    approvalPercentage: { value: 42, unit: '%', trend: 3 },
  },
}
