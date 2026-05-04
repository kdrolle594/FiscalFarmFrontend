import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, OrgType } from '@/types/auth'
import { api, tokenStore } from '@/services/api'

type AuthUser = Omit<User, 'password'>

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const language = ref('en')

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed<OrgType | null>(() => (user.value?.role as OrgType | undefined) ?? null)
  const userName = computed(() => user.value?.name ?? '')
  const userEmail = computed(() => user.value?.email ?? '')
  const userOrganisation = computed(() => user.value?.organisation ?? '')
  const userAvatar = computed(() => user.value?.avatar ?? '')

  async function init() {
    const stored = localStorage.getItem('agri-auth-user')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch {
        localStorage.removeItem('agri-auth-user')
      }
    }
    const storedLang = localStorage.getItem('agri-language')
    if (storedLang) language.value = storedLang

    // If we have a token, refresh user data from server.
    if (tokenStore.get()) {
      try {
        const me = await api.get<AuthUser>('/api/auth/me')
        user.value = me
        localStorage.setItem('agri-auth-user', JSON.stringify(me))
      } catch {
        logout()
      }
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const res = await api.post<{ token: string; user: AuthUser }>('/api/auth/login', { email, password })
      tokenStore.set(res.token)
      user.value = res.user
      localStorage.setItem('agri-auth-user', JSON.stringify(res.user))
      return true
    } catch {
      return false
    }
  }

  function logout() {
    user.value = null
    tokenStore.clear()
    localStorage.removeItem('agri-auth-user')
  }

  function updateAvatar(avatar: string) {
    if (user.value) {
      user.value = { ...user.value, avatar }
      localStorage.setItem('agri-auth-user', JSON.stringify(user.value))
    }
  }

  function removeAvatar() {
    if (user.value) {
      user.value = { ...user.value, avatar: '' }
      localStorage.setItem('agri-auth-user', JSON.stringify(user.value))
    }
  }

  function setLanguage(lang: string) {
    language.value = lang
    localStorage.setItem('agri-language', lang)
  }

  return {
    user, language,
    isAuthenticated, userRole, userName, userEmail, userOrganisation, userAvatar,
    init, login, logout, updateAvatar, removeAvatar, setLanguage,
  }
})
