<template>
  <div v-if="program">
    <PageHeader :title="`${t('common.edit')}: ${program.title}`" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.loanPrograms')} > ${t('common.edit')}`">
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
              <v-text-field v-model.number="form.loanAmountMin" label="Minimum Amount" type="number" variant="outlined" density="comfortable" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model.number="form.loanAmountMax" label="Maximum Amount" type="number" variant="outlined" density="comfortable" />
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
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>{{ t('common.description') }}</v-card-title>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useLoanProgramsStore } from '@/stores/loanPrograms'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'

const route = useRoute()
const router = useRouter()
const store = useLoanProgramsStore()
const appStore = useAppStore()
const { t } = useTranslation()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const saving = ref(false)

const program = computed(() => store.getProgramById(route.params.id as string))

const form = reactive({
  title: '', status: 'Active' as 'Active' | 'Inactive' | 'Draft',
  currency: 'USD', loanAmountMin: 0, loanAmountMax: 0, termMonths: 12,
  interestRate: 5.0, typeOfFinancing: '', description: '', conditionsRequirements: '',
})

const rules = { required: (v: string) => !!v || 'Required' }

function populate() {
  if (program.value) {
    Object.assign(form, {
      title: program.value.title, status: program.value.status,
      currency: program.value.currency, loanAmountMin: program.value.loanAmountMin,
      loanAmountMax: program.value.loanAmountMax, termMonths: program.value.termMonths,
      interestRate: program.value.interestRate, typeOfFinancing: program.value.typeOfFinancing,
      description: program.value.description, conditionsRequirements: program.value.conditionsRequirements,
    })
  }
}

watch(program, populate, { immediate: true })

onMounted(() => { if (store.programs.length === 0) store.loadPrograms() })

async function handleSave() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  const idx = store.programs.findIndex(p => p.id === route.params.id)
  if (idx !== -1) {
    store.programs[idx] = { ...store.programs[idx], ...form }
  }
  saving.value = false
  appStore.showSnackbar('Loan program updated successfully')
  router.push(`/finance/loan-programs/${route.params.id}`)
}
</script>
