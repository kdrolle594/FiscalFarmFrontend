<template>
  <div>
    <PageHeader :title="t('common.settings')" :breadcrumb="t('common.settings')" />
    <v-card max-width="600" class="mx-auto pa-6">
      <v-select
        v-model="selectedLanguage"
        :items="languages"
        item-title="label"
        item-value="value"
        :label="t('common.language')"
        variant="outlined"
        density="comfortable"
        @update:model-value="authStore.setLanguage"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { useTranslation } from '@/composables/useTranslation'

const authStore = useAuthStore()
const { t } = useTranslation()

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'French', value: 'fr' },
]

const selectedLanguage = ref(authStore.language)
</script>
