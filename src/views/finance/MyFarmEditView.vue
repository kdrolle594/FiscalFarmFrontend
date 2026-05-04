<template>
  <div v-if="farm">
    <PageHeader :title="`${t('common.edit')}: ${farm.name}`" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.myFarms')} > ${t('common.edit')}`">
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useFarmsStore } from '@/stores/farms'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'

const route = useRoute()
const router = useRouter()
const store = useFarmsStore()
const appStore = useAppStore()
const { t } = useTranslation()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const saving = ref(false)
const farm = computed(() => store.getFarmById(route.params.id as string))
const form = reactive({ name: '', country: '', province: '', village: '', address: '', size: 0 })
watch(farm, f => { if (f) Object.assign(form, { name: f.name, country: f.country, province: f.province, village: f.village, address: f.address, size: f.size }) }, { immediate: true })
onMounted(() => { if (store.farms.length === 0) store.loadFarms() })

async function handleSave() {
  if (formRef.value) { const { valid } = await formRef.value.validate(); if (!valid) return }
  saving.value = true
  await new Promise(r => setTimeout(r, 300))
  store.updateFarm(route.params.id as string, form)
  saving.value = false
  appStore.showSnackbar('Farm updated successfully')
  router.push('/finance/my-farms')
}
</script>
