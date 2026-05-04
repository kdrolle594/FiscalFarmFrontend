<template>
  <div v-if="app">
    <PageHeader :title="`Loan Application: ${app.id}`" :breadcrumb="`${t('navigation.financeManagement')} > ${t('navigation.loanApplications')} > Detail`">
      <template v-if="authStore.userRole === 'Cooperative'">
        <v-btn color="warning" class="mr-2" @click="requestInfoDialog = true">REQUEST ADDITIONAL INFORMATION</v-btn>
        <v-btn color="error" class="mr-2" @click="rejectDialog = true">REJECT</v-btn>
        <v-btn color="primary" @click="handleSendToBank">SEND TO BANK</v-btn>
      </template>
      <template v-else-if="authStore.userRole === 'Bank'">
        <v-btn color="primary" class="mr-2" @click="handleApprove">INITIATE APPROVAL PROCESS</v-btn>
        <v-btn color="error" @click="rejectDialog = true">REJECT</v-btn>
      </template>
    </PageHeader>

    <!-- Application Info -->
    <v-card class="mb-4">
      <v-card-title>Application Information <v-icon size="16" color="info">mdi-information</v-icon></v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6" md="2">
            <div class="text-caption text-grey">Application ID</div>
            <div class="font-weight-medium">{{ app.id }}</div>
          </v-col>
          <v-col cols="6" md="2">
            <div class="text-caption text-grey">Submission Date</div>
            <div>{{ app.submissionDate }}</div>
          </v-col>
          <v-col cols="6" md="2">
            <div class="text-caption text-grey">Bank</div>
            <div class="d-flex align-center">
              <v-avatar size="20" class="mr-1"><v-img :src="app.bankLogo" /></v-avatar>
              {{ app.bankName }}
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Loan Program</div>
            <div class="d-flex align-center">
              <v-avatar size="20" class="mr-1"><v-img :src="app.loanProgramLogo" /></v-avatar>
              {{ app.loanProgramTitle }}
            </div>
          </v-col>
          <v-col cols="6" md="1">
            <div class="text-caption text-grey">Amount</div>
            <div>{{ app.currency }} {{ app.amount.toLocaleString() }}</div>
          </v-col>
          <v-col cols="6" md="2">
            <div class="text-caption text-grey">Status</div>
            <StatusChip :status="app.status" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Applicant Details -->
    <v-card class="mb-4">
      <v-card-title>Applicant Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3"><div class="text-caption text-grey">Full Name</div><div>{{ app.applicantName }}</div></v-col>
          <v-col cols="12" md="3"><div class="text-caption text-grey">Email</div><div>{{ app.applicantEmail }}</div></v-col>
          <v-col cols="12" md="3"><div class="text-caption text-grey">Phone</div><div>{{ app.applicantPhone }}</div></v-col>
          <v-col cols="12" md="3"><div class="text-caption text-grey">National ID</div><div>{{ app.applicantNationalId }}</div></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Farm Details -->
    <v-card class="mb-4">
      <v-card-title>Farm Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3"><div class="text-caption text-grey">Farm Name</div><div>{{ app.farm.name }}</div></v-col>
          <v-col cols="12" md="2"><div class="text-caption text-grey">Country</div><div>{{ app.farm.country }}</div></v-col>
          <v-col cols="12" md="2"><div class="text-caption text-grey">Province</div><div>{{ app.farm.province }}</div></v-col>
          <v-col cols="12" md="2"><div class="text-caption text-grey">Village</div><div>{{ app.farm.village }}</div></v-col>
          <v-col cols="12" md="3"><div class="text-caption text-grey">Size</div><div>{{ app.farm.size }} hectares</div></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Farm Reports -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-card height="100%">
          <v-card-title class="text-body-1">Yield Prediction Report</v-card-title>
          <v-card-text>
            <div class="text-caption text-grey">Predicted Yield</div>
            <div>{{ app.farmReports.yieldPrediction.predictedYield }}</div>
            <div class="text-caption text-grey mt-2">Confidence</div>
            <div>{{ app.farmReports.yieldPrediction.confidence }}%</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card height="100%">
          <v-card-title class="text-body-1">Loan Suitability Report</v-card-title>
          <v-card-text>
            <div class="text-caption text-grey">Rating</div>
            <div>{{ app.farmReports.loanSuitability.rating }}</div>
            <div class="text-caption text-grey mt-2">Notes</div>
            <div>{{ app.farmReports.loanSuitability.notes }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card height="100%">
          <v-card-title class="text-body-1">Soil Analysis Report</v-card-title>
          <v-card-text>
            <div class="text-caption text-grey">pH</div>
            <div>{{ app.farmReports.soilAnalysis.ph }}</div>
            <div class="text-caption text-grey mt-2">Organic Matter</div>
            <div>{{ app.farmReports.soilAnalysis.organicMatter }}%</div>
            <div class="text-caption text-grey mt-2">Classification</div>
            <div>{{ app.farmReports.soilAnalysis.classification }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Additional Questions -->
    <v-card class="mb-4">
      <v-card-title>Additional Questions</v-card-title>
      <v-card-text>
        <div class="mb-3">
          <div class="text-caption text-grey">How will the loan help your farm?</div>
          <div>{{ app.additionalQuestions.loanPurpose }}</div>
        </div>
        <div class="mb-3">
          <div class="text-caption text-grey">Comments</div>
          <div>{{ app.additionalQuestions.comments }}</div>
        </div>
        <div>
          <div class="text-caption text-grey">Land ownership proof</div>
          <div>{{ app.additionalQuestions.landOwnershipProof }}</div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Documents -->
    <v-card class="mb-4">
      <v-card-title>Documents</v-card-title>
      <v-card-text>
        <div v-for="doc in app.documents" :key="doc.name" class="d-flex align-center mb-2">
          <v-icon :color="doc.type === 'pdf' ? 'red' : doc.type === 'img' ? 'blue' : 'orange'" class="mr-2">
            {{ doc.type === 'pdf' ? 'mdi-file-pdf-box' : doc.type === 'img' ? 'mdi-file-image' : 'mdi-file-document' }}
          </v-icon>
          <span>{{ doc.name }}</span>
          <v-spacer />
          <v-btn icon size="small" variant="text"><v-icon>mdi-download</v-icon></v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Loan Details (if approved) -->
    <v-card v-if="app.loanDetails" class="mb-4">
      <v-card-title>Loan Details</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6" md="2"><div class="text-caption text-grey">Total Amount</div><div>${{ app.loanDetails.totalAmount.toLocaleString() }}</div></v-col>
          <v-col cols="6" md="2"><div class="text-caption text-grey">Interest Rate</div><div>{{ app.loanDetails.interestRate }}%</div></v-col>
          <v-col cols="6" md="2"><div class="text-caption text-grey">Installments</div><div>{{ app.loanDetails.installments }}</div></v-col>
          <v-col cols="6" md="2"><div class="text-caption text-grey">Grace Period</div><div>{{ app.loanDetails.gracePeriod }} months</div></v-col>
          <v-col cols="6" md="4"><div class="text-caption text-grey">First Disbursement</div><div>{{ app.loanDetails.firstDisbursement }}</div></v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Disbursement Schedule -->
    <v-card v-if="app.disbursementSchedule.length" class="mb-4">
      <v-card-title>Disbursement Schedule</v-card-title>
      <v-card-text>
        <v-data-table :headers="disbHeaders" :items="app.disbursementSchedule" :items-per-page="-1" density="compact">
          <template #item.amount="{ item }">{{ item.amount.toLocaleString() }}</template>
          <template #item.status="{ item }"><StatusChip :status="item.status" /></template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Repayment Schedule -->
    <v-card v-if="app.repaymentSchedule.length" class="mb-4">
      <v-card-title>Repayment Schedule</v-card-title>
      <v-card-text>
        <v-data-table :headers="repayHeaders" :items="app.repaymentSchedule" :items-per-page="-1" density="compact">
          <template #item.principal="{ item }">{{ item.principal.toFixed(2) }}</template>
          <template #item.interest="{ item }">{{ item.interest.toFixed(2) }}</template>
          <template #item.total="{ item }">{{ item.total.toFixed(2) }}</template>
          <template #item.status="{ item }"><StatusChip :status="item.status" /></template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Activity Log -->
    <v-card class="mb-4">
      <v-card-title>Activity Log</v-card-title>
      <v-card-text>
        <v-data-table :headers="logHeaders" :items="app.activityLog" :items-per-page="5" density="compact" />
      </v-card-text>
    </v-card>

    <!-- Request Additional Info Dialog -->
    <v-dialog v-model="requestInfoDialog" max-width="500">
      <v-card>
        <v-card-title>Request Additional Information</v-card-title>
        <v-card-text>
          <v-textarea v-model="dialogMessage" label="Message" variant="outlined" rows="4" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="requestInfoDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="handleRequestInfo">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reject Dialog -->
    <v-dialog v-model="rejectDialog" max-width="500">
      <v-card>
        <v-card-title>Reject Application</v-card-title>
        <v-card-text>
          <v-textarea v-model="dialogMessage" label="Reason for rejection" variant="outlined" rows="4" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="rejectDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="handleReject">Confirm Rejection</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else class="text-center py-12">
    <v-progress-circular indeterminate color="primary" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import StatusChip from '@/components/StatusChip.vue'
import { useLoanApplicationsStore } from '@/stores/loanApplications'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useTranslation } from '@/composables/useTranslation'

const route = useRoute()
const store = useLoanApplicationsStore()
const authStore = useAuthStore()
const appStore = useAppStore()
const { t } = useTranslation()

const app = computed(() => store.getApplicationById(route.params.id as string))

const requestInfoDialog = ref(false)
const rejectDialog = ref(false)
const dialogMessage = ref('')

const disbHeaders = [
  { title: '#', key: 'number' },
  { title: 'Amount', key: 'amount' },
  { title: 'Date', key: 'date' },
  { title: 'Transaction ID', key: 'transactionId' },
  { title: 'Status', key: 'status' },
]

const repayHeaders = [
  { title: '#', key: 'installment' },
  { title: 'Due Date', key: 'dueDate' },
  { title: 'Principal', key: 'principal' },
  { title: 'Interest', key: 'interest' },
  { title: 'Total', key: 'total' },
  { title: 'Transaction ID', key: 'transactionId' },
  { title: 'Status', key: 'status' },
]

const logHeaders = [
  { title: 'User', key: 'user' },
  { title: 'Action', key: 'action' },
  { title: 'Date/Time', key: 'dateTime' },
  { title: 'IP Address', key: 'ipAddress' },
]

onMounted(() => {
  if (store.applications.length === 0) store.loadApplications()
})

function handleSendToBank() {
  if (app.value) {
    store.updateApplicationStatus(app.value.id, 'Sent to Bank')
    appStore.showSnackbar('Application sent to bank')
  }
}

function handleApprove() {
  if (app.value) {
    store.updateApplicationStatus(app.value.id, 'Approved')
    appStore.showSnackbar('Approval process initiated')
  }
}

function handleReject() {
  if (app.value) {
    store.updateApplicationStatus(app.value.id, 'Rejected')
    rejectDialog.value = false
    dialogMessage.value = ''
    appStore.showSnackbar('Application rejected', 'error')
  }
}

function handleRequestInfo() {
  requestInfoDialog.value = false
  dialogMessage.value = ''
  appStore.showSnackbar('Additional information requested')
}
</script>
