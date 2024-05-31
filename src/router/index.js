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
})

export default router
