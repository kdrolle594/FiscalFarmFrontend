<template>
  <div v-if="app">
    <PageHeader :title="`My Loan: ${app.id}`" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.myLoans')} > Detail`">
      <v-btn variant="outlined" @click="router.back()">{{ t('common.back') }}</v-btn>
    </PageHeader>

    <!-- Application Info -->
    <v-card class="mb-4">
      <v-card-title>{{ t('common.applicationInfo') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6" md="2"><div class="text-caption text-grey">{{ t('common.applicationId') }}</div><div class="font-weight-medium">{{ app.id }}</div></v-col>
          <v-col cols="6" md="2"><div class="text-caption text-grey">{{ t('common.submissionDate') }}</div><div>{{ app.submissionDate }}</div></v-col>
          <v-col cols="6" md="2"><div class="text-caption text-grey">{{ t('common.bank') }}</div><div class="d-flex align-center"><v-avatar size="20" class="mr-1"><v-img :src="app.bankLogo" /></v-avatar>{{ app.bankName }}</div></v-col>
          <v-col cols="6" md="3"><div class="text-caption text-grey">{{ t('loanApplications.program') }}</div><div class="d-flex align-center"><v-avatar size="20" class="mr-1"><v-img :src="app.loanProgramLogo" /></v-avatar>{{ app.loanProgramTitle }}</div></v-col>
          <v-col cols="6" md="1"><div class="text-caption text-grey">{{ t('common.amount') }}</div><div>{{ app.currency }} {{ app.amount.toLocaleString() }}</div></v-col>
          <v-col cols="6" md="2"><div class="text-caption text-grey">{{ t('common.status') }}</div><StatusChip :status="app.status" /></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Applicant Details -->
    <v-card class="mb-4">
      <v-card-title>{{ t('common.applicantDetails') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3"><div class="text-caption text-grey">{{ t('common.fullName') }}</div><div>{{ app.applicantName }}</div></v-col>
          <v-col cols="12" md="3"><div class="text-caption text-grey">{{ t('common.email') }}</div><div>{{ app.applicantEmail }}</div></v-col>
          <v-col cols="12" md="3"><div class="text-caption text-grey">{{ t('common.phone') }}</div><div>{{ app.applicantPhone }}</div></v-col>
          <v-col cols="12" md="3"><div class="text-caption text-grey">{{ t('common.nationalId') }}</div><div>{{ app.applicantNationalId }}</div></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Farm Details -->
    <v-card class="mb-4">
      <v-card-title>{{ t('common.farmDetails') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3"><div class="text-caption text-grey">Farm Name</div><div>{{ app.farm.name }}</div></v-col>
          <v-col cols="12" md="2"><div class="text-caption text-grey">{{ t('common.country') }}</div><div>{{ app.farm.country }}</div></v-col>
          <v-col cols="12" md="2"><div class="text-caption text-grey">Province</div><div>{{ app.farm.province }}</div></v-col>
          <v-col cols="12" md="2"><div class="text-caption text-grey">Village</div><div>{{ app.farm.village }}</div></v-col>
          <v-col cols="12" md="3"><div class="text-caption text-grey">Size</div><div>{{ app.farm.size }} hectares</div></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loan Details (if approved) -->
    <v-card v-if="app.loanDetails" class="mb-4">
      <v-card-title>{{ t('common.loanDetails') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6" md="2"><div class="text-caption text-grey">{{ t('common.total') }} {{ t('common.amount') }}</div><div>${{ app.loanDetails.totalAmount.toLocaleString() }}</div></v-col>
          <v-col cols="6" md="2"><div class="text-caption text-grey">Interest Rate</div><div>{{ app.loanDetails.interestRate }}%</div></v-col>
          <v-col cols="6" md="2"><div class="text-caption text-grey">Installments</div><div>{{ app.loanDetails.installments }}</div></v-col>
          <v-col cols="6" md="2"><div class="text-caption text-grey">Grace Period</div><div>{{ app.loanDetails.gracePeriod }} months</div></v-col>
          <v-col cols="6" md="4"><div class="text-caption text-grey">First Disbursement</div><div>{{ app.loanDetails.firstDisbursement }}</div></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Disbursement Schedule -->
    <v-card v-if="app.disbursementSchedule.length" class="mb-4">
      <v-card-title>Disbursement Schedule</v-card-title>
      <v-card-text>
        <v-data-table :headers="disbHeaders" :items="app.disbursementSchedule" :items-per-page="-1" density="compact">
          <template #item.amount="{ item }">{{ item.amount.toLocaleString() }}</template>
          <template #item.status="{ item }"><StatusChip :status="item.status" /></template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Repayment Schedule -->
    <v-card v-if="app.repaymentSchedule.length" class="mb-4">
      <v-card-title>Repayment Schedule</v-card-title>
      <v-card-text>
        <v-data-table :headers="repayHeaders" :items="app.repaymentSchedule" :items-per-page="-1" density="compact">
          <template #item.principal="{ item }">{{ item.principal.toFixed(2) }}</template>
          <template #item.interest="{ item }">{{ item.interest.toFixed(2) }}</template>
          <template #item.total="{ item }">{{ item.total.toFixed(2) }}</template>
          <template #item.status="{ item }"><StatusChip :status="item.status" /></template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Additional Questions -->
    <v-card class="mb-4">
      <v-card-title>{{ t('common.additionalDetails') }}</v-card-title>
      <v-card-text>
        <div class="mb-3"><div class="text-caption text-grey">{{ t('common.purposeOfLoan') }}</div><div>{{ app.additionalQuestions.loanPurpose }}</div></div>
        <div class="mb-3"><div class="text-caption text-grey">{{ t('common.comments') }}</div><div>{{ app.additionalQuestions.comments }}</div></div>
        <div><div class="text-caption text-grey">{{ t('common.landOwnership') }}</div><div>{{ app.additionalQuestions.landOwnershipProof }}</div></div>
      </v-card-text>
    </v-card>

    <!-- Documents -->
    <v-card>
      <v-card-title>{{ t('common.documents') }}</v-card-title>
      <v-card-text>
        <div v-for="doc in app.documents" :key="doc.name" class="d-flex align-center mb-2">
          <v-icon :color="doc.type === 'pdf' ? 'red' : doc.type === 'img' ? 'blue' : 'orange'" class="mr-2">
            {{ doc.type === 'pdf' ? 'mdi-file-pdf-box' : doc.type === 'img' ? 'mdi-file-image' : 'mdi-file-document' }}
          </v-icon>
          <span>{{ doc.name }}</span>
          <v-spacer />
          <v-btn icon size="small" variant="text"><v-icon>mdi-download</v-icon></v-btn>
        </div>
      </v-card-text>
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
import { useLoanApplicationsStore } from '@/stores/loanApplications'
import { useTranslation } from '@/composables/useTranslation'

const route = useRoute()
const router = useRouter()
const store = useLoanApplicationsStore()
const { t } = useTranslation()
const app = computed(() => store.getApplicationById(route.params.id as string))

const disbHeaders = computed(() => [
  { title: '#', key: 'number' },
  { title: t('common.amount'), key: 'amount' },
  { title: t('common.date'), key: 'date' },
  { title: t('common.transactionId'), key: 'transactionId' },
  { title: t('common.status'), key: 'status' },
])

const repayHeaders = computed(() => [
  { title: '#', key: 'installment' },
  { title: t('common.dueDate'), key: 'dueDate' },
  { title: t('common.principal'), key: 'principal' },
  { title: t('common.interest'), key: 'interest' },
  { title: t('common.total'), key: 'total' },
  { title: t('common.transactionId'), key: 'transactionId' },
  { title: t('common.status'), key: 'status' },
])

onMounted(() => { if (store.applications.length === 0) store.loadApplications() })
</script>
