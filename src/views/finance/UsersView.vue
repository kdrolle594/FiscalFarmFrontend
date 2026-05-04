<template>
  <div>
    <PageHeader :title="t('users.title')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.users')}`">
      <v-btn color="primary" prepend-icon="mdi-plus" to="/finance/users/create">{{ t('users.create') }}</v-btn>
    </PageHeader>
    <v-card>
      <v-card-text>
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" :label="t('common.search')" variant="outlined" density="comfortable" hide-details class="mb-4" style="max-width:400px" @update:model-value="store.setSearch" />
        <v-skeleton-loader v-if="store.loading" type="table" />
        <v-data-table v-else :headers="headers" :items="store.filteredUsers" :items-per-page="10" hover class="cursor-pointer" @click:row="(_e: Event, { item }: { item: PlatformUser }) => router.push(`/finance/users/${item.id}/edit`)">
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
import { useUsersStore } from '@/stores/users'
import type { PlatformUser } from '@/types/platformUser'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const store = useUsersStore()
const { t } = useTranslation()
const search = ref('')
const headers = computed(() => [
  { title: t('common.name'), key: 'name', sortable: true },
  { title: t('common.email'), key: 'email', sortable: true },
  { title: t('common.organisation'), key: 'organisation', sortable: true },
  { title: t('common.createdAt'), key: 'createdAt', sortable: true },
])
onMounted(() => { if (store.users.length === 0) store.loadUsers() })
</script>

<style scoped>
.cursor-pointer :deep(tbody tr) { cursor: pointer; }
</style>
