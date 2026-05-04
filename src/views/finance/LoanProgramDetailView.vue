<template>
  <div v-if="program">
    <PageHeader :title="program.title" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.loanPrograms')} > Detail`">
      <v-btn color="primary" class="mr-2" @click="router.push(`/finance/loan-programs/${program.id}/edit`)">{{ t('common.edit') }}</v-btn>
      <v-btn variant="outlined" class="mr-2" @click="router.push('/finance/loan-applications')">VIEW APPLICATIONS</v-btn>
      <v-btn variant="outlined" @click="router.back()">{{ t('common.back') }}</v-btn>
    </PageHeader>

    <!-- Header Card -->
    <v-card class="mb-4">
      <v-card-text>
        <div class="d-flex align-center flex-wrap ga-4">
          <v-avatar size="64">
            <v-img :src="program.logo" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-h6">{{ program.title }}</div>
            <div class="text-body-2 text-grey">{{ program.cooperative.name }}</div>
          </div>
          <div class="d-flex align-center ga-3">
            <div class="d-flex align-center">
              <v-avatar size="24" class="mr-2">
                <v-img :src="program.bank.logo" />
              </v-avatar>
              {{ program.bank.name }}
            </div>
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
          <v-timeline-item
            v-for="(step, i) in program.applicationProcess"
            :key="i"
            dot-color="primary"
            size="small"
          >
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
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">{{ t('common.currency') }}</div>
            <div class="font-weight-medium">{{ program.currency }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Minimum Amount</div>
            <div class="font-weight-medium">${{ program.loanAmountMin.toLocaleString() }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Maximum Amount</div>
            <div class="font-weight-medium">${{ program.loanAmountMax.toLocaleString() }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Loan Term</div>
            <div class="font-weight-medium">{{ program.termMonths }} months</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Interest Rate</div>
            <div class="font-weight-medium">{{ program.interestRate }}% per annum</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Type of Financing</div>
            <div class="font-weight-medium">{{ program.typeOfFinancing }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Grace Period</div>
            <div class="font-weight-medium">{{ program.gracePeriodMonths }} months</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Eligible Crops</div>
            <div class="font-weight-medium">{{ program.crops.join(', ') }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Additional Details -->
    <v-card class="mb-4">
      <v-card-title>Additional Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Country</div>
            <div class="font-weight-medium">{{ program.country }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Eligible Regions</div>
            <div class="font-weight-medium">{{ program.regions.join(', ') }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">{{ t('common.paymentFrequency') }}</div>
            <div class="font-weight-medium">{{ program.paymentFrequency }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Application Deadline</div>
            <div class="font-weight-medium">{{ new Date(program.applicationDeadline).toLocaleDateString() }}</div>
          </v-col>
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
  <div v-else class="text-center py-12">
    <v-progress-circular indeterminate color="primary" />
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

onMounted(() => {
  if (store.programs.length === 0) store.loadPrograms()
})
</script>
