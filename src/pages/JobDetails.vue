<template>
  <default-layout>
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto space-y-8">
        <h1 class="text-3xl font-extrabold text-gray-900 text-center">
          Job Details
        </h1>

        <!-- Error Alert -->
        <div
          v-if="error"
          class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
          role="alert"
        >
          {{ error }}
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="flex justify-center">
          <svg
            class="animate-spin h-8 w-8 text-indigo-600"
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

        <!-- Job Details -->
        <div
          v-else-if="job"
          class="bg-white p-6 rounded-xl shadow-2xl transform transition-all hover:scale-105"
        >
          <h2 class="text-2xl font-bold text-gray-900">{{ job.title }}</h2>
          <div class="mt-4 space-y-3">
            <p>
              <strong class="text-gray-700">Description:</strong>
              {{ job.description }}
            </p>
            <p>
              <strong class="text-gray-700">Client:</strong>
              {{ `${job.client.firstName} ${job.client.lastName}` }}
            </p>
            <p>
              <strong class="text-gray-700">Budget:</strong> {{ job.budget }}$
            </p>
            <p>
              <strong class="text-gray-700">Created At:</strong>
              {{ formatDate(job.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Job Not Found -->
        <div
          v-else
          class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md"
          role="alert"
        >
          Job not found.
        </div>

        <!-- Place a Bid Section (Freelancer) -->
        <div
          v-if="userStore.user?.role === 'FREELANCER' && !myBid && !loading"
          class="mt-8"
        >
          <h2 class="text-2xl font-bold text-gray-900">Place a Bid</h2>
          <div
            v-if="bidError"
            class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mt-4"
            role="alert"
          >
            {{ bidError }}
          </div>
          <form
            @submit.prevent="placeBid"
            class="mt-4 space-y-4 bg-white p-6 rounded-xl shadow-md"
          >
            <div>
              <label
                for="bidAmount"
                class="block text-sm font-medium text-gray-700"
                >Bid Amount</label
              >
              <div class="relative mt-1">
                <span
                  class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"
                  >$</span
                >
                <input
                  id="bidAmount"
                  v-model.number="bidAmount"
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="100000"
                  class="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
                  placeholder="Enter your bid amount"
                />
              </div>
              <span
                v-if="
                  bidAmount &&
                  (!rules.positive(bidAmount) || !rules.minBid(bidAmount))
                "
                class="text-red-600 text-xs mt-1"
              >
                {{ rules.positive(bidAmount) || rules.minBid(bidAmount) }}
              </span>
            </div>
            <div>
              <label
                for="bidProposal"
                class="block text-sm font-medium text-gray-700"
                >Proposal</label
              >
              <textarea
                id="bidProposal"
                v-model="bidProposal"
                required
                rows="4"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
                placeholder="Describe your proposal..."
              ></textarea>
              <span
                v-if="bidProposal && !rules.maxProposalLength(bidProposal)"
                class="text-red-600 text-xs mt-1"
              >
                {{ rules.maxProposalLength(bidProposal) }}
              </span>
            </div>
            <button
              :disabled="!bidValid || bidLoading"
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
            >
              <span
                v-if="bidLoading"
                class="absolute left-0 inset-y-0 flex items-center pl-3"
              >
                <svg
                  class="animate-spin h-5 w-5 text-white"
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
              </span>
              Submit Bid
            </button>
          </form>
        </div>
        <div
          v-else-if="
            userStore.user?.role === 'FREELANCER' && !!myBid && !loading
          "
          class="mt-8"
        >
          <h2 class="text-2xl font-bold text-gray-900">Your Bid</h2>
          <div
            class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mt-4"
          >
            <p><strong>Your Bid Details:</strong></p>
            <p>
              <strong>Name:</strong>
              {{ `${myBid.freelancer.firstName} ${myBid.freelancer.lastName}` }}
            </p>
            <p><strong>Bid Amount:</strong> ${{ myBid.amount.toFixed(2) }}</p>
            <p><strong>Proposal:</strong> {{ myBid.proposal }}</p>
          </div>
        </div>

        <!-- Bids Section (Client) -->
        <div
          v-if="
            userStore.user?.role === 'CLIENT' &&
            job?.clientId === userStore.user?.userId &&
            !loading
          "
          class="mt-8"
        >
          <h2 class="text-2xl font-bold text-gray-900">Bids</h2>
          <div v-if="bidsLoading" class="flex justify-center mt-4">
            <svg
              class="animate-spin h-8 w-8 text-indigo-600"
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
          <div
            v-else-if="bidsStore.bids.length > 0"
            class="mt-4 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Freelancer
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Proposal
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created At
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="bid in bidsStore.bids"
                  :key="bid.bidId"
                  :class="{
                    'hover:bg-gray-50 transition duration-200': true,
                    'bg-green-50 border-l-4 border-green-500': !!bid.contract,
                  }"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{
                      `${bid.freelancer.firstName} ${bid.freelancer.lastName}`
                    }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${{ bid.amount.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ bid.proposal }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(bid.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      v-if="!hasContract"
                      @click="openContractModal(bid.bidId)"
                      class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
                    >
                      Create Contract
                    </button>
                    <span
                      v-else-if="!!bid.contract"
                      class="text-green-600 font-medium"
                      >Contracted</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-else
            class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mt-4"
            role="alert"
          >
            No bids for this job yet.
          </div>
        </div>

        <!-- Contract Modal -->
        <div
          v-if="contractDialog"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
          @click.self="contractDialog = false"
        >
          <div
            class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all"
          >
            <h2 class="text-xl font-bold text-gray-900 mb-4">
              Create Contract
            </h2>
            <div
              v-if="contractError"
              class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4"
              role="alert"
            >
              {{ contractError }}
            </div>
            <form @submit.prevent="createContract" class="space-y-4">
              <div>
                <label
                  for="contractTerms"
                  class="block text-sm font-medium text-gray-700"
                  >Contract Terms</label
                >
                <textarea
                  id="contractTerms"
                  v-model="contractTerms"
                  required
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
                  placeholder="Enter contract terms..."
                ></textarea>
                <span
                  v-if="
                    contractTerms &&
                    !contractRules.maxTermsLength(contractTerms)
                  "
                  class="text-red-600 text-xs mt-1"
                >
                  {{ contractRules.maxTermsLength(contractTerms) }}
                </span>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  :disabled="contractLoading"
                  @click="contractDialog = false"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="!contractValid || contractLoading"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                >
                  <span
                    v-if="contractLoading"
                    class="absolute left-0 inset-y-0 flex items-center pl-3"
                  >
                    <svg
                      class="animate-spin h-5 w-5 text-white"
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
                  </span>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Success Snackbar -->
        <div
          v-if="successSnackbar"
          class="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-md shadow-lg flex items-center"
          role="alert"
        >
          <svg
            class="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span>{{ successMessage }}</span>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useUserStore } from "../store/user";
import { useBidsStore } from "../store/bid";
import { useJobsStore } from "../store/job";
import { useContractsStore } from "../store/contract";
import type { Job } from "../types/job";
import type { Bid, BidCreate } from "../types/bid";
import type { ContractCreate } from "../types/contract";

const route = useRoute();
const userStore = useUserStore();
const bidsStore = useBidsStore();
const jobsStore = useJobsStore();
const contractsStore = useContractsStore();
const job = ref<Job | null>(null);
const loading = ref(false);
const bidsLoading = ref(false);
const bidLoading = ref(false);
const contractLoading = ref(false);
const error = ref<string | null>(null);
const bidError = ref<string | null>(null);
const contractError = ref<string | null>(null);
const bidAmount = ref<number>(0);
const bidProposal = ref<string>("");
const contractDialog = ref(false);
const contractTerms = ref<string>("");
const selectedBidId = ref<string>("");
const successSnackbar = ref(false);
const successMessage = ref<string>("");

const myBid = computed(() =>
  bidsStore.bids.find(
    (bid: Bid) =>
      bid.freelancerId === userStore.user?.userId &&
      bid.jobId === (route.params.id as string)
  )
);

const hasContract = computed(() => {
  const jobId = route.params.id as string;
  return bidsStore.bids.some((bid: Bid) => bid.jobId === jobId && bid.contract);
});

const rules = {
  required: (value: number | string) => !!value || "This field is required",
  positive: (value: number) => value > 0 || "Amount must be positive",
  minBid: (value: number) => value >= 0.1 || "Minimum bid is $0.10",
  maxProposalLength: (value: string) =>
    value.length <= 1000 || "Maximum 1000 characters",
};

const contractRules = {
  required: (value: string) => !!value || "This field is required",
  maxTermsLength: (value: string) =>
    value.length <= 1000 || "Maximum 1000 characters",
};

const bidValid = computed(() => {
  return (
    rules.required(bidAmount.value) === true &&
    rules.positive(bidAmount.value) === true &&
    rules.minBid(bidAmount.value) === true &&
    rules.required(bidProposal.value) === true &&
    rules.maxProposalLength(bidProposal.value) === true
  );
});

const contractValid = computed(() => {
  return (
    contractRules.required(contractTerms.value) === true &&
    contractRules.maxTermsLength(contractTerms.value) === true
  );
});

const formatDate = (date: Date | string | undefined) => {
  if (!date) {
    return new Date().toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
};

const openContractModal = (bidId: string) => {
  selectedBidId.value = bidId;
  contractTerms.value = "";
  contractError.value = null;
  contractDialog.value = true;
};

const createContract = async () => {
  if (!contractValid.value) return;
  if (!userStore.user?.userId || !job.value?.jobId) {
    contractError.value = "User or job not authenticated.";
    return;
  }
  contractLoading.value = true;
  contractError.value = null;
  try {
    const contractData: ContractCreate = {
      bidId: selectedBidId.value,
      jobId: job.value.jobId,
      terms: contractTerms.value,
    };
    await contractsStore.createContract(contractData);
    contractDialog.value = false;
    contractTerms.value = "";
    successMessage.value = "Contract created successfully!";
    successSnackbar.value = true;
    setTimeout(() => (successSnackbar.value = false), 3000);
  } catch (err) {
    contractError.value = "Failed to create contract. Please try again.";
    console.error("Failed to create contract:", err);
  } finally {
    contractLoading.value = false;
  }
};

onMounted(async () => {
  const jobId = route.params.id as string;
  loading.value = true;
  error.value = null;
  try {
    await jobsStore.fetchJob(jobId);
    job.value = jobsStore.job;

    if (job.value) {
      if (
        userStore.user?.role === "CLIENT" &&
        job.value.clientId === userStore.user?.userId
      ) {
        bidsLoading.value = true;
        try {
          await bidsStore.fetchBids(jobId);
        } catch (err) {
          error.value = "Failed to fetch bids.";
          console.error("Failed to fetch bids:", err);
        } finally {
          bidsLoading.value = false;
        }
      } else if (userStore.user?.role === "FREELANCER") {
        try {
          await bidsStore.fetchBidsByFreelancer(userStore.user?.userId);
        } catch (err) {
          console.error("Failed to fetch bids for freelancer:", err);
        }
      }
    }
  } catch (err) {
    error.value = "Failed to fetch job details.";
    console.error("Failed to fetch job:", err);
  } finally {
    loading.value = false;
  }
});

const placeBid = async () => {
  if (!bidValid.value) return;
  if (!userStore.user?.userId) {
    bidError.value = "User not authenticated.";
    return;
  }
  bidLoading.value = true;
  bidError.value = null;
  try {
    const bidData: BidCreate = {
      jobId: route.params.id as string,
      freelancerId: userStore.user.userId,
      amount: bidAmount.value,
      proposal: bidProposal.value,
    };

    await bidsStore.createBid(bidData);
    bidAmount.value = 0;
    bidProposal.value = "";
    successMessage.value = "Bid placed successfully!";
    successSnackbar.value = true;
    setTimeout(() => (successSnackbar.value = false), 3000);
  } catch (err) {
    bidError.value = "Failed to place bid. Please try again.";
    console.error("Failed to place bid:", err);
  } finally {
    bidLoading.value = false;
  }
};
</script>
