import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bank } from '@/types/bank'
import { api } from '@/services/api'

export const useBanksStore = defineStore('banks', () => {
  const banks = ref<Bank[]>([])
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredBanks = computed(() =>
    banks.value.filter(b =>
      b.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      b.contactEmail.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )

  const totalItems = computed(() => filteredBanks.value.length)

  async function loadBanks() {
    loading.value = true
    error.value = null
    try {
      banks.value = await api.get<Bank[]>('/api/banks')
    } catch (e) {
      error.value = (e as Error).message || 'Failed to load banks. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function getBankById(id: string) {
    return banks.value.find(b => b.id === id)
  }

  function setSearch(query: string) {
    searchQuery.value = query
  }

  async function addBank(bank: Bank) {
    const created = await api.post<Bank>('/api/banks', bank)
    banks.value.push(created)
  }

  async function updateBank(id: string, data: Partial<Bank>) {
    const existing = banks.value.find(b => b.id === id)
    const merged = { ...existing, ...data } as Bank
    const updated = await api.put<Bank>(`/api/banks/${id}`, merged)
    const idx = banks.value.findIndex(b => b.id === id)
    if (idx !== -1) banks.value[idx] = updated
  }

  return {
    banks, searchQuery, loading, error,
    filteredBanks, totalItems,
    loadBanks, getBankById, setSearch, addBank, updateBank,
  }
})
