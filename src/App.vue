<template>
  <v-app>
    <router-view />
    <v-snackbar
      v-model="appStore.snackbar.show"
      :color="appStore.snackbar.color"
      :timeout="appStore.snackbar.timeout"
      location="top"
    >
      {{ appStore.snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="appStore.hideSnackbar()">Close</v-btn>
      </template>
    </v-snackbar>
    <SpeedInsights />
  </v-app>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { SpeedInsights } from '@vercel/speed-insights/vue'

const appStore = useAppStore()
</script>

<style>
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}
</style>
