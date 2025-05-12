import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/Dashboard.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Profile from "../pages/Profile.vue";
import JobDetails from "../pages/JobDetails.vue";
import AdminUsers from "../pages/AdminUser.vue";
import FreelancerBids from "../pages/FreelancerBids.vue";
import Contracts from "../pages/Contracts.vue";
import { useUserStore } from "../store/user";
import ContractDetails from "../pages/ContractDetails.vue";
import Jobs from "../pages/Jobs.vue";

const routes = [
  { path: "/", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/job/:id", component: JobDetails, meta: { requiresAuth: true } },
  {
    path: "/admin/users",
    component: AdminUsers,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/bids",
    meta: { requiresAuth: true },
    component: FreelancerBids,
  },
  {
    path: "/contracts",
    meta: { requiresAuth: true },
    component: Contracts,
  },
  {
    path: "/jobs",
    meta: { requiresAuth: true },
    component: Jobs,
  },
  {
    path: "/contract/:id",
    meta: { requiresAuth: true },
    component: ContractDetails,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth) {
    try {
      if (!userStore.isAuthenticated && userStore.token) {
        await userStore.fetchUser();
      }

      if (!userStore.isAuthenticated) {
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        });
        return;
      }

      if (to.meta.requiresAdmin && userStore.user?.role !== "ADMIN") {
        next("/");
        return;
      }

      next();
    } catch (error) {
      console.error("Authentication check failed:", error);
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }
  } else {
    if (userStore.isAuthenticated && (to.path === "/login" || to.path === "/register")) {
      next("/");
      return;
    }
    next();
  }
});

export default router;
