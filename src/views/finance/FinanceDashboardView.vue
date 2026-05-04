<template>
  <div>
    <PageHeader :title="t('dashboard.title')" :breadcrumb="t('navigation.dashboard')" />

    <!-- Loan Applications Chart -->
    <v-card class="mb-4 chart-card" rounded="xl" elevation="0">
      <v-card-text class="pa-6">
        <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
          <div class="text-h6 font-weight-bold text-grey-darken-3">
            {{ t('dashboard.loanApplications') }}
          </div>
          <div class="chart-filter-group">
            <button
              type="button"
              class="chart-filter-btn"
              :class="{ active: timeTab === 'month' }"
              @click="timeTab = 'month'"
            >
              {{ t('dashboard.month') }}
            </button>
            <button
              type="button"
              class="chart-filter-btn"
              :class="{ active: timeTab === 'quarter' }"
              @click="timeTab = 'quarter'"
            >
              {{ t('dashboard.quarter') }}
            </button>
            <button
              type="button"
              class="chart-filter-btn"
              :class="{ active: timeTab === 'year' }"
              @click="timeTab = 'year'"
            >
              {{ t('dashboard.year') }}
            </button>
          </div>
        </div>
        <apexchart
          :key="`bar-${timeTab}`"
          type="bar"
          height="320"
          :options="barChartOptions"
          :series="barChartSeries"
        />
      </v-card-text>
    </v-card>

    <!-- Processing Time & Applications by Region -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-card class="chart-card dashboard-subcard" rounded="xl" elevation="0" height="100%">
          <v-card-text class="pa-6">
            <div class="dashboard-subcard__header">
              <div class="dashboard-subcard__title">
                <span>{{ t('dashboard.averageProcessingTime') }}</span>
                <v-icon size="18" color="success">mdi-information-outline</v-icon>
              </div>
              <div class="dashboard-subcard__toolbar dashboard-subcard__toolbar--left">
                <button type="button" class="toolbar-text-btn">
                  {{ t('dashboard.year') }}
                </button>
                <button type="button" class="toolbar-pill-btn toolbar-pill-btn--active">
                  {{ t('dashboard.month') }}
                </button>
                <button type="button" class="toolbar-icon-btn" aria-label="Filter chart">
                  <v-icon size="18">mdi-filter-variant</v-icon>
                </button>
              </div>
            </div>
            <apexchart
              :key="`line-${timeTab}`"
              type="bar"
              height="260"
              :options="processingChartOptions"
              :series="processingChartSeries"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="chart-card dashboard-subcard" rounded="xl" elevation="0" height="100%">
          <v-card-text class="pa-6">
            <div class="dashboard-subcard__header dashboard-subcard__header--wide">
              <div class="dashboard-subcard__title">
                <span>{{ t('dashboard.applicationsPerRegion') }}</span>
                <v-icon size="16" color="success">mdi-information-outline</v-icon>
              </div>
              <div class="dashboard-subcard__toolbar">
                <button type="button" class="toolbar-text-btn">Today</button>
                <button type="button" class="toolbar-text-btn">Week</button>
                <button type="button" class="toolbar-pill-btn toolbar-pill-btn--active">
                  {{ t('dashboard.month') }}
                </button>
                <button type="button" class="toolbar-text-btn">
                  {{ t('dashboard.year') }}
                </button>
                <button type="button" class="toolbar-text-btn">All</button>
                <button type="button" class="toolbar-icon-btn" aria-label="Open calendar">
                  <v-icon size="18">mdi-calendar-blank-outline</v-icon>
                </button>
                <button type="button" class="toolbar-icon-btn" aria-label="Filter chart">
                  <v-icon size="18">mdi-filter-variant</v-icon>
                </button>
              </div>
            </div>
            <apexchart
              :key="`region-${timeTab}`"
              type="bar"
              height="260"
              :options="regionChartOptions"
              :series="regionChartSeries"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stat Cards -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h2 font-weight-bold">{{ dashStore.data.stats.avgProcessingTime.value }} {{ dashStore.data.stats.avgProcessingTime.unit }}</div>
              <div class="text-body-2 text-grey">{{ t('dashboard.avgProcessingTimeThisMonth') }}</div>
            </div>
            <div class="text-right">
              <v-icon size="40" color="warning">mdi-clock-outline</v-icon>
              <div :class="trendClass(dashStore.data.stats.avgProcessingTime.trend)" class="text-caption mt-1">
                <v-icon size="14">{{ dashStore.data.stats.avgProcessingTime.trend > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
                {{ Math.abs(dashStore.data.stats.avgProcessingTime.trend) }} %
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h2 font-weight-bold">{{ dashStore.data.stats.totalApplications.value }}</div>
              <div class="text-body-2 text-grey">{{ t('dashboard.totalApplicationsThisMonth') }}</div>
            </div>
            <div class="text-right">
              <v-icon size="40" color="info">mdi-file-document-outline</v-icon>
              <div :class="trendClass(dashStore.data.stats.totalApplications.trend, true)" class="text-caption mt-1">
                <v-icon size="14">{{ dashStore.data.stats.totalApplications.trend > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
                {{ Math.abs(dashStore.data.stats.totalApplications.trend) }} %
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h2 font-weight-bold">{{ dashStore.data.stats.approvalPercentage.value }}{{ dashStore.data.stats.approvalPercentage.unit }}</div>
              <div class="text-body-2 text-grey">{{ t('dashboard.approvalPercentage') }}</div>
            </div>
            <div class="text-right">
              <v-icon size="40" color="success">mdi-check-circle-outline</v-icon>
              <div :class="trendClass(dashStore.data.stats.approvalPercentage.trend, true)" class="text-caption mt-1">
                <v-icon size="14">{{ dashStore.data.stats.approvalPercentage.trend > 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
                {{ Math.abs(dashStore.data.stats.approvalPercentage.trend) }} %
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useTranslation } from '@/composables/useTranslation'
import { useAuthStore } from '@/stores/auth'

const dashStore = useDashboardStore()
const authStore = useAuthStore()
const { t } = useTranslation()
const timeTab = ref<'month' | 'quarter' | 'year'>('month')

const localeMap: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
}

watch(timeTab, (val) => {
  dashStore.setTimeFilter(val)
})

onMounted(() => {
  dashStore.loadDashboard()
})

function formatMonthCategories(months: string[], format: 'long' | 'short'): string[] {
  if (timeTab.value !== 'month') return months

  const locale = localeMap[authStore.language] || 'en-US'
  return months.map((_, index) =>
    new Intl.DateTimeFormat(locale, { month: format }).format(new Date(2026, index, 1))
  )
}

const loanApplicationCategories = computed(() =>
  formatMonthCategories(dashStore.data.loanApplicationsChart.months, 'long')
)

const processingCategories = computed(() =>
  formatMonthCategories(dashStore.data.processingTimeChart.months, 'short')
)

const barChartSeries = computed(() => [
  { name: t('dashboard.applicationsApproved'), data: dashStore.data.loanApplicationsChart.approved, color: '#4CAF50' },
  { name: t('dashboard.pendingApplications'), data: dashStore.data.loanApplicationsChart.pending, color: '#FB8C00' },
  { name: t('dashboard.waitingSignatures'), data: dashStore.data.loanApplicationsChart.waiting, color: '#FF9800' },
  { name: t('dashboard.rejectedApplications'), data: dashStore.data.loanApplicationsChart.rejected, color: '#FF5252' },
])

const barChartOptions = computed(() => ({
  chart: {
    type: 'bar' as const,
    stacked: false,
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '44%',
      borderRadius: 3,
      borderRadiusApplication: 'end',
    },
  },
  xaxis: {
    categories: loanApplicationCategories.value,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      rotate: -45,
      rotateAlways: true,
      trim: false,
      style: {
        colors: '#6B7280',
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    min: 0,
    max: 50,
    tickAmount: 5,
    title: {
      text: t('dashboard.noOfApplications'),
      style: {
        color: '#4B5563',
        fontSize: '13px',
        fontWeight: 700,
      },
    },
    labels: {
      style: {
        colors: '#6B7280',
        fontSize: '12px',
      },
    },
  },
  grid: {
    borderColor: '#E5E7EB',
    strokeDashArray: 0,
    padding: {
      left: 8,
      right: 8,
    },
  },
  stroke: {
    show: false,
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  colors: ['#3FA56B', '#F5A623', '#FF7A45', '#FF5A54'],
  tooltip: {
    shared: true,
    intersect: false,
  },
}))

const processingChartSeries = computed(() => [
  { name: t('dashboard.processingTimePerMonth'), data: dashStore.data.processingTimeChart.days, color: '#3FA56B' },
])

const processingChartOptions = computed(() => ({
  chart: {
    type: 'bar' as const,
    toolbar: { show: false },
    fontFamily: 'inherit',
    parentHeightOffset: 0,
  },
  colors: ['#3FA56B'],
  plotOptions: {
    bar: {
      columnWidth: '50%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
    },
  },
  grid: {
    borderColor: '#E8ECEF',
    strokeDashArray: 0,
    padding: {
      left: 4,
      right: 12,
      top: 8,
    },
  },
  xaxis: {
    categories: processingCategories.value,
    axisBorder: {
      show: true,
      color: '#DEE3E8',
    },
    axisTicks: {
      show: false,
    },
    title: {
      text: t('dashboard.processingTimePerMonth'),
      style: {
        color: '#6B7280',
        fontSize: '13px',
        fontWeight: 700,
      },
    },
    labels: {
      style: {
        colors: '#6B7280',
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    min: 0,
    max: 40,
    tickAmount: 4,
    title: {
      text: t('dashboard.days'),
      style: {
        color: '#4B5563',
        fontSize: '13px',
        fontWeight: 700,
      },
    },
    labels: {
      style: {
        colors: '#6B7280',
        fontSize: '12px',
      },
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { show: false },
  tooltip: {
    y: {
      formatter: (value: number) => `${value} ${t('dashboard.days').toLowerCase()}`,
    },
  },
}))

const regionChartSeries = computed(() => [
  { name: t('dashboard.numberOfApplications'), data: dashStore.data.applicationsByRegion.counts, color: '#3FA56B' },
])

const regionChartOptions = computed(() => ({
  chart: {
    type: 'bar' as const,
    toolbar: { show: false },
    fontFamily: 'inherit',
    parentHeightOffset: 0,
  },
  colors: ['#3FA56B'],
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '52%',
      borderRadius: 4,
      borderRadiusApplication: 'end',
    },
  },
  grid: {
    borderColor: '#E8ECEF',
    strokeDashArray: 0,
    padding: {
      left: 8,
      right: 18,
      top: 10,
    },
  },
  xaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    title: {
      text: t('dashboard.numberOfApplications'),
      style: {
        color: '#4B5563',
        fontSize: '13px',
        fontWeight: 700,
      },
    },
    axisBorder: {
      show: true,
      color: '#DEE3E8',
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: '#6B7280',
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    categories: dashStore.data.applicationsByRegion.regions,
    labels: {
      style: {
        colors: '#374151',
        fontSize: '13px',
      },
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { show: false },
  tooltip: {
    x: { show: false },
  },
}))

function trendClass(trend: number, positiveIsGood: boolean = false): string {
  if (positiveIsGood) {
    return trend > 0 ? 'text-success' : 'text-error'
  }
  return trend > 0 ? 'text-error' : 'text-success'
}
</script>

<style scoped>
.chart-card {
  border: 1px solid #eef1f4;
  background: #ffffff;
}

.chart-filter-group {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem;
  border-radius: 999px;
  background: #f7f8fa;
}

.chart-filter-btn {
  border: 0;
  background: transparent;
  color: #374151;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  font-size: 0.95rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.chart-filter-btn.active {
  background: #dceee5;
  color: #1f7a4d;
  font-weight: 700;
}

.dashboard-subcard {
  border: 1px solid #eef1f4;
  background: #ffffff;
}

.dashboard-subcard__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.dashboard-subcard__header--wide {
  align-items: center;
}

.dashboard-subcard__title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #202124;
  font-size: 1rem;
  font-weight: 700;
}

.dashboard-subcard__toolbar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.dashboard-subcard__toolbar--left {
  justify-content: flex-start;
}

.toolbar-text-btn,
.toolbar-pill-btn,
.toolbar-icon-btn {
  border: 0;
  background: transparent;
  color: #2f343b;
  font-size: 0.82rem;
  line-height: 1;
  cursor: default;
}

.toolbar-text-btn,
.toolbar-pill-btn {
  padding: 0.65rem 0.35rem;
}

.toolbar-pill-btn {
  padding-inline: 0.9rem;
  border-radius: 999px;
}

.toolbar-pill-btn--active {
  background: #dceee5;
  color: #2d9b5f;
  font-weight: 700;
}

.toolbar-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: #2f343b;
}

@media (max-width: 960px) {
  .dashboard-subcard__header,
  .dashboard-subcard__header--wide {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-subcard__toolbar {
    justify-content: flex-start;
  }
}
</style>
