/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  // Redirect to home if user is not authenticated.
  if (to.name !== '/' && !userStore.isAuthenticated) {
    return '/'
  }

  // Check client permissions.
  if (userStore.isAuthenticated) {
    // Redirect to home if user is not admin.
    if (to.name === '/gestaoclientes' && userStore.user.role !== 'ADMIN') {
      return '/'
    }
    // Redirect to dashboard if user is admin.
    if (to.name === '/editarperfil' && userStore.user.role === 'ADMIN') {
      return '/dashboard'
    }
  }
})

export default router
