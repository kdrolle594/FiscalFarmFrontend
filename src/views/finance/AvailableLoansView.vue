<template>
  <div>
    <PageHeader :title="t('availableLoans.title')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.availableLoans')}`" />
    <v-card>
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" :label="t('common.search')" variant="outlined" density="comfortable" hide-details @update:model-value="store.setSearch" />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="bankFilter" :items="[{ title: 'All Banks', value: '' }, ...store.bankOptions]" :label="t('common.bank')" variant="outlined" density="comfortable" hide-details @update:model-value="store.setBankFilter" />
          </v-col>
        </v-row>

        <v-skeleton-loader v-if="store.loading" type="table" />
        <v-data-table
          v-else
          :headers="headers"
          :items="activePrograms"
          :items-per-page="10"
          hover
          class="cursor-pointer"
          @click:row="(_e: Event, { item }: { item: LoanProgram }) => router.push(`/finance/available-loans/${item.id}`)"
        >
          <template #item.title="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" class="mr-3"><v-img :src="item.logo" /></v-avatar>
              {{ item.title }}
            </div>
          </template>
          <template #item.bank="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="24" class="mr-2"><v-img :src="item.bank.logo" /></v-avatar>
              {{ item.bank.name }}
            </div>
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
import { useLoanProgramsStore } from '@/stores/loanPrograms'
import type { LoanProgram } from '@/types/loanProgram'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const store = useLoanProgramsStore()
const { t } = useTranslation()
const search = ref('')
const bankFilter = ref('')

const activePrograms = computed(() => store.filteredPrograms.filter(p => p.status === 'Active'))

const headers = computed(() => [
  { title: 'Program Title', key: 'title', sortable: true },
  { title: t('availableLoans.bank'), key: 'bank', sortable: true },
])

onMounted(() => { if (store.programs.length === 0) store.loadPrograms() })
</script>

<style scoped>
.cursor-pointer :deep(tbody tr) { cursor: pointer; }
</style>
