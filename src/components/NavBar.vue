<template>
  <header class="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
    <nav
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
    >
      <!-- App Title / Dashboard Link -->
      <div class="flex">
        <button
          @click="goToDashboard"
          class="text-xl font-bold text-gray-900 hover:text-indigo-600 transition duration-300"
        >
          <img
            src="../assets/logo.svg"
            alt="FreelanceX Logo"
            class="h-[60px] w-auto"
          />
        </button>
      </div>
      <!-- Spacer -->
      <div class="flex-grow"></div>
      <!-- Notification and Profile Buttons -->
      <div class="flex items-center space-x-4">
        <!-- Notification Button -->
        <button
          @click="showNotifications = true"
          class="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
        >
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
        <!-- Profile Dropdown -->
        <div class="relative">
          <button
            @click="showMenu = !showMenu"
            class="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
          >
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
          <!-- Dropdown Menu -->
          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-4 z-50 transform transition-all duration-300 origin-top-right"
            :class="{
              'scale-95 opacity-0': !showMenu,
              'scale-100 opacity-100': showMenu,
            }"
            @click="showMenu = false"
          >
            <!-- Username Header -->
            <div
              class="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50"
            >
              <p class="text-sm font-semibold text-gray-900">
                {{ firstName || "User" }} {{ lastName || "" }}
              </p>
              <p class="text-xs text-gray-500 capitalize">
                {{ role || "N/A" }}
              </p>
            </div>
            <!-- Menu Items -->
            <div class="py-2">
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
              >
                Profile
              </router-link>
              <router-link
                v-if="role === 'ADMIN'"
                to="/admin/users"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
              >
                All Users
              </router-link>
              <router-link
                v-if="role === 'FREELANCER'"
                to="/bids"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
              >
                Bids
              </router-link>
              <router-link
                v-if="role === 'FREELANCER' || role === 'CLIENT'"
                to="/contracts"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
              >
                Contracts
              </router-link>
              <router-link
                v-if="role === 'CLIENT'"
                to="/jobs"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
              >
                Jobs
              </router-link>
            </div>
            <!-- Logout Button -->
            <div class="border-t border-gray-200 pt-2">
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <!-- Notification Overlay -->
    <notification-overlay v-model="showNotifications" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import NotificationOverlay from "./NotificationOverlay.vue";

const router = useRouter();
const userStore = useUserStore();
const showNotifications = ref(false);
const showMenu = ref(false);

// Local variables for user data
const firstName = computed(() => userStore.user?.profile?.firstName || "");
const lastName = computed(() => userStore.user?.profile?.lastName || "");
const role = computed(() => userStore.user?.role.toString() || "");

const goToDashboard = () => {
  showMenu.value = false;
  router.push("/");
};

const logout = async () => {
  try {
    await userStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>
