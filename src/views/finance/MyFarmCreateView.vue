<template>
  <div>
    <PageHeader :title="t('farms.create')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.myFarms')} > ${t('common.create')}`">
      <v-btn variant="outlined" class="mr-2" @click="router.back()">{{ t('common.cancel') }}</v-btn>
      <v-btn color="primary" :loading="saving" @click="handleSave">{{ t('common.save') }}</v-btn>
    </PageHeader>
    <v-card class="pa-4" max-width="700">
      <v-form ref="formRef">
        <v-text-field v-model="form.name" :label="t('farms.name')" :rules="[r => !!r || 'Required']" variant="outlined" density="comfortable" class="mb-3" />
        <v-select v-model="form.country" :items="['Suriname', 'Indonesia', 'Netherlands']" :label="t('common.country')" variant="outlined" density="comfortable" class="mb-3" />
        <v-text-field v-model="form.province" label="Province / State" variant="outlined" density="comfortable" class="mb-3" />
        <v-text-field v-model="form.village" label="Village / Town / City" variant="outlined" density="comfortable" class="mb-3" />
        <v-text-field v-model="form.address" label="Street Address" variant="outlined" density="comfortable" class="mb-3" />
        <v-text-field v-model.number="form.size" label="Farm Size (hectares)" type="number" variant="outlined" density="comfortable" />
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useFarmsStore } from '@/stores/farms'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const store = useFarmsStore()
const authStore = useAuthStore()
const appStore = useAppStore()
const { t } = useTranslation()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const saving = ref(false)
const form = reactive({ name: '', country: '', province: '', village: '', address: '', size: 0 })

async function handleSave() {
  if (formRef.value) { const { valid } = await formRef.value.validate(); if (!valid) return }
  saving.value = true
  await new Promise(r => setTimeout(r, 300))
  store.addFarm({ id: `farm-${Date.now()}`, ...form, ownerId: authStore.user?.id || '' })
  saving.value = false
  appStore.showSnackbar('Farm created successfully')
  router.push('/finance/my-farms')
}
</script>
