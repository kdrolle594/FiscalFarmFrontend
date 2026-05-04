<template>
  <div>
    <PageHeader :title="t('loanPrograms.create')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.loanPrograms')} > ${t('common.create')}`">
      <v-btn variant="outlined" class="mr-2" @click="router.back()">{{ t('common.cancel') }}</v-btn>
      <v-btn color="primary" :loading="saving" @click="handleSave">{{ t('common.save') }}</v-btn>
    </PageHeader>

    <v-form ref="formRef">
      <v-card class="mb-4">
        <v-card-title>{{ t('common.basicInfo') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.title" :label="t('loanPrograms.name')" :rules="[rules.required]" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="form.bankId" :items="bankOptions" :label="t('common.bank')" :rules="[rules.required]" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="form.status" :items="['Active', 'Inactive', 'Draft']" :label="t('common.status')" variant="outlined" density="comfortable" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>{{ t('common.loanDetails') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select v-model="form.currency" :items="['USD', 'EUR', 'IDR', 'SRD']" :label="t('common.currency')" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.loanAmountMin" label="Minimum Amount" type="number" :rules="[rules.required]" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.loanAmountMax" label="Maximum Amount" type="number" :rules="[rules.required]" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.termMonths" label="Term (months)" type="number" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.interestRate" label="Interest Rate (%)" type="number" step="0.1" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.typeOfFinancing" label="Type of Financing" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.gracePeriodMonths" label="Grace Period (months)" type="number" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.paymentFrequency" label="Payment Frequency" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.applicationDeadline" label="Application Deadline" type="date" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.country" label="Country" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="6">
              <v-combobox v-model="form.regions" label="Eligible Regions" variant="outlined" density="comfortable" multiple chips />
            </v-col>
            <v-col cols="12">
              <v-combobox v-model="form.crops" label="Eligible Crops" variant="outlined" density="comfortable" multiple chips />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>Description</v-card-title>
        <v-card-text>
          <v-textarea v-model="form.description" :label="t('common.description')" variant="outlined" rows="4" />
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title>{{ t('common.requirements') }}</v-card-title>
        <v-card-text>
          <v-textarea v-model="form.conditionsRequirements" label="Conditions & Requirements" variant="outlined" rows="4" />
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useLoanProgramsStore } from '@/stores/loanPrograms'
import { useBanksStore } from '@/stores/banks'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const store = useLoanProgramsStore()
const banksStore = useBanksStore()
const authStore = useAuthStore()
const appStore = useAppStore()
const { t } = useTranslation()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const saving = ref(false)

const bankOptions = ref<{ title: string; value: string }[]>([])

const form = reactive({
  title: '', bankId: '', status: 'Draft' as 'Active' | 'Inactive' | 'Draft',
  currency: 'USD', loanAmountMin: 0, loanAmountMax: 0, termMonths: 12,
  interestRate: 5.0, typeOfFinancing: '', gracePeriodMonths: 0,
  crops: [] as string[], country: '', regions: [] as string[],
  description: '', applicationDeadline: '', paymentFrequency: 'Monthly',
  conditionsRequirements: '',
})

const rules = { required: (v: string | number) => (v !== '' && v !== null && v !== undefined) || 'Required' }

onMounted(async () => {
  if (banksStore.banks.length === 0) await banksStore.loadBanks()
  bankOptions.value = banksStore.banks.map(b => ({ title: b.title, value: b.id }))
})

async function handleSave() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  const bank = banksStore.getBankById(form.bankId)
  store.programs.push({
    id: `lp-${Date.now()}`,
    title: form.title,
    logo: 'https://ui-avatars.com/api/?name=NP&background=607D8B&color=fff&rounded=true&size=40',
    cooperative: { id: 'coop-1', name: authStore.userOrganisation },
    bank: { id: form.bankId, name: bank?.title || '', logo: bank?.logo || '' },
    status: form.status,
    currency: form.currency,
    loanAmountMin: form.loanAmountMin,
    loanAmountMax: form.loanAmountMax,
    termMonths: form.termMonths,
    interestRate: form.interestRate,
    typeOfFinancing: form.typeOfFinancing,
    gracePeriodMonths: form.gracePeriodMonths,
    crops: form.crops,
    country: form.country,
    regions: form.regions,
    description: form.description,
    applicationDeadline: form.applicationDeadline,
    paymentFrequency: form.paymentFrequency,
    conditionsRequirements: form.conditionsRequirements,
    applicationProcess: ['Cooperative Review', 'Bank Assessment', 'Approval'],
  })
  saving.value = false
  appStore.showSnackbar('Loan program created successfully')
  router.push('/finance/loan-programs')
}
</script>
