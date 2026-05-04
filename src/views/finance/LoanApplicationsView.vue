<template>
  <div>
    <PageHeader :title="t('loanApplications.title')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.loanApplications')}`" />

    <v-card>
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :label="t('common.search')"
              variant="outlined"
              density="comfortable"
              hide-details
              @update:model-value="store.setSearch"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="programFilter"
              :items="[{ title: 'All Programs', value: '' }, ...store.programOptions]"
              :label="t('loanApplications.program')"
              variant="outlined"
              density="comfortable"
              hide-details
              @update:model-value="store.setProgramFilter"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              :label="t('common.status')"
              variant="outlined"
              density="comfortable"
              hide-details
              @update:model-value="(v: string) => store.setStatusFilter(v as ApplicationStatus | '')"
            />
          </v-col>
        </v-row>

        <v-skeleton-loader v-if="store.loading" type="table" />

        <v-data-table
          v-else
          :headers="headers"
          :items="store.filteredApplications"
          :items-per-page="10"
          hover
          class="cursor-pointer"
          @click:row="(_e: Event, { item }: { item: LoanApplication }) => router.push(`/finance/loan-applications/${item.id}`)"
        >
          <template #item.idDate="{ item }">
            <div>
              <div class="font-weight-bold">{{ item.id }}</div>
              <div class="text-caption text-grey">{{ item.submissionDate }}</div>
            </div>
          </template>
          <template #item.applicant="{ item }">
            <div>
              <div class="font-weight-bold">{{ item.applicantName }}</div>
              <div class="text-caption text-grey">{{ item.applicantEmail }}</div>
            </div>
          </template>
          <template #item.program="{ item }">
            <div>
              <div>{{ item.loanProgramTitle }}</div>
              <div class="text-caption text-grey">{{ item.bankName }}</div>
            </div>
          </template>
          <template #item.amount="{ item }">
            {{ item.currency }} {{ item.amount.toLocaleString() }}
          </template>
          <template #item.status="{ item }">
            <StatusChip :status="item.status" />
          </template>
        </v-data-table>

        <!-- Status Legend -->
        <div class="mt-4 d-flex flex-wrap ga-4">
          <div class="text-caption font-weight-bold">{{ t('common.status') }} Legend:</div>
          <div v-for="s in legendStatuses" :key="s.label" class="d-flex align-center ga-1">
            <div :style="{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: s.color }" />
            <span class="text-caption">{{ s.label }}</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import StatusChip from '@/components/StatusChip.vue'
import { useLoanApplicationsStore } from '@/stores/loanApplications'
import type { LoanApplication, ApplicationStatus } from '@/types/loanApplication'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const store = useLoanApplicationsStore()
const { t } = useTranslation()
const search = ref('')
const programFilter = ref('')
const statusFilter = ref('')

const headers = computed(() => [
  { title: 'Application ID & Date', key: 'idDate', sortable: true },
  { title: t('loanApplications.applicant'), key: 'applicant', sortable: true },
  { title: t('loanApplications.program'), key: 'program', sortable: true },
  { title: t('common.amount'), key: 'amount', sortable: true },
  { title: t('common.status'), key: 'status', sortable: true },
])

const statusOptions = computed(() => [
  { title: 'All Statuses', value: '' },
  { title: t('status.pending'), value: 'Pending' },
  { title: t('status.waitingSignatures'), value: 'Waiting Signatures' },
  { title: t('status.sentToBank'), value: 'Sent to Bank' },
  { title: t('status.approved'), value: 'Approved' },
  { title: t('status.rejected'), value: 'Rejected' },
])

const legendStatuses = computed(() => [
  { label: 'Additional Info Requested', color: '#9E9E9E' },
  { label: t('status.pending'), color: '#757575' },
  { label: t('status.waitingSignatures'), color: '#FB8C00' },
  { label: t('status.sentToBank'), color: '#1976D2' },
  { label: t('status.approved'), color: '#4CAF50' },
  { label: t('status.rejected'), color: '#FF5252' },
])

onMounted(() => {
  if (store.applications.length === 0) store.loadApplications()
})
</script>

<style scoped>
.cursor-pointer :deep(tbody tr) { cursor: pointer; }
</style>
