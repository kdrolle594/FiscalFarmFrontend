<template>
  <v-navigation-drawer
    v-model="appStore.sidebarOpen"
    :permanent="mdAndUp"
    :temporary="!mdAndUp"
    color="#2E7D32"
    theme="dark"
    width="240"
  >
    <div class="pa-4 d-flex align-center">
      <v-icon size="28" class="mr-2">mdi-sprout</v-icon>
      <span class="text-h6 font-weight-bold">DIMITRA</span>
    </div>

    <v-list density="compact" nav>
      <!-- Top-level items -->
      <v-list-item
        v-if="isVisible(['Dimitra', 'Cooperative', 'Bank', 'Farm'])"
        to="/finance/dashboard"
        prepend-icon="mdi-view-dashboard"
        :title="t('navigation.dashboard')"
        active-color="white"
      />
      <v-list-item
        v-if="isVisible(['Dimitra', 'Cooperative', 'Bank', 'Farm'])"
        to="/profile"
        prepend-icon="mdi-account"
        :title="t('navigation.profile')"
        active-color="white"
      />
      <v-list-item
        v-if="isVisible(['Dimitra', 'Cooperative', 'Bank', 'Farm'])"
        to="/settings"
        prepend-icon="mdi-cog"
        :title="t('navigation.settings')"
        active-color="white"
      />

      <!-- Finance Management group -->
      <v-list-group value="finance">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-finance"
            :title="t('navigation.financeManagement')"
            active-color="white"
          />
        </template>

        <v-list-item
          to="/finance/dashboard"
          prepend-icon="mdi-view-dashboard-variant"
          :title="t('navigation.dashboard')"
          active-color="white"
        />
        <v-list-item
          v-if="isVisible(['Dimitra'])"
          to="/finance/banks"
          prepend-icon="mdi-bank"
          :title="t('navigation.banks')"
          active-color="white"
        />
        <v-list-item
          v-if="isVisible(['Dimitra'])"
          to="/finance/cooperatives"
          prepend-icon="mdi-domain"
          :title="t('navigation.cooperatives')"
          active-color="white"
        />
        <v-list-item
          v-if="isVisible(['Dimitra'])"
          to="/finance/users"
          prepend-icon="mdi-account-multiple"
          :title="t('navigation.users')"
          active-color="white"
        />
        <v-list-item
          v-if="isVisible(['Cooperative', 'Bank'])"
          to="/finance/loan-programs"
          prepend-icon="mdi-file-document"
          :title="t('navigation.loanPrograms')"
          active-color="white"
        />
        <v-list-item
          v-if="isVisible(['Cooperative', 'Bank'])"
          to="/finance/loan-applications"
          prepend-icon="mdi-file-document-edit"
          :title="t('navigation.loanApplications')"
          active-color="white"
        />
        <v-list-item
          v-if="isVisible(['Farm'])"
          to="/finance/my-farms"
          prepend-icon="mdi-barn"
          :title="t('navigation.myFarms')"
          active-color="white"
        />
        <v-list-item
          v-if="isVisible(['Farm'])"
          to="/finance/available-loans"
          prepend-icon="mdi-cash-multiple"
          :title="t('navigation.availableLoans')"
          active-color="white"
        />
        <v-list-item
          v-if="isVisible(['Farm'])"
          to="/finance/my-loans"
          prepend-icon="mdi-cash-check"
          :title="t('navigation.myLoans')"
          active-color="white"
        />
      </v-list-group>
    </v-list>

    <template #append>
      <div class="pa-4 border-t">
        <div class="text-body-2">{{ authStore.userName }}</div>
        <div class="text-caption" style="opacity: 0.7;">{{ authStore.userEmail }}</div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'
import type { OrgType } from '@/types/auth'

const { mdAndUp } = useDisplay()
const authStore = useAuthStore()
const appStore = useAppStore()
const { t } = useTranslation()

function isVisible(allowedRoles: OrgType[]): boolean {
  if (!authStore.userRole) return false
  return allowedRoles.includes(authStore.userRole)
}
</script>
