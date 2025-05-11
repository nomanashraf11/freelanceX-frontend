<template>
  <default-layout>
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-6">Dashboard</h1>
        <div
          v-if="error"
          class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6"
          role="alert"
        >
          {{ error }}
        </div>
        <div v-if="userStore.user?.role === 'CLIENT'" class="mb-6">
          <button
            @click="postJobDialog = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
          >
            Post Job
          </button>
        </div>
        <div v-if="loading" class="flex justify-center mb-6">
          <svg
            class="animate-spin h-8 w-8 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
          </svg>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
            v-for="job in jobsStore.jobs"
            :key="job.jobId"
            class="bg-white rounded-xl shadow-lg transform transition-all hover:scale-105"
          >
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ job.title }}</h2>
              <p class="text-sm text-gray-600 line-clamp-3">{{ job.description }}</p>
            </div>
            <div class="px-6 pb-6">
              <router-link
                :to="`/job/${job.jobId}`"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
              >
                View Details
              </router-link>
            </div>
          </div>
        </div>
        <!-- Modal for Posting a Job -->
        <div
          v-if="postJobDialog"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
          @click.self="postJobDialog = false"
        >
          <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Post a New Job</h2>
            <div
              v-if="formError"
              class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4"
              role="alert"
            >
              {{ formError }}
            </div>
            <form @submit.prevent="submitJob" class="space-y-4">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  id="title"
                  v-model="newJob.title"
                  required
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
                  placeholder="Enter job title"
                />
                <span v-if="newJob.title && !rules.required(newJob.title)" class="text-red-600 text-xs mt-1">
                  {{ rules.required(newJob.title) }}
                </span>
              </div>
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700"
                  >Job Description</label
                >
                <textarea
                  id="description"
                  v-model="newJob.description"
                  required
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
                  placeholder="Describe the job..."
                ></textarea>
                <span
                  v-if="newJob.description && !rules.maxLength(newJob.description)"
                  class="text-red-600 text-xs mt-1"
                >
                  {{ rules.maxLength(newJob.description) }}
                </span>
              </div>
              <div class="relative">
                <label for="budget" class="block text-sm font-medium text-gray-700">Budget</label>
                <span class="absolute left-3 top-9 text-gray-400">$</span>
                <input
                  id="budget"
                  v-model.number="newJob.budget"
                  required
                  type="number"
                  class="mt-1 block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
                  placeholder="0.00"
                />
                <span
                  v-if="
                    newJob.budget && (!rules.positiveNumber(newJob.budget) || !rules.minBudget(newJob.budget))
                  "
                  class="text-red-600 text-xs mt-1"
                >
                  {{ rules.positiveNumber(newJob.budget) || rules.minBudget(newJob.budget) }}
                </span>
              </div>
              <div>
                <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
                <input
                  id="location"
                  v-model="newJob.location"
                  required
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
                  placeholder="Enter location"
                />
                <span
                  v-if="newJob.location && !rules.maxLocationLength(newJob.location)"
                  class="text-red-600 text-xs mt-1"
                >
                  {{ rules.maxLocationLength(newJob.location) }}
                </span>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  :disabled="formLoading"
                  @click="postJobDialog = false"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="!valid || formLoading"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                >
                  <span v-if="formLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <!-- Success Snackbar -->
        <div
          v-if="successSnackbar"
          class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 z-50"
          role="alert"
        >
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Job posted successfully!</span>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useJobsStore } from "../store/job";
import { useUserStore } from "../store/user";
import type { JobCreate } from "../types/job";

interface NewJob {
  clientId: string;
  title: string;
  description: string;
  budget: number;
  location: string;
}

const jobsStore = useJobsStore();
const userStore = useUserStore();

const postJobDialog = ref(false);
const newJob = ref<NewJob>({
  clientId: "",
  title: "",
  description: "",
  budget: 0,
  location: "",
});
const loading = ref(false);
const formLoading = ref(false);
const error = ref<string | null>(null);
const formError = ref<string | null>(null);
const successSnackbar = ref(false);

const rules = {
  required: (value: string | number) => !!value || "This field is required",
  maxLength: (value: string) => value.length <= 1000 || "Maximum 1000 characters",
  positiveNumber: (value: number) => value > 0 || "Budget must be positive",
  minBudget: (value: number) => value >= 0.1 || "Minimum budget is $0.10",
  maxLocationLength: (value: string) => value.length <= 100 || "Maximum 100 characters",
};

// Compute form validity based on all required fields
const valid = computed(() => {
  return (
    rules.required(newJob.value.title) === true &&
    rules.required(newJob.value.description) === true &&
    rules.maxLength(newJob.value.description) === true &&
    rules.required(newJob.value.budget) === true &&
    rules.positiveNumber(newJob.value.budget) === true &&
    rules.minBudget(newJob.value.budget) === true &&
    rules.required(newJob.value.location) === true &&
    rules.maxLocationLength(newJob.value.location) === true
  );
});

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    await jobsStore.fetchJobs();
  } catch (err) {
    error.value = "Failed to fetch jobs. Please try again.";
    console.error("Failed to fetch jobs:", err);
  } finally {
    loading.value = false;
  }
});

const submitJob = async () => {
  if (!valid.value) return;
  if (!userStore.user?.userId) {
    formError.value = "User not authenticated.";
    return;
  }
  formLoading.value = true;
  formError.value = null;
  try {
    const jobData: JobCreate = {
      clientId: userStore.user.userId,
      title: newJob.value.title,
      description: newJob.value.description,
      budget: newJob.value.budget,
      location: newJob.value.location,
      status: "OPEN",
    };
    await jobsStore.createJob(jobData);
    postJobDialog.value = false;
    newJob.value = { clientId: "", title: "", description: "", budget: 0, location: "" };
    successSnackbar.value = true;
    setTimeout(() => (successSnackbar.value = false), 3000);
  } catch (err) {
    formError.value = "Failed to post job. Please try again.";
    console.error("Failed to post job:", err);
  } finally {
    formLoading.value = false;
  }
};
</script>
