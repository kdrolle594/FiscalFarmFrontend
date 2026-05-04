<template>
  <div v-if="coop">
    <PageHeader :title="`${t('common.edit')}: ${coop.name}`" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.cooperatives')} > ${t('common.edit')}`">
      <v-btn variant="outlined" class="mr-2" @click="router.back()">{{ t('common.cancel') }}</v-btn>
      <v-btn color="primary" :loading="saving" @click="handleSave">{{ t('common.save') }}</v-btn>
    </PageHeader>
    <v-card class="pa-4" max-width="600">
      <v-form ref="formRef">
        <v-text-field v-model="name" :label="t('cooperatives.name')" :rules="[r => !!r || 'Required']" variant="outlined" density="comfortable" class="mb-3" />
        <v-text-field model-value="Cooperative" :label="t('common.organisation')" variant="outlined" density="comfortable" readonly />
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useCooperativesStore } from '@/stores/cooperatives'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'

const route = useRoute()
const router = useRouter()
const store = useCooperativesStore()
const appStore = useAppStore()
const { t } = useTranslation()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const saving = ref(false)
const name = ref('')
const coop = computed(() => store.getCooperativeById(route.params.id as string))
watch(coop, c => { if (c) name.value = c.name }, { immediate: true })
onMounted(() => { if (store.cooperatives.length === 0) store.loadCooperatives() })

async function handleSave() {
  if (formRef.value) { const { valid } = await formRef.value.validate(); if (!valid) return }
  saving.value = true
  await new Promise(r => setTimeout(r, 300))
  store.updateCooperative(route.params.id as string, { name: name.value })
  saving.value = false
  appStore.showSnackbar('Cooperative updated successfully')
  router.push('/finance/cooperatives')
}
</script>
