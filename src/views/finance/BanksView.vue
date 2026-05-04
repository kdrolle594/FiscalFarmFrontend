<template>
  <div>
    <PageHeader :title="t('banks.title')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.banks')}`">
      <v-btn color="primary" prepend-icon="mdi-plus" to="/finance/banks/create">
        {{ t('banks.create') }}
      </v-btn>
    </PageHeader>

    <v-card>
      <v-card-text>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :label="t('common.search')"
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-4"
          style="max-width: 400px"
          @update:model-value="banksStore.setSearch"
        />

        <v-skeleton-loader v-if="banksStore.loading" type="table" />

        <v-alert v-else-if="banksStore.error" type="error" variant="tonal" class="mb-4">
          {{ banksStore.error }}
          <template #append>
            <v-btn variant="text" @click="banksStore.loadBanks()">{{ t('common.retry') }}</v-btn>
          </template>
        </v-alert>

        <v-data-table
          v-else
          :headers="headers"
          :items="banksStore.filteredBanks"
          :items-per-page="10"
          hover
          class="cursor-pointer"
          @click:row="(_e: Event, { item }: { item: Bank }) => router.push(`/finance/banks/${item.id}`)"
        >
          <template #item.title="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" class="mr-3">
                <v-img :src="item.logo" />
              </v-avatar>
              {{ item.title }}
            </div>
          </template>
          <template #item.contactPerson="{ item }">
            {{ item.contactFirstName }} {{ item.contactLastName }}
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
import { useBanksStore } from '@/stores/banks'
import type { Bank } from '@/types/bank'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const banksStore = useBanksStore()
const { t } = useTranslation()
const search = ref('')

const headers = computed(() => [
  { title: t('banks.name'), key: 'title', sortable: true },
  { title: 'Contact Person', key: 'contactPerson', sortable: true },
  { title: t('common.email'), key: 'contactEmail', sortable: true },
  { title: 'Phone Number', key: 'contactPhone', sortable: false },
])

onMounted(() => {
  if (banksStore.banks.length === 0) {
    banksStore.loadBanks()
  }
})
</script>

<style scoped>
.cursor-pointer :deep(tbody tr) {
  cursor: pointer;
}
</style>
