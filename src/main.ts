import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueApexCharts from 'vue3-apexcharts'
import { useAuthStore } from './stores/auth'
import { useTranslation } from './composables/useTranslation'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const authStore = useAuthStore()
authStore.init()

// Make translation function available globally - create fresh instance each time
app.config.globalProperties.$t = (path: string, defaultValue?: string) => {
  const { t } = useTranslation()
  return t(path, defaultValue)
}

app.use(router)
app.use(vuetify)
app.use(VueApexCharts)
app.mount('#app')
