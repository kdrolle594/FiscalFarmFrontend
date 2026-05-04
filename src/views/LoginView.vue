<template>
  <v-container fluid class="login-bg fill-height d-flex align-center justify-center">
    <v-card width="420" class="pa-6" rounded="lg" elevation="4">
      <div class="text-center mb-4">
        <v-icon size="48" color="primary" class="mb-2">mdi-sprout</v-icon>
        <div class="text-caption text-grey">Dimitra Finance Admin Prototype</div>
        <h2 class="text-h5 font-weight-bold mt-2">
          {{ forgotMode ? 'Reset Password' : 'Sign In' }}
        </h2>
        <p class="text-body-2 text-grey mt-1">
          {{ forgotMode ? 'Enter your email to receive a reset link' : 'Enter your credentials to access the dashboard' }}
        </p>
      </div>

      <v-form v-if="!forgotMode" ref="loginForm" @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          :rules="[rules.required, rules.email]"
          variant="outlined"
          density="comfortable"
          class="mb-2"
        />
        <v-text-field
          v-model="password"
          label="Password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.required]"
          variant="outlined"
          density="comfortable"
          class="mb-1"
          @click:append-inner="showPassword = !showPassword"
        />
        <div class="text-right mb-3">
          <a class="text-caption text-primary cursor-pointer" @click="forgotMode = true">
            Forgot password?
          </a>
        </div>
        <v-alert v-if="loginError" type="error" variant="tonal" density="compact" class="mb-3">
          {{ loginError }}
        </v-alert>
        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          :loading="loading"
          rounded="lg"
        >
          Sign In
        </v-btn>
      </v-form>

      <v-form v-else @submit.prevent="handleResetPassword">
        <v-text-field
          v-model="email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          :rules="[rules.required, rules.email]"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />
        <v-alert v-if="resetSent" type="success" variant="tonal" density="compact" class="mb-3">
          Reset link sent! Check your email.
        </v-alert>
        <v-btn type="submit" color="primary" block size="large" rounded="lg" class="mb-3">
          Send Reset Link
        </v-btn>
        <div class="text-center">
          <a class="text-caption text-primary cursor-pointer" @click="forgotMode = false; resetSent = false">
            Back to Sign In
          </a>
        </div>
      </v-form>

      <v-expansion-panels class="mt-4" variant="accordion">
        <v-expansion-panel title="Demo Credentials">
          <v-expansion-panel-text>
            <v-table density="compact" class="text-caption">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in demoUsers"
                  :key="user.email"
                  class="cursor-pointer"
                  @click="fillCredentials(user.email)"
                >
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { mockUsers } from '@/data/mockAuth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const loginError = ref('')
const forgotMode = ref(false)
const resetSent = ref(false)
const loginForm = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const demoUsers = mockUsers.map(u => ({
  name: u.name,
  email: u.email,
  role: u.role,
}))

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Enter a valid email',
}

function fillCredentials(userEmail: string) {
  email.value = userEmail
  password.value = 'password123'
}

async function handleLogin() {
  if (loginForm.value) {
    const { valid } = await loginForm.value.validate()
    if (!valid) return
  }
  loading.value = true
  loginError.value = ''
  const success = await authStore.login(email.value, password.value)
  loading.value = false
  if (success) {
    router.push('/finance/dashboard')
  } else {
    loginError.value = 'Invalid email or password'
  }
}

function handleResetPassword() {
  resetSent.value = true
}
</script>

<style scoped>
.login-bg {
  background: linear-gradient(135deg, #1B5E20 0%, #4CAF50 50%, #2E7D32 100%);
  min-height: 100vh;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
