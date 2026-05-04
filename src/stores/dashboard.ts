import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardData } from '@/types/dashboard'
import { api } from '@/services/api'

const empty: DashboardData = {
  loanApplicationsChart: { months: [], approved: [], pending: [], waiting: [], rejected: [] },
  processingTimeChart: { months: [], days: [] },
  applicationsByRegion: { regions: [], counts: [] },
  stats: {
    avgProcessingTime: { value: 0, unit: 'days', trend: 0 },
    totalApplications: { value: 0, trend: 0 },
    approvalPercentage: { value: 0, unit: '%', trend: 0 },
  },
}

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData>(empty)
  const timeFilter = ref<'month' | 'quarter' | 'year'>('month')
  const loading = ref(false)

  async function loadDashboard() {
    loading.value = true
    try {
      data.value = await api.get<DashboardData>(`/api/dashboard?period=${timeFilter.value}`)
    } finally {
      loading.value = false
    }
  }

  function setTimeFilter(filter: 'month' | 'quarter' | 'year') {
    timeFilter.value = filter
    loadDashboard()
  }

  return {
    data, timeFilter, loading,
    loadDashboard, setTimeFilter,
  }
})
