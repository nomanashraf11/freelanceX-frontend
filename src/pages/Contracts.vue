<template>
  <default-layout>
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">My Contracts</h1>
          <p class="mt-2 text-lg text-gray-600">
            Manage your active contracts and review past work
          </p>
        </div>

        <div
          class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div class="relative w-full sm:w-64">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search contracts..."
            />
          </div>
          <div class="flex space-x-3">
            <select
              class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Ended</option>
            </select>
            <button
              class="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sort
            </button>
          </div>
        </div>

        <!-- Contracts List -->
        <div class="bg-white shadow overflow-hidden rounded-xl">
          <ul class="divide-y divide-gray-200">
            <li v-for="contract in contracts" :key="contract.contractId">
              <div class="px-6 py-5 sm:px-6">
                <div
                  class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                >
                  <!-- Contract Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center">
                      <span
                        class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium"
                        :class="{
                          'bg-green-100 text-green-800':
                            contract.status === 'ACTIVE',
                          'bg-blue-100 text-blue-800':
                            contract.status === 'COMPLETED',
                          'bg-gray-100 text-gray-800':
                            contract.status === 'ENDED',
                        }"
                      >
                        {{ contract.status }}
                      </span>
                      <span class="ml-2 text-sm text-gray-500">
                        Started {{ formatDate(contract.createdAt) }}
                      </span>
                    </div>
                    <h2
                      class="mt-2 text-xl font-semibold text-gray-900 truncate"
                    >
                      {{ contract.job.title }}
                    </h2>
                    <p class="mt-1 text-gray-500">
                      Contract amount:
                      <span class="font-medium text-gray-900"
                        >${{ contract.bid.amount.toFixed(2) }}</span
                      >
                    </p>
                  </div>

                  <!-- Contract Actions -->
                  <div
                    class="mt-4 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3"
                  >
                    <router-link
                      :to="`/contracts/${contract.contractId}`"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                    </router-link>
                    <button
                      v-if="contract.status === 'ACTIVE'"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Submit Work
                    </button>
                  </div>
                </div>

                <!-- Additional Contract Details (collapsible) -->
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">Client</h3>
                      <p class="mt-1 text-sm text-gray-900">
                        {{ contract.job.clientId | truncateId }}
                      </p>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">
                        Job Budget
                      </h3>
                      <p class="mt-1 text-sm text-gray-900">
                        ${{ contract.job.budget.toFixed(2) }}
                      </p>
                    </div>
                    <div>
                      <h3 class="text-sm font-medium text-gray-500">
                        Contract Terms
                      </h3>
                      <p class="mt-1 text-sm text-gray-900 line-clamp-2">
                        {{ contract.terms || "Standard contract terms apply" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- Pagination -->
          <div
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
            <div
              class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p class="text-sm text-gray-700">
                  Showing <span class="font-medium">1</span> to
                  <span class="font-medium">10</span> of
                  <span class="font-medium">20</span> contracts
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
import { defineComponent, onMounted } from "vue";
import { useContractsStore } from "../store/contract";
import { useUserStore } from "../store/user";
import DefaultLayout from "../layouts/DefaultLayout.vue";
export default defineComponent({
  name: "FreelancerContracts",
  setup() {
    const contractsStore = useContractsStore();
    const authStore = useUserStore();

    const fetchContracts = async () => {
      try {
        await contractsStore.findContractByFreelancer(authStore?.user?.userId);
      } catch (err) {
        console.error(err); // already handled in store
      }
    };

    const formatDate = (dateString: string) => {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const openWorkSubmission = (contractId: string) => {
      console.log("Submit work for contract:", contractId);
    };

    onMounted(() => {
      fetchContracts();
    });

    return {
      contracts: contractsStore.contracts,
      loading: contractsStore.loading,
      error: contractsStore.error,
      formatDate,
      openWorkSubmission,
    };
  },
});
</script>
