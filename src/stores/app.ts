import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarOpen = ref(true)
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
    timeout: 3000,
  })

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setSidebar(open: boolean) {
    sidebarOpen.value = open
  }

  function showSnackbar(message: string, color: string = 'success') {
    snackbar.value = { show: true, message, color, timeout: 3000 }
  }

  function hideSnackbar() {
    snackbar.value.show = false
  }

  return {
    sidebarOpen, snackbar,
    toggleSidebar, setSidebar, showSnackbar, hideSnackbar,
  }
})
