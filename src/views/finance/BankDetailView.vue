<template>
  <div v-if="bank">
    <PageHeader :title="bank.title" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.banks')}`">
      <v-btn color="primary" class="mr-2" @click="router.push(`/finance/banks/${bank.id}/edit`)">
        {{ t('common.edit') }}
      </v-btn>
      <v-btn variant="outlined" @click="router.back()">{{ t('common.back') }}</v-btn>
    </PageHeader>

    <!-- Bank Info -->
    <v-card class="mb-4">
      <v-card-title>Bank</v-card-title>
      <v-card-text>
        <div class="d-flex align-center mb-2">
          <v-avatar size="48" class="mr-3">
            <v-img :src="bank.logo" />
          </v-avatar>
          <span class="text-h6">{{ bank.title }}</span>
        </div>
        <div class="text-body-2 text-grey">
          <div>SWIFT Code</div>
          <div class="font-weight-medium text-black">{{ bank.swiftCode }}</div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Contact Details -->
    <v-card class="mb-4">
      <v-card-title>Contact Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <div class="text-body-2 text-grey">First Name <v-icon size="12" color="success">mdi-circle</v-icon></div>
            <div>{{ bank.contactFirstName }}</div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="text-body-2 text-grey">Last Name <v-icon size="12" color="success">mdi-circle</v-icon></div>
            <div>{{ bank.contactLastName }}</div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="text-body-2 text-grey">Email <v-icon size="12" color="success">mdi-circle</v-icon></div>
            <div>{{ bank.contactEmail }}</div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="text-body-2 text-grey">Phone Number <v-icon size="12" color="success">mdi-circle</v-icon></div>
            <div>{{ bank.contactPhone }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- API Integration -->
    <v-card class="mb-4">
      <v-card-title>
        Bank Loan Application Integration API Info
        <v-icon size="16" color="success" class="ml-1">mdi-circle</v-icon>
      </v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <div class="text-body-2 text-grey">Endpoint URL <v-icon size="12" color="info">mdi-circle</v-icon></div>
            <v-text-field
              :model-value="bank.endpointUrl"
              variant="outlined"
              density="compact"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-body-2 text-grey">API Key <v-icon size="12" color="info">mdi-circle</v-icon></div>
            <v-text-field
              :model-value="showApiKey ? bank.apiKey : '••••••••••••••••••••••••••••'"
              variant="outlined"
              density="compact"
              readonly
              hide-details
              :append-inner-icon="showApiKey ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showApiKey = !showApiKey"
            />
          </v-col>
          <v-col cols="12" md="4" class="d-flex align-end ga-2">
            <v-btn variant="outlined" size="small" prepend-icon="mdi-content-copy">Copy</v-btn>
            <v-btn variant="outlined" size="small" prepend-icon="mdi-refresh">Regenerate</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Admin Credentials -->
    <v-card class="mb-4">
      <v-card-title>Account/Admin Credentials</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <div class="text-body-2 text-grey">Admin Username <v-icon size="12" color="info">mdi-circle</v-icon></div>
            <v-text-field
              :model-value="bank.adminUsername"
              variant="outlined"
              density="compact"
              readonly
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <div class="text-body-2 text-grey">Password <v-icon size="12" color="info">mdi-circle</v-icon></div>
            <v-text-field
              :model-value="showAdminPassword ? bank.adminPassword : '••••••••••••••'"
              variant="outlined"
              density="compact"
              readonly
              hide-details
              :append-inner-icon="showAdminPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showAdminPassword = !showAdminPassword"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 2FA -->
    <v-card>
      <v-card-title>Require 2FA</v-card-title>
      <v-card-text>
        <v-switch
          :model-value="bank.require2FA"
          label="Enable"
          color="primary"
          hide-details
          readonly
        />
      </v-card-text>
    </v-card>
  </div>
  <div v-else class="text-center py-12">
    <v-progress-circular indeterminate color="primary" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useBanksStore } from '@/stores/banks'
import { useTranslation } from '@/composables/useTranslation'

const route = useRoute()
const router = useRouter()
const banksStore = useBanksStore()
const { t } = useTranslation()

const showApiKey = ref(false)
const showAdminPassword = ref(false)

const bank = computed(() => banksStore.getBankById(route.params.id as string))

onMounted(() => {
  if (banksStore.banks.length === 0) {
    banksStore.loadBanks()
  }
})
</script>
