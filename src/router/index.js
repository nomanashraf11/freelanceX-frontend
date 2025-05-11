import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views//auth/LoginView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views//auth/RegisterView.vue"),
      meta: { requiresAuth: false },
    },
    // Protected routes
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/dashboard/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin",
      name: "admin-dashboard",
      component: () => import("../views/admin/AdminDashboard.vue"),
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/client",
      name: "client-dashboard",
      component: () => import("../views/client/ClientDashboard.vue"),
      meta: { requiresAuth: true, role: "CLIENT" },
    },
    {
      path: "/freelancer",
      name: "freelancer-dashboard",
      component: () => import("../views/freelancer/FreelancerDashboard.vue"),
      meta: { requiresAuth: true, role: "FREELANCER" },
    },
    // 404 catch-all
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFound.vue"),
    },
  ],
});

// Navigation guard for authentication and role checks
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check if route requires auth
  if (to.meta.requiresAuth) {
    if (authStore.isAuthenticated) {
      // Check role if specified
      if (to.meta.role && authStore.user.role !== to.meta.role) {
        // Redirect to appropriate dashboard based on role
        switch (authStore.user.role) {
          case "ADMIN":
            next({ name: "admin-dashboard" });
            break;
          case "CLIENT":
            next({ name: "client-dashboard" });
            break;
          case "FREELANCER":
            next({ name: "freelancer-dashboard" });
            break;
          default:
            next({ name: "login" });
        }
      } else {
        next();
      }
    } else {
      next({ name: "login" });
    }
  } else {
    next();
  }
});

export default router;
