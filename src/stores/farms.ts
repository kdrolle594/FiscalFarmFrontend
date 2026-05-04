import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Farm } from '@/types/farm'
import { useAuthStore } from './auth'
import { api } from '@/services/api'

export const useFarmsStore = defineStore('farms', () => {
  const farms = ref<Farm[]>([])
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const myFarms = computed(() => {
    const auth = useAuthStore()
    return farms.value.filter(f => f.ownerId === auth.user?.id)
  })

  const filteredFarms = computed(() => {
    const q = searchQuery.value.toLowerCase()
    if (!q) return myFarms.value
    return myFarms.value.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.country.toLowerCase().includes(q) ||
      f.province.toLowerCase().includes(q) ||
      f.village.toLowerCase().includes(q) ||
      f.address.toLowerCase().includes(q)
    )
  })

  async function loadFarms() {
    loading.value = true
    error.value = null
    try {
      farms.value = await api.get<Farm[]>('/api/farms')
    } catch (e) {
      error.value = (e as Error).message || 'Failed to load farms. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function getFarmById(id: string) {
    return farms.value.find(f => f.id === id)
  }

  function setSearch(query: string) {
    searchQuery.value = query
  }

  async function addFarm(farm: Farm) {
    const created = await api.post<Farm>('/api/farms', farm)
    farms.value.push(created)
  }

  async function updateFarm(id: string, data: Partial<Farm>) {
    const existing = farms.value.find(f => f.id === id)
    const merged = { ...existing, ...data } as Farm
    const updated = await api.put<Farm>(`/api/farms/${id}`, merged)
    const idx = farms.value.findIndex(f => f.id === id)
    if (idx !== -1) farms.value[idx] = updated
  }

  return {
    farms, searchQuery, loading, error,
    myFarms, filteredFarms,
    loadFarms, getFarmById, setSearch, addFarm, updateFarm,
  }
})
