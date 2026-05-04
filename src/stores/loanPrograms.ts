import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoanProgram } from '@/types/loanProgram'
import { api } from '@/services/api'

export const useLoanProgramsStore = defineStore('loanPrograms', () => {
  const programs = ref<LoanProgram[]>([])
  const searchQuery = ref('')
  const bankFilter = ref('')
  const statusFilter = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredPrograms = computed(() => {
    let result = programs.value
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q))
    }
    if (bankFilter.value) {
      result = result.filter(p => p.bank.id === bankFilter.value)
    }
    if (statusFilter.value) {
      result = result.filter(p => p.status === statusFilter.value)
    }
    return result
  })

  const totalItems = computed(() => filteredPrograms.value.length)

  const bankOptions = computed(() => {
    const banks = new Map<string, string>()
    programs.value.forEach(p => banks.set(p.bank.id, p.bank.name))
    return Array.from(banks.entries()).map(([id, name]) => ({ title: name, value: id }))
  })

  async function loadPrograms() {
    loading.value = true
    error.value = null
    try {
      programs.value = await api.get<LoanProgram[]>('/api/loan-programs')
    } catch (e) {
      error.value = (e as Error).message || 'Failed to load loan programs. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function getProgramById(id: string) {
    return programs.value.find(p => p.id === id)
  }

  function setSearch(query: string) {
    searchQuery.value = query
  }

  function setBankFilter(bankId: string) {
    bankFilter.value = bankId
  }

  function setStatusFilter(status: string) {
    statusFilter.value = status
  }

  return {
    programs, searchQuery, bankFilter, statusFilter, loading, error,
    filteredPrograms, totalItems, bankOptions,
    loadPrograms, getProgramById, setSearch, setBankFilter, setStatusFilter,
  }
})
