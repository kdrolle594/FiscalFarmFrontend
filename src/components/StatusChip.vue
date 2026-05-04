<template>
  <v-chip :color="chipColor" :variant="variant" size="small">
    {{ translatedStatus }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  status: string
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
}>()

const { t } = useTranslation()

const translatedStatus = computed(() => {
  switch (props.status) {
    case 'Active':
      return t('status.active')
    case 'Approved':
      return t('status.approved')
    case 'Completed':
      return t('status.completed')
    case 'Pending':
      return t('status.pending')
    case 'Waiting Signatures':
      return t('status.waitingSignatures')
    case 'Sent to Bank':
      return t('status.sentToBank')
    case 'Rejected':
      return t('status.rejected')
    case 'Draft':
      return t('status.draft')
    case 'Inactive':
      return t('status.inactive')
    default:
      return props.status
  }
})

const chipColor = computed(() => {
  switch (props.status) {
    case 'Active':
    case 'Approved':
    case 'Completed':
      return 'success'
    case 'Pending':
      return 'grey'
    case 'Waiting Signatures':
      return 'warning'
    case 'Sent to Bank':
      return 'info'
    case 'Rejected':
      return 'error'
    case 'Draft':
    case 'Inactive':
      return 'grey-lighten-1'
    default:
      return 'grey'
  }
})
</script>
