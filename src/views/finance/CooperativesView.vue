<template>
  <div>
    <PageHeader :title="t('cooperatives.title')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.cooperatives')}`">
      <v-btn color="primary" prepend-icon="mdi-plus" to="/finance/cooperatives/create">{{ t('cooperatives.create') }}</v-btn>
    </PageHeader>
    <v-card>
      <v-card-text>
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" :label="t('common.search')" variant="outlined" density="comfortable" hide-details class="mb-4" style="max-width:400px" @update:model-value="store.setSearch" />
        <v-skeleton-loader v-if="store.loading" type="table" />
        <v-data-table v-else :headers="headers" :items="store.filteredCooperatives" :items-per-page="10" hover class="cursor-pointer" @click:row="(_e: Event, { item }: { item: Cooperative }) => router.push(`/finance/cooperatives/${item.id}/edit`)">
          <template #item.createdAt="{ item }">{{ new Date(item.createdAt).toLocaleDateString() }}</template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useCooperativesStore } from '@/stores/cooperatives'
import type { Cooperative } from '@/types/cooperative'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const store = useCooperativesStore()
const { t } = useTranslation()
const search = ref('')
const headers = computed(() => [
  { title: t('cooperatives.name'), key: 'name', sortable: true },
  { title: t('common.organisation'), key: 'organisationType', sortable: true },
  { title: t('common.createdAt'), key: 'createdAt', sortable: true },
])
onMounted(() => { if (store.cooperatives.length === 0) store.loadCooperatives() })
</script>

<style scoped>
.cursor-pointer :deep(tbody tr) { cursor: pointer; }
</style>
