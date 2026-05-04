<template>
  <div>
    <PageHeader :title="t('myLoans.title')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.myLoans')}`" />
    <v-card>
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" :label="t('common.search')" variant="outlined" density="comfortable" hide-details @update:model-value="store.setSearch" />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="statusFilter" :items="statusOptions" :label="t('common.status')" variant="outlined" density="comfortable" hide-details @update:model-value="(v: string) => store.setStatusFilter(v as ApplicationStatus | '')" />
          </v-col>
        </v-row>

        <v-skeleton-loader v-if="store.loading" type="table" />
        <v-data-table
          v-else
          :headers="headers"
          :items="myApplications"
          :items-per-page="10"
          hover
          class="cursor-pointer"
          @click:row="(_e: Event, { item }: { item: LoanApplication }) => router.push(`/finance/my-loans/${item.id}`)"
        >
          <template #item.idDate="{ item }">
            <div>
              <div class="font-weight-bold">{{ item.id }}</div>
              <div class="text-caption text-grey">{{ item.submissionDate }}</div>
            </div>
          </template>
          <template #item.bank="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="24" class="mr-2"><v-img :src="item.bankLogo" /></v-avatar>
              {{ item.bankName }}
            </div>
          </template>
          <template #item.program="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="24" class="mr-2"><v-img :src="item.loanProgramLogo" /></v-avatar>
              {{ item.loanProgramTitle }}
            </div>
          </template>
          <template #item.amount="{ item }">
            {{ item.currency }} {{ item.amount.toLocaleString() }}
          </template>
          <template #item.status="{ item }">
            <StatusChip :status="item.status" />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import StatusChip from '@/components/StatusChip.vue'
import { useLoanApplicationsStore } from '@/stores/loanApplications'
import { useAuthStore } from '@/stores/auth'
import type { LoanApplication, ApplicationStatus } from '@/types/loanApplication'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const store = useLoanApplicationsStore()
const authStore = useAuthStore()
const { t } = useTranslation()
const search = ref('')
const statusFilter = ref('')

const myApplications = computed(() =>
  store.filteredApplications.filter(a => a.applicantEmail === authStore.userEmail)
)

const headers = computed(() => [
  { title: 'Submission Date & ID', key: 'idDate', sortable: true },
  { title: t('availableLoans.bank'), key: 'bank', sortable: true },
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

onMounted(() => { if (store.applications.length === 0) store.loadApplications() })
</script>

<style scoped>
.cursor-pointer :deep(tbody tr) { cursor: pointer; }
</style>
