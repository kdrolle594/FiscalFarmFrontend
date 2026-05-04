<template>
  <div v-if="program">
    <PageHeader :title="program.title" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.availableLoans')} > Detail`">
      <v-btn color="primary" @click="router.push(`/finance/available-loans/${program.id}/submit-application`)">
        {{ t('availableLoans.apply') }}
      </v-btn>
      <v-btn variant="outlined" class="ml-2" @click="router.back()">{{ t('common.back') }}</v-btn>
    </PageHeader>

    <!-- Header Card -->
    <v-card class="mb-4">
      <v-card-text>
        <div class="d-flex align-center flex-wrap ga-4">
          <v-avatar size="64"><v-img :src="program.logo" /></v-avatar>
          <div class="flex-grow-1">
            <div class="text-h6">{{ program.title }}</div>
            <div class="text-body-2 text-grey">{{ program.cooperative.name }}</div>
          </div>
          <div class="d-flex align-center ga-3">
            <v-avatar size="24" class="mr-1"><v-img :src="program.bank.logo" /></v-avatar>
            {{ program.bank.name }}
            <StatusChip :status="program.status" />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Approval Flow -->
    <v-card class="mb-4">
      <v-card-title>{{ t('common.approvalFlow') }}</v-card-title>
      <v-card-text>
        <v-timeline side="end" density="compact">
          <v-timeline-item v-for="(step, i) in program.applicationProcess" :key="i" dot-color="primary" size="small">
            <div class="text-body-2">{{ i + 1 }}. {{ step }}</div>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>

    <!-- Financial Details -->
    <v-card class="mb-4">
      <v-card-title>{{ t('common.financialDetails') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6" md="3"><div class="text-caption text-grey">{{ t('common.currency') }}</div><div class="font-weight-medium">{{ program.currency }}</div></v-col>
          <v-col cols="6" md="3"><div class="text-caption text-grey">Min Amount</div><div class="font-weight-medium">${{ program.loanAmountMin.toLocaleString() }}</div></v-col>
          <v-col cols="6" md="3"><div class="text-caption text-grey">Max Amount</div><div class="font-weight-medium">${{ program.loanAmountMax.toLocaleString() }}</div></v-col>
          <v-col cols="6" md="3"><div class="text-caption text-grey">Loan Term</div><div class="font-weight-medium">{{ program.termMonths }} {{ t('common.months') }}</div></v-col>
          <v-col cols="6" md="3"><div class="text-caption text-grey">Interest Rate</div><div class="font-weight-medium">{{ program.interestRate }}% {{ t('common.perAnnum') }}</div></v-col>
          <v-col cols="6" md="3"><div class="text-caption text-grey">Grace Period</div><div class="font-weight-medium">{{ program.gracePeriodMonths }} {{ t('common.months') }}</div></v-col>
          <v-col cols="6" md="3"><div class="text-caption text-grey">Eligible Crops</div><div class="font-weight-medium">{{ program.crops.join(', ') }}</div></v-col>
          <v-col cols="6" md="3"><div class="text-caption text-grey">{{ t('common.paymentFrequency') }}</div><div class="font-weight-medium">{{ program.paymentFrequency }}</div></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Description -->
    <v-card class="mb-4">
      <v-card-title>{{ t('common.description') }}</v-card-title>
      <v-card-text>{{ program.description }}</v-card-text>
    </v-card>

    <!-- Requirements -->
    <v-card>
      <v-card-title>{{ t('common.requirements') }}</v-card-title>
      <v-card-text>{{ program.conditionsRequirements }}</v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import StatusChip from '@/components/StatusChip.vue'
import { useLoanProgramsStore } from '@/stores/loanPrograms'
import { useTranslation } from '@/composables/useTranslation'

const route = useRoute()
const router = useRouter()
const store = useLoanProgramsStore()
const { t } = useTranslation()
const program = computed(() => store.getProgramById(route.params.id as string))
onMounted(() => { if (store.programs.length === 0) store.loadPrograms() })
</script>
