<template>
  <div>
    <PageHeader :title="t('banks.create')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.banks')} > ${t('common.create')}`">
      <v-btn variant="outlined" class="mr-2" @click="router.back()">{{ t('common.cancel') }}</v-btn>
      <v-btn color="primary" :loading="saving" @click="handleSave">{{ t('common.save') }}</v-btn>
    </PageHeader>

    <v-form ref="formRef">
      <!-- Basic Info -->
      <v-card class="mb-4">
        <v-card-title>{{ t('common.basicInfo') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.title"
                :label="t('banks.name')"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.swiftCode"
                :label="t('common.swiftCode')"
                :rules="[rules.required, rules.swift]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input
                :label="t('common.logo')"
                accept="image/*"
                variant="outlined"
                density="comfortable"
                prepend-icon=""
                prepend-inner-icon="mdi-camera"
                @update:model-value="handleLogoUpload"
              />
              <v-avatar v-if="form.logo" size="48" class="mt-1">
                <v-img :src="form.logo" />
              </v-avatar>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Contact Details -->
      <v-card class="mb-4">
        <v-card-title>{{ t('common.contactDetails') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contactFirstName"
                :label="t('common.firstName')"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contactLastName"
                :label="t('common.lastName')"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contactEmail"
                :label="t('common.email')"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.contactPhone"
                :label="t('common.phone')"
                :rules="[rules.required, rules.phone]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- API Integration -->
      <v-card class="mb-4">
        <v-card-title>API Integration</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.endpointUrl"
                :label="t('common.endpointUrl')"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.apiKey"
                :label="t('common.apiKey')"
                :type="showApiKey ? 'text' : 'password'"
                :append-inner-icon="showApiKey ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                density="comfortable"
                @click:append-inner="showApiKey = !showApiKey"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Admin Credentials -->
      <v-card class="mb-4">
        <v-card-title>Admin Credentials</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.adminUsername"
                :label="t('common.adminEmail')"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.adminPassword"
                :label="t('common.password')"
                :type="showAdminPw ? 'text' : 'password'"
                :append-inner-icon="showAdminPw ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
                @click:append-inner="showAdminPw = !showAdminPw"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Security -->
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useBanksStore } from '@/stores/banks'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'
import { uploadImage } from '@/services/uploads'

const router = useRouter()
const banksStore = useBanksStore()
const appStore = useAppStore()
const { t } = useTranslation()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const saving = ref(false)
const showApiKey = ref(false)
const showAdminPw = ref(false)

const form = reactive({
  title: '',
  swiftCode: '',
  logo: '',
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: '',
  endpointUrl: '',
  apiKey: '',
  adminUsername: '',
  adminPassword: '',
  require2FA: false,
})

const rules = {
  required: (v: string) => !!v || 'Required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Valid email required',
  swift: (v: string) => /^[A-Z0-9]{8,11}$/i.test(v) || 'SWIFT code must be 8-11 alphanumeric characters',
  phone: (v: string) => /^[0-9+() -]+$/.test(v) || 'Valid phone number required',
}

async function handleLogoUpload(files: File | File[] | null) {
  const file = Array.isArray(files) ? files[0] : files
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    appStore.showSnackbar('Logo must be less than 5 MB', 'error')
    return
  }
  try {
    const { publicUrl } = await uploadImage(file, 'bank-logo')
    form.logo = publicUrl
  } catch (err) {
    appStore.showSnackbar((err as Error).message || 'Upload failed', 'error')
  }
}

async function handleSave() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  banksStore.addBank({
    id: `bank-${Date.now()}`,
    ...form,
  })
  saving.value = false
  appStore.showSnackbar('Bank created successfully')
  router.push('/finance/banks')
}
</script>
