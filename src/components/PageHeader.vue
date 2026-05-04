<template>
  <div class="d-flex align-center justify-space-between mb-6">
    <div>
      <div v-if="breadcrumb" class="text-caption text-grey mb-1">{{ breadcrumb }}</div>
      <h1 class="text-h4 font-weight-bold">{{ title }}</h1>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  breadcrumb?: string
}>()
</script>
