<template>
  <default-layout>
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Page Header -->
        <div class="mb-8">
          <router-link
            to="/contracts"
            class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Back to Contracts
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900">Contract Details</h1>
          <p class="mt-2 text-lg text-gray-600">View and manage contract information</p>
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
          <p class="mt-2 text-gray-600">Loading contract details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600">{{ error }}</p>
          <button
            @click="fetchContractDetails"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>

        <!-- Contract Details Content -->
        <div v-else class="space-y-6">
          <!-- Contract Details Section -->
          <div class="bg-white shadow overflow-hidden rounded-xl">
            <div class="px-6 py-8 sm:px-8">
              <!-- Contract Header -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <span
                    class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium"
                    :class="{
                      'bg-green-100 text-green-800': contract?.status === 'ACTIVE',
                      'bg-blue-100 text-blue-800': contract?.status === 'COMPLETED',
                    }"
                  >
                    {{ contract?.status }}
                  </span>
                  <h2 class="mt-2 text-2xl font-semibold text-gray-900">{{ contract?.job.title }}</h2>
                  <p class="mt-1 text-sm text-gray-500">Contract ID: {{ contract?.contractId }}</p>
                </div>
              </div>

              <!-- Contract and Job Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Contract Details -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Contract Details</h3>
                  <dl class="mt-4 space-y-4">
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Contract Amount</dt>
                      <dd class="mt-1 text-sm text-gray-900">${{ contract?.bid.amount.toFixed(2) }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Start Date</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ formatDate(contract?.createdAt) }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Contract Terms</dt>
                      <dd class="mt-1 text-sm text-gray-900">
                        {{ contract?.terms || 'Standard contract terms apply' }}
                      </dd>
                    </div>
                  </dl>
                </div>

                <!-- Job Details -->
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Job Details</h3>
                  <dl class="mt-4 space-y-4">
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Job Title</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ contract?.job.title }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Job Budget</dt>
                      <dd class="mt-1 text-sm text-gray-900">${{ contract?.job.budget.toFixed(2) }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Job Status</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ contract?.job.status }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment and Escrow Section -->
          <div class="bg-white shadow overflow-hidden rounded-xl">
            <div class="px-6 py-8 sm:px-8">
              <h3 class="text-lg font-medium text-gray-900">Payment & Escrow</h3>
              <dl class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Payment ID</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ payment?.paymentId || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Escrow Amount</dt>
                    <dd class="mt-1 text-sm text-gray-900">${{ payment?.amount.toFixed(2) || 'N/A' }}</dd>
                  </div>
                </div>
                <div class="space-y-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Escrow Status</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-green-100 text-green-800': payment?.escrow.status === 'RELEASED',
                          'bg-yellow-100 text-yellow-800': payment?.escrow.status === 'HELD',
                          'bg-gray-100 text-gray-800': !payment?.escrow.status,
                        }"
                      >
                        {{ payment?.escrow.status || 'N/A' }}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Escrow Created</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {{ payment?.escrow.createdAt ? formatDate(payment.escrow.createdAt) : 'N/A' }}
                    </dd>
                  </div>
                </div>
              </dl>
              <div v-if="userRole === 'CLIENT' && payment?.escrow.status === 'HELD'" class="mt-6">
                <button
                  @click="releasePayment"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  :disabled="releasing"
                >
                  {{ releasing ? 'Releasing...' : 'Release Escrow Payment' }}
                </button>
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
import { useRoute } from "vue-router";
import { useContractsStore } from "../store/contract";
import { usePaymentStore } from "../store/payment";
import { useUserStore } from "../store/user";
import DefaultLayout from "../layouts/DefaultLayout.vue";

export default defineComponent({
  name: "ContractDetails",
  components: { DefaultLayout },
  setup() {
    const route = useRoute();
    const contractsStore = useContractsStore();
    const paymentStore = usePaymentStore();
    const userStore = useUserStore();

    const contractId = computed(() => route.params.id as string);
    const userRole = computed(() => userStore.user?.role || "");
    const userId = computed(() => userStore.user?.userId || "");
    const releasing = ref(false);

    const contract = computed(() => contractsStore.contract);
    const payment = computed(() => paymentStore.payments);
    const loading = computed(() => contractsStore.loading || paymentStore.loading);
    const error = computed(() => contractsStore.error || paymentStore.error);

    const fetchContractDetails = async () => {
      if (!userId.value || !userRole.value || !contractId.value) return;

      try {
        if (userRole.value === "CLIENT") {
          await contractsStore.fetchClientContractById(userId.value, contractId.value);
        } else if (userRole.value === "FREELANCER") {
          await contractsStore.fetchFreelancerContractById(userId.value, contractId.value);
        }
        await paymentStore.fetchPaymentByContract(contractId.value);
      } catch (err) {
        console.error("Failed to fetch contract details:", err);
      }
    };

    const releasePayment = async () => {
      if (!payment.value?.paymentId) return;

      releasing.value = true;
      try {
        await paymentStore.releasePayment(payment.value.paymentId);
        await paymentStore.fetchPaymentByContract(contractId.value); // Refresh payment status
      } catch (err) {
        console.error("Failed to release payment:", err);
      } finally {
        releasing.value = false;
      }
    };

    const formatDate = (dateString: string | undefined) => {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      if (!dateString) {
        return new Date().toLocaleDateString(undefined, options);
      }
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    onMounted(() => {
      fetchContractDetails();
    });

    return {
      contract,
      payment,
      loading,
      error,
      userRole,
      releasing,
      formatDate,
      fetchContractDetails,
      releasePayment,
    };
  },
});
</script>