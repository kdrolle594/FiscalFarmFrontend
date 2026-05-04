import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlatformUser } from '@/types/platformUser'
import { api } from '@/services/api'

export const useUsersStore = defineStore('users', () => {
  const users = ref<PlatformUser[]>([])
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredUsers = computed(() => {
    const q = searchQuery.value.toLowerCase()
    if (!q) return users.value
    return users.value.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.organisation.toLowerCase().includes(q)
    )
  })

  async function loadUsers() {
    loading.value = true
    error.value = null
    try {
      users.value = await api.get<PlatformUser[]>('/api/users')
    } catch (e) {
      error.value = (e as Error).message || 'Failed to load users. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function getUserById(id: string) {
    return users.value.find(u => u.id === id)
  }

  function setSearch(query: string) {
    searchQuery.value = query
  }

  async function addUser(user: PlatformUser) {
    const created = await api.post<PlatformUser>('/api/users', user)
    users.value.push(created)
  }

  async function updateUser(id: string, data: Partial<PlatformUser>) {
    const existing = users.value.find(u => u.id === id)
    const merged = { ...existing, ...data } as PlatformUser
    const updated = await api.put<PlatformUser>(`/api/users/${id}`, merged)
    const idx = users.value.findIndex(u => u.id === id)
    if (idx !== -1) users.value[idx] = updated
  }

  return {
    users, searchQuery, loading, error,
    filteredUsers,
    loadUsers, getUserById, setSearch, addUser, updateUser,
  }
})
