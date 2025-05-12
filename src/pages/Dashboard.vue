<template>
  <default-layout>
    <div
      class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-12 mt-16">
          <h1 class="text-4xl font-bold text-gray-900 tracking-tight">
            Jobs You Might Like
          </h1>
          <div v-if="userStore.user?.role === 'CLIENT'" class="flex space-x-4">
            <button
              @click="postJobDialog = true"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Post New Job
            </button>
          </div>
        </div>

        <!-- Error Alert -->
        <div
          v-if="error"
          class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 shadow-sm"
          role="alert"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="flex justify-center mb-8">
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

        <!-- Job Listings -->
        <div
          v-else
          class="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen"
        >
          <div class="max-w-7xl mx-auto">
            <div class="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              <!-- Bigger job cards -->
              <div
                v-for="job in jobsStore.jobs"
                :key="job.jobId"
                class="w-full flex flex-col bg-white rounded-xl border border-gray-200 hover:border-indigo-300 overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <!-- Job Header with expanded padding -->
                <div class="px-6 pt-6 pb-4 border-b border-gray-100">
                  <div class="flex justify-between items-start space-x-4">
                    <router-link
                      :to="`/job/${job.jobId}`"
                      class="text-xl font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2 leading-tight"
                    >
                      {{ job.title }}
                    </router-link>
                    <span
                      :class="[
                        job.status === 'OPEN'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : 'bg-red-50 text-red-700 border-red-100',
                        'px-3 py-1 rounded-full text-sm font-medium border flex-shrink-0',
                      ]"
                    >
                      {{ job.status }}
                    </span>
                  </div>
                </div>

                <!-- Expanded Job Content -->
                <div class="p-6 flex-grow space-y-5">
                  <!-- Budget section with larger text -->
                  <div class="flex items-center">
                    <span class="text-2xl font-bold text-gray-900">
                      ${{ job.budget.toFixed(2) }}
                    </span>
                    <span class="mx-3 text-gray-400 text-lg">•</span>
                    <span class="text-base text-gray-600">
                      {{ job.jobType || "Fixed-price" }}
                    </span>
                  </div>

                  <!-- Description with more lines -->
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-2">
                      Description:
                    </h3>
                    <p
                      class="text-base text-gray-700 line-clamp-4 leading-relaxed"
                    >
                      {{ job.description }}
                    </p>
                  </div>

                  <!-- Skills section with bigger tags -->
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-2">
                      Skills Required:
                    </h3>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="(skill, index) in job.skills"
                        :key="index"
                        class="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg"
                      >
                        {{ skill }}
                      </span>
                    </div>
                  </div>

                  <!-- Client Info with bigger avatar -->
                  <div class="flex items-center pt-5 border-t border-gray-100">
                    <div class="flex-shrink-0">
                      <div
                        class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-lg"
                      >
                        {{ job?.client?.firstName?.charAt(0) || "C" }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <p class="text-base font-medium text-gray-700">
                        {{
                          job?.client?.firstName +
                            " " +
                            job?.client?.lastName || "Client"
                        }}
                      </p>
                      <div class="flex items-center text-sm text-gray-500">
                        <svg
                          class="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{{ job.location }}</span>
                        <span class="mx-2">•</span>
                        <svg
                          class="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{{ formatDate(job.createdAt) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Bigger footer button -->
                <div class="px-6 pb-6">
                  <router-link
                    :to="`/job/${job.jobId}`"
                    class="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-md"
                  >
                    Apply Now
                    <svg
                      class="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Post Job Modal -->
        <div
          v-if="postJobDialog"
          class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
          @click.self="postJobDialog = false"
        >
          <div
            class="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl transform transition-all scale-100"
          >
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Post a New Job
            </h2>
            <div
              v-if="formError"
              class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6"
              role="alert"
            >
              {{ formError }}
            </div>
            <form @submit.prevent="submitJob" class="space-y-6">
              <div>
                <label
                  for="title"
                  class="block text-sm font-medium text-gray-700"
                  >Job Title</label
                >
                <input
                  id="title"
                  v-model="newJob.title"
                  required
                  type="text"
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                  placeholder="Enter job title"
                />
                <span
                  v-if="newJob.title && !rules.required(newJob.title)"
                  class="text-red-600 text-xs mt-1"
                >
                  {{ rules.required(newJob.title) }}
                </span>
              </div>
              <div>
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700"
                  >Job Description</label
                >
                <textarea
                  id="description"
                  v-model="newJob.description"
                  required
                  rows="5"
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                  placeholder="Describe the job..."
                ></textarea>
                <span
                  v-if="
                    newJob.description && !rules.maxLength(newJob.description)
                  "
                  class="text-red-600 text-xs mt-1"
                >
                  {{ rules.maxLength(newJob.description) }}
                </span>
              </div>
              <div class="relative">
                <label
                  for="budget"
                  class="block text-sm font-medium text-gray-700"
                  >Budget</label
                >
                <span class="absolute left-4 top-10 text-gray-400">$</span>
                <input
                  id="budget"
                  v-model.number="newJob.budget"
                  required
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                  placeholder="0.00"
                />
                <span
                  v-if="
                    newJob.budget &&
                    (!rules.positiveNumber(newJob.budget) ||
                      !rules.minBudget(newJob.budget))
                  "
                  class="text-red-600 text-xs mt-1"
                >
                  {{
                    rules.positiveNumber(newJob.budget) ||
                    rules.minBudget(newJob.budget)
                  }}
                </span>
              </div>
              <div>
                <label
                  for="location"
                  class="block text-sm font-medium text-gray-700"
                  >Location</label
                >
                <input
                  id="location"
                  v-model="newJob.location"
                  required
                  type="text"
                  class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                  placeholder="Enter location"
                />
                <span
                  v-if="
                    newJob.location && !rules.maxLocationLength(newJob.location)
                  "
                  class="text-red-600 text-xs mt-1"
                >
                  {{ rules.maxLocationLength(newJob.location) }}
                </span>
              </div>
              <div class="flex justify-end space-x-4">
                <button
                  type="button"
                  :disabled="formLoading"
                  @click="postJobDialog = false"
                  class="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="!valid || formLoading"
                  class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
                >
                  <span
                    v-if="formLoading"
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Success Snackbar -->
        <div
          v-if="successSnackbar"
          class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3 z-50 animate-slide-in"
          role="alert"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span class="text-sm font-medium">Job posted successfully!</span>
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
  maxLength: (value: string) =>
    value.length <= 1000 || "Maximum 1000 characters",
  positiveNumber: (value: number) => value > 0 || "Budget must be positive",
  minBudget: (value: number) => value >= 0.1 || "Minimum budget is $0.10",
  maxLocationLength: (value: string) =>
    value.length <= 100 || "Maximum 100 characters",
};

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

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
    newJob.value = {
      clientId: "",
      title: "",
      description: "",
      budget: 0,
      location: "",
    };
    successSnackbar.value = true;
    setTimeout(() => (successSnackbar.value = false), 3000);
    await jobsStore.refreshJobs(); // Add this line to refresh jobs
  } catch (err) {
    formError.value = "Failed to post job. Please try again.";
    console.error("Failed to post job:", err);
  } finally {
    formLoading.value = false;
  }
};
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
