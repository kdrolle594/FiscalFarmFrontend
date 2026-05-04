<template>
  <div>
    <PageHeader :title="t('cooperatives.create')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.cooperatives')} > ${t('common.create')}`">
      <v-btn variant="outlined" class="mr-2" @click="router.back()">{{ t('common.cancel') }}</v-btn>
      <v-btn color="primary" :loading="saving" @click="handleSave">{{ t('common.save') }}</v-btn>
    </PageHeader>
    <v-card class="pa-4" max-width="600">
      <v-form ref="formRef">
        <v-text-field v-model="form.name" :label="t('cooperatives.name')" :rules="[r => !!r || 'Required']" variant="outlined" density="comfortable" class="mb-3" />
        <v-text-field model-value="Cooperative" :label="t('common.organisation')" variant="outlined" density="comfortable" readonly />
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useCooperativesStore } from '@/stores/cooperatives'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const store = useCooperativesStore()
const appStore = useAppStore()
const { t } = useTranslation()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const saving = ref(false)
const form = reactive({ name: '' })

async function handleSave() {
  if (formRef.value) { const { valid } = await formRef.value.validate(); if (!valid) return }
  saving.value = true
  await new Promise(r => setTimeout(r, 300))
  store.addCooperative({ id: `coop-${Date.now()}`, name: form.name, organisationType: 'Cooperative', createdAt: new Date().toISOString().split('T')[0] })
  saving.value = false
  appStore.showSnackbar('Cooperative created successfully')
  router.push('/finance/cooperatives')
}
</script>
