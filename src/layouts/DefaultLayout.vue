<template>
  <div>
    <AppSidebar />
    <AppHeader />
    <v-main>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
      <v-footer class="text-center text-caption text-grey pa-4">
        <v-row>
          <v-col>© Dimitra Incorporated 2025</v-col>
          <v-col class="text-right">
            <v-icon size="16" class="mr-1">mdi-sprout</v-icon>
            DIMITRA
          </v-col>
        </v-row>
      </v-footer>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>
