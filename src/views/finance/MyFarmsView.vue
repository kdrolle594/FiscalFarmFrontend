<template>
  <div>
    <PageHeader :title="t('farms.title')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.myFarms')}`">
      <v-btn color="primary" prepend-icon="mdi-plus" to="/finance/my-farms/create">{{ t('farms.create') }}</v-btn>
    </PageHeader>
    <v-card>
      <v-card-text>
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" :label="t('common.search')" variant="outlined" density="comfortable" hide-details class="mb-4" style="max-width:400px" @update:model-value="store.setSearch" />
        <v-skeleton-loader v-if="store.loading" type="table" />
        <v-data-table v-else :headers="headers" :items="store.filteredFarms" :items-per-page="10" hover class="cursor-pointer" @click:row="(_e: Event, { item }: { item: Farm }) => router.push(`/finance/my-farms/${item.id}/edit`)">
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useFarmsStore } from '@/stores/farms'
import type { Farm } from '@/types/farm'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const store = useFarmsStore()
const { t } = useTranslation()
const search = ref('')
const headers = computed(() => [
  { title: t('farms.name'), key: 'name', sortable: true },
  { title: t('common.country'), key: 'country', sortable: true },
  { title: 'Province/State', key: 'province', sortable: true },
  { title: 'Village/Town', key: 'village', sortable: true },
  { title: 'Street Address', key: 'address', sortable: false },
])
onMounted(() => { if (store.farms.length === 0) store.loadFarms() })
</script>

<style scoped>
.cursor-pointer :deep(tbody tr) { cursor: pointer; }
</style>
