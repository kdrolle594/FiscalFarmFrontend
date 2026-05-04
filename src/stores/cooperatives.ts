import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Cooperative } from '@/types/cooperative'
import { api } from '@/services/api'

export const useCooperativesStore = defineStore('cooperatives', () => {
  const cooperatives = ref<Cooperative[]>([])
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredCooperatives = computed(() => {
    const q = searchQuery.value.toLowerCase()
    if (!q) return cooperatives.value
    return cooperatives.value.filter(c =>
      c.name.toLowerCase().includes(q)
    )
  })

  async function loadCooperatives() {
    loading.value = true
    error.value = null
    try {
      cooperatives.value = await api.get<Cooperative[]>('/api/cooperatives')
    } catch (e) {
      error.value = (e as Error).message || 'Failed to load cooperatives. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function getCooperativeById(id: string) {
    return cooperatives.value.find(c => c.id === id)
  }

  function setSearch(query: string) {
    searchQuery.value = query
  }

  async function addCooperative(coop: Cooperative) {
    const created = await api.post<Cooperative>('/api/cooperatives', coop)
    cooperatives.value.push(created)
  }

  async function updateCooperative(id: string, data: Partial<Cooperative>) {
    const existing = cooperatives.value.find(c => c.id === id)
    const merged = { ...existing, ...data } as Cooperative
    const updated = await api.put<Cooperative>(`/api/cooperatives/${id}`, merged)
    const idx = cooperatives.value.findIndex(c => c.id === id)
    if (idx !== -1) cooperatives.value[idx] = updated
  }

  return {
    cooperatives, searchQuery, loading, error,
    filteredCooperatives,
    loadCooperatives, getCooperativeById, setSearch, addCooperative, updateCooperative,
  }
})
