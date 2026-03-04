// ...existing code...
import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { authGuard } from '@auth0/auth0-vue'
import { useAuth } from '../utils/useAuth'

// Views
import Login from '../views/Login.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import CompanyDashboard from '../views/CompanyDashboard.vue'
import CompanyEditView from '../views/CompanyEditView.vue'

import Callback from '../views/Callback.vue'
import Onboarding from '../views/Onboarding.vue'

const routes = [
  {
    path: '/company/chat',
    name: 'AgentChatSelect',
    component: () => import('../views/AgentChatView.vue'),
    meta: { requiresAuth: true, role: 'company_admin' }
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'saas_owner' }
  },
  {
    path: '/companies/new',
    name: 'NewCompany',
    component: CompanyEditView,
    meta: { requiresAuth: true, role: 'saas_owner' }
  },
  {
    path: '/companies/:id/edit',
    name: 'EditCompany',
    component: CompanyEditView,
    meta: { requiresAuth: true, role: 'saas_owner' }
  },
  {
    path: '/company',
    name: 'CompanyDashboard',
    component: CompanyDashboard,
    meta: { requiresAuth: true, role: 'company_admin' }
  },
  {
    path: '/company/:agentName',
    name: 'AgentChatView',
    component: () => import('../views/AgentChatView.vue'),
    meta: { requiresAuth: true, role: 'company_admin' }
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: Onboarding,
    meta: { requiresAuth: true, role: 'new_user' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Custom navigation guard that combines Auth0 guard with Role checking
router.beforeEach(async (to, from, next) => {
  // 1. Check if route requires auth
  if (to.meta.requiresAuth) {
    // We need to use the authGuard from SDK to ensure user is loaded
    // But authGuard is a route guard function itself.
    // A simpler approach is to check our composable, but we need to wait for loading.
    
    const { isAuthenticated, isLoading, hasRole, login, userRole } = useAuth()
    
    // Helper to wait for Auth0 validation to complete
    const waitForAuth = () => {
      return new Promise((resolve) => {
        if (!isLoading.value) return resolve()
        
        const unwatch = watch(isLoading, (val) => {
          if (!val) {
            unwatch()
            resolve()
          }
        })
      })
    }

    // Wait for the auth state to be determined
    await waitForAuth()
    
    // Now that we are sure loading is done, check auth
    if (!isAuthenticated.value) {
      // Pass the current path as targetState so we can return after login
      login({ appState: { targetUrl: to.fullPath } })
      return // Login will redirect
    }
    
    // 2. Check Role
    if (to.meta.role) {
      // We need to wait for user to be populated to check role
      // The authGuard ensures isAuthenticated is true, so user should be there
      console.log('Router Guard Check:', {
        path: to.path,
        requiredRole: to.meta.role,
        actualRole: userRole.value
      })
      
      // If user is new_user, ALWAYS redirect to onboarding (unless they are already going there)
      if (userRole.value === 'new_user' && to.path !== '/onboarding') {
          return next('/onboarding')
      }

      // If user tries to go to onboarding but is NOT a new_user, redirect to their dashboard
      if (to.path === '/onboarding' && userRole.value !== 'new_user') {
          if (userRole.value === 'saas_owner') return next('/admin')
          if (userRole.value === 'company_admin') return next('/company')
      }
      
      if (!hasRole(to.meta.role)) {
        // Sin rol = new_user; redirigir según el rol actual
        const role = userRole.value || 'new_user'
        if (role === 'saas_owner') return next('/admin')
        if (role === 'company_admin') return next('/company')
        return next('/onboarding')
      }
    }
  }
  
  next()
})

export default router
