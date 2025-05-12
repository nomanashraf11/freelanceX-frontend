<template>
  <default-layout>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
            <p class="mt-2 text-sm text-gray-600">
              Manage all registered users in the system
            </p>
          </div>
        </div>

        <!-- Status Messages -->
        <div
          v-if="error"
          class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <div
          v-if="successMessage"
          class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <svg
            class="animate-spin h-10 w-10 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
            ></path>
          </svg>
        </div>

        <!-- Users Table -->
        <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="user in usersStore.users"
                  :key="user.userId"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center"
                      >
                        <span class="text-indigo-600 font-medium">
                          {{ user.profile.firstName?.charAt(0) || ""
                          }}{{ user.profile.lastName?.charAt(0) || "" }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.profile.firstName || "N/A" }}
                          {{ user.profile.lastName || "" }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ user.userId }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-purple-100 text-purple-800': user.role === 'ADMIN',
                        'bg-blue-100 text-blue-800': user.role === 'CLIENT',
                        'bg-green-100 text-green-800':
                          user.role === 'FREELANCER',
                      }"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': !user.disabled,
                        'bg-red-100 text-red-800': user.disabled,
                      }"
                    >
                      {{ !user.disabled ? "Active" : "Disabled" }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="toggleUserStatus(user)"
                      :disabled="processingUser === user.userId"
                      class="mr-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md focus:outline-none transition"
                      :class="{
                        'bg-red-100 text-red-700 hover:bg-red-200':
                          !user.disabled,
                        'bg-green-100 text-green-700 hover:bg-green-200':
                          user.disabled,
                        'opacity-50 cursor-not-allowed':
                          processingUser === user.userId,
                      }"
                    >
                      <svg
                        v-if="processingUser === user.userId"
                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                        ></path>
                      </svg>
                      {{ !user.disabled ? "Disable" : "Enable" }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useUserStore } from "../store/user";

const usersStore = useUserStore();
const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const processingUser = ref<string | null>(null);

onMounted(async () => {
  await fetchUsers();
});

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    await usersStore.fetchUsers();
  } catch (err) {
    error.value = "Failed to fetch users. Please try again.";
    console.error("Failed to fetch users:", err);
  } finally {
    loading.value = false;
  }
};

const toggleUserStatus = async (user: any) => {
  processingUser.value = user.userId;
  error.value = null;
  successMessage.value = null;

  try {
    await usersStore.updateUserStatus(user.userId);
    successMessage.value = `User ${
      user.disabled ? "enabled" : "disabled"
    } successfully`;
    await fetchUsers();
    setTimeout(() => (successMessage.value = null), 3000);
  } catch (err) {
    error.value = `Failed to ${
      !user.disabled ? "disable" : "enable"
    } user. Please try again.`;
    console.error("Failed to update user status:", err);
  } finally {
    processingUser.value = null;
  }
};
</script>
