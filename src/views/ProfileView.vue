<template>
  <div>
    <PageHeader :title="t('common.profile')" :breadcrumb="t('common.profile')" />
    <v-card max-width="600" class="mx-auto pa-6">
      <div class="text-center mb-6">
        <v-avatar size="120" color="primary" class="mb-4 cursor-pointer" @click="triggerFileInput">
          <v-img v-if="authStore.userAvatar" :src="authStore.userAvatar" />
          <v-icon v-else size="48">mdi-account</v-icon>
        </v-avatar>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleFileChange"
        />
        <div>
          <v-btn
            v-if="authStore.userAvatar"
            variant="text"
            color="error"
            size="small"
            @click="authStore.removeAvatar()"
          >
            {{ t('common.removeAvatar') }}
          </v-btn>
        </div>
        <v-alert v-if="avatarError" type="error" variant="tonal" density="compact" class="mt-2">
          {{ avatarError }}
        </v-alert>
      </div>
      <v-text-field
        :model-value="authStore.userName"
        :label="t('common.name')"
        variant="outlined"
        readonly
        density="comfortable"
        class="mb-3"
      />
      <v-text-field
        :model-value="authStore.userEmail"
        :label="t('common.email')"
        variant="outlined"
        readonly
        density="comfortable"
        class="mb-3"
      />
      <v-text-field
        :model-value="authStore.userOrganisation"
        :label="t('common.organisation')"
        variant="outlined"
        readonly
        density="comfortable"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { useTranslation } from '@/composables/useTranslation'

const authStore = useAuthStore()
const { t } = useTranslation()
const fileInput = ref<HTMLInputElement | null>(null)
const avatarError = ref('')

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  avatarError.value = ''
  if (file.size > 2 * 1024 * 1024) {
    avatarError.value = 'File size must be less than 2 MB'
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    authStore.updateAvatar(e.target?.result as string)
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
