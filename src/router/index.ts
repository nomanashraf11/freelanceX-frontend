import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Profile from '../pages/Profile.vue'
import JobDetails from '../pages/JobDetails.vue'

const routes = [
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/job/:id', component: JobDetails, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const response = get
      if (response.status === 401) {
        next('/login')
      } else {
        next()
      }
    } catch {
      next('/login')
    }
  } else {
    next()
  }
})

export default router