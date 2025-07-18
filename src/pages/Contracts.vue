<template>
  <default-layout>
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">My Contracts</h1>
          <p class="mt-2 text-lg text-gray-600">Manage your active contracts and review past work</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <svg
            class="animate-spin h-8 w-8 text-indigo-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="mt-2 text-gray-600">Loading contracts...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600">{{ error }}</p>
          <button
            @click="fetchContracts"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>

        <!-- Contracts Content -->
        <div v-else>
          <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="relative w-full sm:w-64">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search contracts..."
              />
            </div>
            <div class="flex space-x-3">
              <select
                v-model="statusFilter"
                class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ENDED">Ended</option>
              </select>
              <button
                class="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sort
              </button>
            </div>
          </div>

          <!-- Contracts List -->
          <div v-if="filteredContracts.length" class="bg-white shadow-lg rounded-xl overflow-hidden">
            <ul class="space-y-6 p-6">
              <li
                v-for="contract in filteredContracts"
                :key="contract.contractId"
                class="p-6 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md"
              >
                <div class="flex flex-col space-y-4">
                  <!-- Header Row -->
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <!-- Status and Title -->
                    <div class="flex items-start space-x-4">
                      <div class="flex-shrink-0">
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold leading-4"
                          :class="{
                            'bg-green-100 text-green-800': contract.status === 'ACTIVE',
                            'bg-blue-100 text-blue-800': contract.status === 'COMPLETED',
                          }"
                        >
                          {{ contract.status }}
                        </span>
                      </div>
                      <div>
                        <h2 class="text-lg font-semibold text-gray-900">
                          {{ contract.job.title }}
                        </h2>
                        <p class="text-sm text-gray-500 mt-1">Started {{ formatDate(contract.createdAt) }}</p>
                      </div>
                    </div>

                    <!-- Action Button -->
                    <router-link
                      :to="`/contract/${contract.contractId}`"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                      View Details
                      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </router-link>
                  </div>

                  <!-- Divider -->
                  <div class="border-t border-gray-100"></div>

                  <!-- Financial Info -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contract Value
                      </h3>
                      <p class="text-2xl font-bold text-indigo-600">${{ contract.bid.amount.toFixed(2) }}</p>
                      <p class="text-sm text-gray-500">
                        <span class="font-medium">Job Budget:</span> ${{ contract.job.budget.toFixed(2) }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider">Terms</h3>
                      <p class="text-sm text-gray-700">
                        {{ contract.terms || "Standard contract terms apply" }}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div v-else class="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No contracts found</h3>
            <p class="mt-1 text-sm text-gray-500">You don't have any active contracts at this time.</p>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-600">No contracts found.</p>
          </div>

          <!-- Pagination -->
          <div
            v-if="filteredContracts.length"
            class="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200"
          >
            <div class="flex-1 flex justify-between sm:hidden">
              <a
                href="#"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </a>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing <span class="font-medium">1</span> to
                  <span class="font-medium">{{ Math.min(10, filteredContracts.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredContracts.length }}</span>
                  contracts
                </p>
              </div>
              <div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Previous</span>
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </a>
                  <a
                    href="#"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span class="sr-only">Next</span>
                    <svg
                      class="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import { useContractsStore } from "../store/contract";
import { useUserStore } from "../store/user";
import DefaultLayout from "../layouts/DefaultLayout.vue";

export default defineComponent({
  name: "Contracts",
  components: { DefaultLayout },
  setup() {
    const contractsStore = useContractsStore();
    const userStore = useUserStore();

    const searchQuery = ref("");
    const statusFilter = ref("");

    const userRole = computed(() => userStore.user?.role || "");
    const userId = computed(() => userStore.user?.userId || "");

    const fetchContracts = async () => {
      if (!userId.value || !userRole.value) return;

      try {
        if (userRole.value === "CLIENT") {
          await contractsStore.fetchContractByClient(userId.value);
        } else if (userRole.value === "FREELANCER") {
          await contractsStore.fetchContractByFreelancer(userId.value);
        }
      } catch (err) {
        console.error("Failed to fetch contracts:", err);
      }
    };

    const filteredContracts = computed(() => {
      let contracts = contractsStore.contracts;

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        contracts = contracts.filter(
          (contract) =>
            contract.job.title.toLowerCase().includes(query) ||
            contract.contractId.toLowerCase().includes(query)
        );
      }

      if (statusFilter.value) {
        contracts = contracts.filter((contract) => contract.status === statusFilter.value);
      }

      return contracts;
    });

    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    onMounted(() => {
      fetchContracts();
    });

    return {
      contracts: contractsStore.contracts,
      filteredContracts,
      loading: computed(() => contractsStore.loading),
      error: computed(() => contractsStore.error),
      userRole,
      formatDate,
      searchQuery,
      statusFilter,
      fetchContracts,
    };
  },
});
</script>
