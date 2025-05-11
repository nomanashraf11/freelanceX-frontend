<template>
  <default-layout>
    <v-container>
      <h1>Job Details</h1>
      <v-alert v-if="error" type="error" dense class="mb-3">{{ error }}</v-alert>
      <v-progress-circular v-if="loading" indeterminate color="primary" class="mb-4" />
      <v-card v-else-if="job">
        <v-card-title>{{ job.title }}</v-card-title>
        <v-card-text>
          <p><strong>Description:</strong> {{ job.description }}</p>
          <p><strong>Client ID:</strong> {{ job.clientId }}</p>
          <p><strong>Created At:</strong> {{ formatDate(job.createdAt) }}</p>
        </v-card-text>
      </v-card>
      <div v-else>
        <v-alert type="warning" dense class="mb-3">Job not found.</v-alert>
      </div>

      <div v-if="userStore.user?.role === 'FREELANCER' && !hasBid && !loading" class="mt-4">
        <h2>Place a Bid</h2>
        <v-alert v-if="bidError" type="error" dense class="mb-3">{{ bidError }}</v-alert>
        <v-form ref="bidForm" v-model="bidValid" dense @submit.prevent="placeBid" class="compact-form">
          <v-text-field
            label="Bid Amount"
            type="number"
            v-model.number="bidAmount"
            :rules="[rules.required, rules.positive, rules.minBid]"
            required
            dense
            class="mb-2"
            prefix="$"
          />
          <v-textarea
            label="Proposal"
            v-model="bidProposal"
            :rules="[rules.required, rules.maxProposalLength]"
            required
            dense
            class="mb-2"
          />
          <v-btn
            :disabled="!bidValid || bidLoading"
            color="primary"
            type="submit"
            :loading="bidLoading"
            size="small"
          >
            Submit Bid
          </v-btn>
        </v-form>
      </div>
      <div v-else-if="userStore.user?.role === 'FREELANCER' && hasBid && !loading" class="mt-4">
        <v-alert type="info" dense class="mb-3">You have already placed a bid on this job.</v-alert>
      </div>

      <div
        v-if="userStore.user?.role === 'CLIENT' && job?.clientId === userStore.user?.userId && !loading"
        class="mt-4"
      >
        <h2>Bids</h2>
        <v-progress-circular v-if="bidsLoading" indeterminate color="primary" class="mb-4" />
        <v-table v-else-if="bidsStore.bids.length > 0">
          <thead>
            <tr>
              <th>Freelancer ID</th>
              <th>Amount</th>
              <th>Proposal</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bid in bidsStore.bids" :key="bid.bidId">
              <td>{{ bid.freelancerId }}</td>
              <td>{{ bid.amount }}</td>
              <td>{{ bid.proposal }}</td>
              <td>{{ formatDate(bid.createdAt) }}</td>
            </tr>
          </tbody>
        </v-table>
        <v-alert v-else type="info" dense class="mb-3">No bids for this job yet.</v-alert>
      </div>

      <v-snackbar v-model="successSnackbar" color="success" :timeout="3000">
        Bid placed successfully!
      </v-snackbar>
    </v-container>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useUserStore } from "../store/user";
import { useBidsStore } from "../store/bid";
import { useJobsStore } from "../store/job";
import type { Job } from "../types/job";
import type { Bid, BidCreate } from "../types/bid";

const route = useRoute();
const userStore = useUserStore();
const bidsStore = useBidsStore();
const jobsStore = useJobsStore();
const job = ref<Job | null>(null);
const loading = ref(false);
const bidsLoading = ref(false);
const bidLoading = ref(false);
const error = ref<string | null>(null);
const bidError = ref<string | null>(null);
const bidForm = ref();
const bidValid = ref(false);
const bidAmount = ref<number>(0);
const bidProposal = ref<string>("");
const successSnackbar = ref(false);

const hasBid = computed(() => bidsStore.bids.some((bid: Bid) => bid.freelancerId === userStore.user?.userId));

const rules = {
  required: (value: number | string) => !!value || "This field is required",
  positive: (value: number) => value > 0 || "Amount must be positive",
  minBid: (value: number) => value >= 0.1 || "Minimum bid is $0.10",
  maxProposalLength: (value: string) => value.length <= 1000 || "Maximum 1000 characters",
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) {
    return new Date().toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
};

onMounted(async () => {
  const jobId = route.params.id as string;
  loading.value = true;
  error.value = null;
  try {
    await jobsStore.fetchJob(jobId);
    job.value = jobsStore.job;

    if (job.value && userStore.user?.role === "CLIENT" && job.value.clientId === userStore.user?.userId) {
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
      // Fetch bids to check if the freelancer has already bid
      try {
        await bidsStore.fetchBids(jobId);
      } catch (err) {
        console.error("Failed to fetch bids for freelancer:", err);
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
    bidForm.value.resetValidation();
    successSnackbar.value = true;
  } catch (err) {
    bidError.value = "Failed to place bid. Please try again.";
    console.error("Failed to place bid:", err);
  } finally {
    bidLoading.value = false;
  }
};
</script>

<style scoped>
.compact-form {
  padding: 16px !important;
}
.compact-form .v-text-field,
.compact-form .v-textarea {
  font-size: 0.9rem;
}
.compact-form .v-btn {
  font-size: 0.8rem;
}
</style>
