import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoanApplication, ApplicationStatus } from '@/types/loanApplication'
import { api } from '@/services/api'

export const useLoanApplicationsStore = defineStore('loanApplications', () => {
  const applications = ref<LoanApplication[]>([])
  const searchQuery = ref('')
  const programFilter = ref('')
  const statusFilter = ref<ApplicationStatus | ''>('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredApplications = computed(() => {
    let result = applications.value
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(a =>
        a.id.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q)
      )
    }
    if (programFilter.value) {
      result = result.filter(a => a.loanProgramId === programFilter.value)
    }
    if (statusFilter.value) {
      result = result.filter(a => a.status === statusFilter.value)
    }
    return result
  })

  const totalItems = computed(() => filteredApplications.value.length)

  const programOptions = computed(() => {
    const progs = new Map<string, string>()
    applications.value.forEach(a => progs.set(a.loanProgramId, a.loanProgramTitle))
    return Array.from(progs.entries()).map(([id, title]) => ({ title, value: id }))
  })

  async function loadApplications() {
    loading.value = true
    error.value = null
    try {
      applications.value = await api.get<LoanApplication[]>('/api/loan-applications')
    } catch (e) {
      error.value = (e as Error).message || 'Failed to load loan applications. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function getApplicationById(id: string) {
    return applications.value.find(a => a.id === id)
  }

  function setSearch(query: string) {
    searchQuery.value = query
  }

  function setProgramFilter(programId: string) {
    programFilter.value = programId
  }

  function setStatusFilter(status: ApplicationStatus | '') {
    statusFilter.value = status
  }

  async function updateApplicationStatus(id: string, status: ApplicationStatus) {
    const updated = await api.patch<LoanApplication>(`/api/loan-applications/${id}`, { status })
    const idx = applications.value.findIndex(a => a.id === id)
    if (idx !== -1) applications.value[idx] = updated
  }

  return {
    applications, searchQuery, programFilter, statusFilter, loading, error,
    filteredApplications, totalItems, programOptions,
    loadApplications, getApplicationById, setSearch, setProgramFilter, setStatusFilter,
    updateApplicationStatus,
  }
})
