<template>
  <div v-if="user">
    <PageHeader :title="`${t('common.edit')}: ${user.name}`" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.users')} > ${t('common.edit')}`">
      <v-btn variant="outlined" class="mr-2" @click="router.back()">{{ t('common.cancel') }}</v-btn>
      <v-btn color="primary" :loading="saving" @click="handleSave">{{ t('common.save') }}</v-btn>
    </PageHeader>
    <v-card class="pa-4" max-width="600">
      <v-form ref="formRef">
        <v-text-field v-model="form.name" :label="t('common.name')" :rules="[r => !!r || 'Required']" variant="outlined" density="comfortable" class="mb-3" />
        <v-text-field v-model="form.email" :label="t('common.email')" :rules="[r => !!r || 'Required']" variant="outlined" density="comfortable" class="mb-3" />
        <v-select v-model="form.organisation" :items="orgOptions" :label="t('common.organisation')" variant="outlined" density="comfortable" class="mb-3" />
        <v-switch v-model="form.active" :label="t('common.active')" color="primary" hide-details />
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useUsersStore } from '@/stores/users'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'

const route = useRoute()
const router = useRouter()
const store = useUsersStore()
const appStore = useAppStore()
const { t } = useTranslation()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const saving = ref(false)
const user = computed(() => store.getUserById(route.params.id as string))
const form = reactive({ name: '', email: '', organisation: '', active: true })
const orgOptions = ['Dimitra', 'Green Valley Cooperative', 'Sunrise Farmers Cooperative', 'National Agricultural Bank', 'Rural Development Bank']
watch(user, u => { if (u) Object.assign(form, { name: u.name, email: u.email, organisation: u.organisation, active: u.active }) }, { immediate: true })
onMounted(() => { if (store.users.length === 0) store.loadUsers() })

async function handleSave() {
  if (formRef.value) { const { valid } = await formRef.value.validate(); if (!valid) return }
  saving.value = true
  await new Promise(r => setTimeout(r, 300))
  store.updateUser(route.params.id as string, form)
  saving.value = false
  appStore.showSnackbar('User updated successfully')
  router.push('/finance/users')
}
</script>
