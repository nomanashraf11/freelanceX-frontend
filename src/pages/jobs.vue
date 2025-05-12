<template>
  <default-layout>
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">My Jobs</h1>
          <p class="mt-2 text-lg text-gray-600">
            Manage your posted jobs and track their progress
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <svg
            class="animate-spin h-8 w-8 text-indigo-600 mx-auto"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="mt-2 text-gray-600">Loading jobs...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600">{{ error }}</p>
          <button
            @click="fetchJobs"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>

        <!-- Jobs Content -->
        <div v-else>
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
                v-model="searchQuery"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search jobs..."
              />
            </div>
            <div class="flex space-x-3">
              <select
                v-model="statusFilter"
                class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
              >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
              <button
                class="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sort
              </button>
            </div>
          </div>

          <!-- Jobs List -->
          <div
            v-if="filteredJobs.length"
            class="bg-white shadow-lg rounded-xl overflow-hidden"
          >
            <ul class="space-y-6 p-6">
              <li
                v-for="job in filteredJobs"
                :key="job.jobId"
                class="p-6 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md"
              >
                <div class="flex flex-col space-y-4">
                  <!-- Header Row -->
                  <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <!-- Status and Title -->
                    <div class="flex items-start space-x-4">
                      <div class="flex-shrink-0">
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold leading-4"
                          :class="{
                            'bg-green-100 text-green-800':
                              job.status === 'OPEN',
                            'bg-gray-100 text-red-800':
                              job.status === 'CLOSED',
                          }"
                        >
                          {{ job.status }}
                        </span>
                      </div>
                      <div>
                        <h2 class="text-lg font-semibold text-gray-900">
                          {{ job.title }}
                        </h2>
                        <p class="text-sm text-gray-500 mt-1">
                          Posted {{ formatDate(job.createdAt) }}
                        </p>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex space-x-3">
                      <button
                        v-if="job.status === 'OPEN'"
                        @click="openUpdateModal(job)"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                      >
                        Update
                      </button>
                      <router-link
                        :to="`/job/${job.jobId}`"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                      >
                        View Details
                        <svg
                          class="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </router-link>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Job Update Modal -->
          <div
            v-if="updateModalOpen"
            class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
            @click.self="updateModalOpen = false"
          >
            <div
              class="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl transform transition-all scale-100"
            >
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Update Job</h2>
              <div
                v-if="updateError"
                class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6"
                role="alert"
              >
                {{ updateError }}
              </div>
              <form @submit.prevent="submitUpdate" class="space-y-6">
                <div>
                  <label
                    for="updateTitle"
                    class="block text-sm font-medium text-gray-700"
                    >Job Title</label
                  >
                  <input
                    id="updateTitle"
                    v-model="updatedJob.title"
                    required
                    type="text"
                    class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                    placeholder="Enter job title"
                  />
                </div>
                <div>
                  <label
                    for="updateDescription"
                    class="block text-sm font-medium text-gray-700"
                    >Job Description</label
                  >
                  <textarea
                    id="updateDescription"
                    v-model="updatedJob.description"
                    required
                    rows="5"
                    class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                    placeholder="Describe the job..."
                  ></textarea>
                </div>
                <div class="relative">
                  <label
                    for="updateBudget"
                    class="block text-sm font-medium text-gray-700"
                    >Budget</label
                  >
                  <span class="absolute left-4 top-10 text-gray-400">$</span>
                  <input
                    id="updateBudget"
                    v-model.number="updatedJob.budget"
                    required
                    type="number"
                    step="0.01"
                    class="mt-1 block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                    placeholder="Enter budget"
                  />
                </div>
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from "vue";
import { useJobsStore } from "../store/job";
import { useUserStore } from "../store/user";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import type { JobUpdate } from "../types/job";

export default defineComponent({
  name: "Jobs",
  components: { DefaultLayout },
  setup() {
    const jobsStore = useJobsStore();
    const userStore = useUserStore();

    const searchQuery = ref("");
    const statusFilter = ref("");
    const updateModalOpen = ref(false);
    const updating = ref(false);
    const updateError = ref<string | null>(null);
    const selectedJob = ref<any>(null);
    const updatedJob = ref<JobUpdate>({
      title: "",
      description: "",
      budget: 0,
      location: "",
      status: "OPEN",
    });

    const fetchJobs = async () => {
      if (!userStore.user?.userId) return;

      try {
        await jobsStore.fetchJobsByClient(userStore.user.userId);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    const filteredJobs = computed(() => {
      let jobs = jobsStore.clientJobs;

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        jobs = jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(query) ||
            job.jobId.toLowerCase().includes(query)
        );
      }

      if (statusFilter.value) {
        jobs = jobs.filter((job) => job.status === statusFilter.value);
      }

      return jobs;
    });

    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const openUpdateModal = (job: any) => {
      selectedJob.value = job;
      updatedJob.value = {
        title: job.title,
        description: job.description,
        budget: job.budget,
        location: job.location,
        status: job.status,
      };
      updateModalOpen.value = true;
      updateError.value = null;
    };

    const submitUpdate = async () => {
      if (!selectedJob.value || !userStore.user?.userId) return;

      updating.value = true;
      updateError.value = null;

      try {
        await jobsStore.updateJob(
          selectedJob.value.jobId,
          userStore.user.userId,
          updatedJob.value
        );
        updateModalOpen.value = false;
        await fetchJobs(); // Refresh the jobs list
      } catch (err: any) {
        updateError.value =
          err.response?.data?.message || "Failed to update job";
        console.error("Failed to update job:", err);
      } finally {
        updating.value = false;
      }
    };

    onMounted(() => {
      fetchJobs();
    });

    return {
      jobs: jobsStore.clientJobs,
      filteredJobs,
      loading: computed(() => jobsStore.loading),
      error: computed(() => jobsStore.error),
      formatDate,
      searchQuery,
      statusFilter,
      fetchJobs,
      updateModalOpen,
      updating,
      updateError,
      updatedJob,
      openUpdateModal,
      submitUpdate,
    };
  },
});
</script>
