<template>
  <div>
    <PageHeader :title="t('availableLoans.apply')" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.availableLoans')} > ${t('availableLoans.apply')}`">
      <v-btn color="primary" :loading="submitting" @click="handleSubmit">{{ t('common.submit') }}</v-btn>
      <v-btn variant="outlined" class="ml-2" @click="router.back()">{{ t('common.back') }}</v-btn>
    </PageHeader>

    <v-form ref="formRef">
      <template v-for="field in formFields" :key="field.id">
        <!-- Group -->
        <v-card v-if="field.type === 'Group'" class="mb-4">
          <v-card-title>{{ field.label }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="child in field.children"
                :key="child.id"
                cols="12"
                md="6"
              >
                <v-text-field
                  v-if="child.type === 'Text Field'"
                  v-model="formData[child.id]"
                  :label="child.label"
                  :rules="child.mandatory ? [r => !!r || 'Required'] : []"
                  variant="outlined"
                  density="comfortable"
                />
                <v-text-field
                  v-else-if="child.type === 'Text Field Numeric'"
                  v-model.number="formData[child.id]"
                  :label="child.label"
                  type="number"
                  :rules="child.mandatory ? [r => r !== '' && r !== null && r !== undefined || 'Required'] : []"
                  variant="outlined"
                  density="comfortable"
                />
                <v-select
                  v-else-if="child.type === 'Dropdown'"
                  v-model="formData[child.id]"
                  :label="child.label"
                  :items="child.subdata || []"
                  item-title="label"
                  item-value="value"
                  :rules="child.mandatory ? [r => !!r || 'Required'] : []"
                  variant="outlined"
                  density="comfortable"
                />
                <v-file-input
                  v-else-if="child.type === 'Attach File'"
                  :label="child.label"
                  variant="outlined"
                  density="comfortable"
                  prepend-icon=""
                  prepend-inner-icon="mdi-paperclip"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Standalone fields -->
        <v-card v-else class="mb-4">
          <v-card-text>
            <v-text-field
              v-if="field.type === 'Text Field'"
              v-model="formData[field.id]"
              :label="field.label"
              :rules="field.mandatory ? [r => !!r || 'Required'] : []"
              variant="outlined"
              density="comfortable"
            />
            <v-text-field
              v-else-if="field.type === 'Text Field Numeric'"
              v-model.number="formData[field.id]"
              :label="field.label"
              type="number"
              variant="outlined"
              density="comfortable"
            />
            <v-select
              v-else-if="field.type === 'Dropdown'"
              v-model="formData[field.id]"
              :label="field.label"
              :items="field.subdata || []"
              item-title="label"
              item-value="value"
              variant="outlined"
              density="comfortable"
            />
            <v-file-input
              v-else-if="field.type === 'Attach File'"
              :label="field.label"
              variant="outlined"
              density="comfortable"
              prepend-icon=""
              prepend-inner-icon="mdi-paperclip"
            />
          </v-card-text>
        </v-card>
      </template>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useAppStore } from '@/stores/app'
import { mockApplicationFormFields } from '@/data/mockApplicationForm'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const appStore = useAppStore()
const { t } = useTranslation()
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const submitting = ref(false)

const formFields = mockApplicationFormFields
const formData = reactive<Record<string, string | number>>({})

async function handleSubmit() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) {
      appStore.showSnackbar('Please fill in all required fields', 'error')
      return
    }
  }
  submitting.value = true
  await new Promise(r => setTimeout(r, 500))
  submitting.value = false
  appStore.showSnackbar('Application submitted successfully!')
  router.push('/finance/my-loans')
}
</script>
