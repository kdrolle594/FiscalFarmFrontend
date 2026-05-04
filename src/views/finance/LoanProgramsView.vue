<template>
  <div>
    <PageHeader :title="t('loanPrograms.title')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.loanPrograms')}`">
      <v-btn color="primary" prepend-icon="mdi-plus" to="/finance/loan-programs/create">
        {{ t('loanPrograms.create') }}
      </v-btn>
    </PageHeader>

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
              v-model="bankFilter"
              :items="[{ title: 'All Banks', value: '' }, ...store.bankOptions]"
              :label="t('common.bank')"
              variant="outlined"
              density="comfortable"
              hide-details
              @update:model-value="store.setBankFilter"
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
              @update:model-value="store.setStatusFilter"
            />
          </v-col>
        </v-row>

        <v-skeleton-loader v-if="store.loading" type="table" />

        <v-data-table
          v-else
          :headers="headers"
          :items="store.filteredPrograms"
          :items-per-page="10"
          hover
          class="cursor-pointer"
          @click:row="(_e: Event, { item }: { item: LoanProgram }) => router.push(`/finance/loan-programs/${item.id}`)"
        >
          <template #item.title="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" class="mr-3">
                <v-img :src="item.logo" />
              </v-avatar>
              {{ item.title }}
            </div>
          </template>
          <template #item.bank="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="24" class="mr-2">
                <v-img :src="item.bank.logo" />
              </v-avatar>
              {{ item.bank.name }}
            </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import StatusChip from '@/components/StatusChip.vue'
import { useLoanProgramsStore } from '@/stores/loanPrograms'
import type { LoanProgram } from '@/types/loanProgram'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const store = useLoanProgramsStore()
const { t } = useTranslation()
const search = ref('')
const bankFilter = ref('')
const statusFilter = ref('')

const headers = computed(() => [
  { title: 'Program Title', key: 'title', sortable: true },
  { title: t('common.bank'), key: 'bank', sortable: true },
  { title: t('common.status'), key: 'status', sortable: true },
])

const statusOptions = computed(() => [
  { title: 'All Statuses', value: '' },
  { title: t('status.active'), value: 'Active' },
  { title: t('status.inactive'), value: 'Inactive' },
  { title: t('status.draft'), value: 'Draft' },
])

onMounted(() => {
  if (store.programs.length === 0) store.loadPrograms()
})
</script>

<style scoped>
.cursor-pointer :deep(tbody tr) { cursor: pointer; }
</style>
