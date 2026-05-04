import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { OrgType } from '@/types/auth'

declare module 'vue-router' {
  interface RouteMeta {
    allowedOrgTypes?: OrgType[]
    requiresAuth?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      meta: { requiresAuth: true },
      redirect: '/finance/dashboard',
      children: [
        {
          path: 'finance/dashboard',
          name: 'finance-dashboard',
          component: () => import('@/views/finance/FinanceDashboardView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue'),
        },
        // Dimitra routes
        {
          path: 'finance/banks',
          name: 'banks',
          component: () => import('@/views/finance/BanksView.vue'),
          meta: { allowedOrgTypes: ['Dimitra'] },
        },
        {
          path: 'finance/banks/create',
          name: 'bank-create',
          component: () => import('@/views/finance/BankCreateView.vue'),
          meta: { allowedOrgTypes: ['Dimitra'] },
        },
        {
          path: 'finance/banks/:id',
          name: 'bank-detail',
          component: () => import('@/views/finance/BankDetailView.vue'),
          meta: { allowedOrgTypes: ['Dimitra'] },
        },
        {
          path: 'finance/banks/:id/edit',
          name: 'bank-edit',
          component: () => import('@/views/finance/BankEditView.vue'),
          meta: { allowedOrgTypes: ['Dimitra'] },
        },
        {
          path: 'finance/cooperatives',
          name: 'cooperatives',
          component: () => import('@/views/finance/CooperativesView.vue'),
          meta: { allowedOrgTypes: ['Dimitra'] },
        },
        {
          path: 'finance/cooperatives/create',
          name: 'cooperative-create',
          component: () => import('@/views/finance/CooperativeCreateView.vue'),
          meta: { allowedOrgTypes: ['Dimitra'] },
        },
        {
          path: 'finance/cooperatives/:id/edit',
          name: 'cooperative-edit',
          component: () => import('@/views/finance/CooperativeEditView.vue'),
          meta: { allowedOrgTypes: ['Dimitra'] },
        },
        {
          path: 'finance/users',
          name: 'users',
          component: () => import('@/views/finance/UsersView.vue'),
          meta: { allowedOrgTypes: ['Dimitra'] },
        },
        {
          path: 'finance/users/create',
          name: 'user-create',
          component: () => import('@/views/finance/UserCreateView.vue'),
          meta: { allowedOrgTypes: ['Dimitra'] },
        },
        {
          path: 'finance/users/:id/edit',
          name: 'user-edit',
          component: () => import('@/views/finance/UserEditView.vue'),
          meta: { allowedOrgTypes: ['Dimitra'] },
        },
        // Cooperative & Bank routes
        {
          path: 'finance/loan-programs',
          name: 'loan-programs',
          component: () => import('@/views/finance/LoanProgramsView.vue'),
          meta: { allowedOrgTypes: ['Cooperative', 'Bank'] },
        },
        {
          path: 'finance/loan-programs/create',
          name: 'loan-program-create',
          component: () => import('@/views/finance/LoanProgramCreateView.vue'),
          meta: { allowedOrgTypes: ['Cooperative', 'Bank'] },
        },
        {
          path: 'finance/loan-programs/:id',
          name: 'loan-program-detail',
          component: () => import('@/views/finance/LoanProgramDetailView.vue'),
          meta: { allowedOrgTypes: ['Cooperative', 'Bank'] },
        },
        {
          path: 'finance/loan-programs/:id/edit',
          name: 'loan-program-edit',
          component: () => import('@/views/finance/LoanProgramEditView.vue'),
          meta: { allowedOrgTypes: ['Cooperative', 'Bank'] },
        },
        {
          path: 'finance/loan-applications',
          name: 'loan-applications',
          component: () => import('@/views/finance/LoanApplicationsView.vue'),
          meta: { allowedOrgTypes: ['Cooperative', 'Bank'] },
        },
        {
          path: 'finance/loan-applications/:id',
          name: 'loan-application-detail',
          component: () => import('@/views/finance/LoanApplicationDetailView.vue'),
          meta: { allowedOrgTypes: ['Cooperative', 'Bank'] },
        },
        // Farm routes
        {
          path: 'finance/my-farms',
          name: 'my-farms',
          component: () => import('@/views/finance/MyFarmsView.vue'),
          meta: { allowedOrgTypes: ['Farm'] },
        },
        {
          path: 'finance/my-farms/create',
          name: 'my-farm-create',
          component: () => import('@/views/finance/MyFarmCreateView.vue'),
          meta: { allowedOrgTypes: ['Farm'] },
        },
        {
          path: 'finance/my-farms/:id/edit',
          name: 'my-farm-edit',
          component: () => import('@/views/finance/MyFarmEditView.vue'),
          meta: { allowedOrgTypes: ['Farm'] },
        },
        {
          path: 'finance/available-loans',
          name: 'available-loans',
          component: () => import('@/views/finance/AvailableLoansView.vue'),
          meta: { allowedOrgTypes: ['Farm'] },
        },
        {
          path: 'finance/available-loans/:id',
          name: 'available-loan-detail',
          component: () => import('@/views/finance/AvailableLoanDetailView.vue'),
          meta: { allowedOrgTypes: ['Farm'] },
        },
        {
          path: 'finance/available-loans/:id/submit-application',
          name: 'submit-application',
          component: () => import('@/views/finance/ApplicationSubmissionFormView.vue'),
          meta: { allowedOrgTypes: ['Farm'] },
        },
        {
          path: 'finance/my-loans',
          name: 'my-loans',
          component: () => import('@/views/finance/MyLoansView.vue'),
          meta: { allowedOrgTypes: ['Farm'] },
        },
        {
          path: 'finance/my-loans/:id',
          name: 'my-loan-detail',
          component: () => import('@/views/finance/MyLoanDetailView.vue'),
          meta: { allowedOrgTypes: ['Farm'] },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth === false) {
    if (auth.isAuthenticated && to.name === 'login') {
      return '/finance/dashboard'
    }
    return true
  }

  if (to.name === 'not-found') {
    return true
  }

  if (!auth.isAuthenticated) {
    return '/login'
  }

  if (to.meta.allowedOrgTypes && auth.userRole) {
    if (!to.meta.allowedOrgTypes.includes(auth.userRole)) {
      return '/finance/dashboard'
    }
  }

  return true
})

export default router
