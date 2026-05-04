<template>
  <v-app-bar flat color="white" border="b">
    <v-app-bar-nav-icon @click="appStore.toggleSidebar()" />
    <v-chip
      v-if="authStore.userOrganisation"
      color="primary"
      variant="flat"
      size="small"
      class="ml-2"
    >
      {{ authStore.userOrganisation }}
    </v-chip>
    <v-spacer />
    <span class="text-body-2 text-grey-darken-1 d-none d-md-inline">
      Dimitra Finance Admin Prototype
    </span>
    <v-spacer />
    <v-btn icon size="small" class="mr-1">
      <v-icon>mdi-monitor-dashboard</v-icon>
    </v-btn>
    <v-btn icon size="small" to="/settings" class="mr-1">
      <v-icon>mdi-cog</v-icon>
    </v-btn>
    <v-btn icon size="small" class="mr-2">
      <v-badge color="error" :content="3" overlap>
        <v-icon>mdi-bell</v-icon>
      </v-badge>
    </v-btn>
    <v-menu>
      <template #activator="{ props }">
        <div v-bind="props" class="d-flex align-center cursor-pointer">
          <v-avatar size="40" color="primary" class="mr-2">
            <v-img v-if="authStore.userAvatar" :src="authStore.userAvatar" />
            <span v-else class="text-white text-body-2">
              {{ authStore.userName.charAt(0) }}
            </span>
          </v-avatar>
          <div class="d-none d-md-block text-right mr-2">
            <div class="text-body-2 font-weight-medium">{{ authStore.userName }}</div>
            <div class="text-caption text-grey">{{ authStore.userEmail }}</div>
          </div>
          <v-icon size="small">mdi-chevron-down</v-icon>
        </div>
      </template>
      <v-list density="compact">
        <v-list-item to="/profile" prepend-icon="mdi-account">
          <v-list-item-title>{{ t('common.profile') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleLogout" prepend-icon="mdi-logout">
          <v-list-item-title>{{ t('common.logout') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const { t } = useTranslation()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
