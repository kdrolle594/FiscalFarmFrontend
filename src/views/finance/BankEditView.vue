<template>
  <div v-if="bank">
    <PageHeader :title="`${t('common.edit')} ${bank.title}`" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.banks')} > ${t('common.edit')}`">
      <v-btn variant="outlined" class="mr-2" @click="router.back()">{{ t('common.cancel') }}</v-btn>
      <v-btn color="primary" :loading="saving" @click="handleSave">{{ t('common.save') }}</v-btn>
    </PageHeader>

    <v-form ref="formRef">
      <v-card class="mb-4">
        <v-card-title>{{ t('common.basicInfo') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.title" :label="t('banks.name')" :rules="[rules.required]" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.swiftCode" :label="t('common.swiftCode')" :rules="[rules.required, rules.swift]" variant="outlined" density="comfortable" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>{{ t('common.contactDetails') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.contactFirstName" :label="t('common.firstName')" :rules="[rules.required]" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.contactLastName" :label="t('common.lastName')" :rules="[rules.required]" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.contactEmail" :label="t('common.email')" :rules="[rules.required, rules.email]" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.contactPhone" :label="t('common.phone')" :rules="[rules.required]" variant="outlined" density="comfortable" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>API Integration</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.endpointUrl" :label="t('common.endpointUrl')" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.apiKey" :label="t('common.apiKey')" type="password" variant="outlined" density="comfortable" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>Admin Credentials</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.adminUsername" :label="t('common.adminEmail')" :rules="[rules.required]" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.adminPassword" :label="t('common.password')" type="password" :rules="[rules.required]" variant="outlined" density="comfortable" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title>{{ t('common.security') }}</v-card-title>
        <v-card-text>
          <v-switch v-model="form.require2FA" label="Require 2FA" color="primary" hide-details />
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useBanksStore } from '@/stores/banks'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'

const route = useRoute()
const router = useRouter()
const banksStore = useBanksStore()
const appStore = useAppStore()
const { t } = useTranslation()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const saving = ref(false)

const bank = computed(() => banksStore.getBankById(route.params.id as string))

const form = reactive({
  title: '', swiftCode: '', contactFirstName: '', contactLastName: '',
  contactEmail: '', contactPhone: '', endpointUrl: '', apiKey: '',
  adminUsername: '', adminPassword: '', require2FA: false,
})

const rules = {
  required: (v: string) => !!v || 'Required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Valid email required',
  swift: (v: string) => /^[A-Z0-9]{8,11}$/i.test(v) || 'SWIFT code must be 8-11 alphanumeric characters',
}

function populateForm() {
  if (bank.value) {
    Object.assign(form, {
      title: bank.value.title, swiftCode: bank.value.swiftCode,
      contactFirstName: bank.value.contactFirstName, contactLastName: bank.value.contactLastName,
      contactEmail: bank.value.contactEmail, contactPhone: bank.value.contactPhone,
      endpointUrl: bank.value.endpointUrl, apiKey: bank.value.apiKey,
      adminUsername: bank.value.adminUsername, adminPassword: bank.value.adminPassword,
      require2FA: bank.value.require2FA,
    })
  }
}

watch(bank, populateForm, { immediate: true })

onMounted(() => {
  if (banksStore.banks.length === 0) banksStore.loadBanks()
})

async function handleSave() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  banksStore.updateBank(route.params.id as string, form)
  saving.value = false
  appStore.showSnackbar('Bank updated successfully')
  router.push(`/finance/banks/${route.params.id}`)
}
</script>
