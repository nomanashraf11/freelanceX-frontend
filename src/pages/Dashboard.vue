<template>
  <default-layout>
    <v-container>
      <h1>Dashboard</h1>
      <v-alert v-if="error" type="error" dense class="mb-3">{{ error }}</v-alert>
      <v-btn
        v-if="userStore.user?.role === 'CLIENT'"
        color="primary"
        size="small"
        class="mb-4"
        @click="postJobDialog = true"
      >
        Post Job
      </v-btn>
      <v-progress-circular v-if="loading" indeterminate color="primary" class="mb-4" />
      <v-row v-else>
        <v-col v-for="job in jobsStore.jobs" :key="job.jobId" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>{{ job.title }}</v-card-title>
            <v-card-text>{{ job.description }}</v-card-text>
            <v-card-actions>
              <v-btn :to="`/job/${job.jobId}`" size="small">View Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="postJobDialog" max-width="450">
        <v-card>
          <v-card-title>Post a New Job</v-card-title>
          <v-card-text class="compact-form">
            <v-alert v-if="formError" type="error" dense class="mb-3">{{ formError }}</v-alert>
            <v-form ref="form" v-model="valid" dense @submit.prevent="submitJob">
              <v-text-field
                label="Job Title"
                v-model="newJob.title"
                :rules="[rules.required]"
                required
                dense
                class="mb-2"
              />
              <v-textarea
                label="Job Description"
                v-model="newJob.description"
                :rules="[rules.required, rules.maxLength]"
                required
                dense
                class="mb-2"
              />
              <v-text-field
                label="Budget"
                v-model.number="newJob.budget"
                type="number"
                :rules="[rules.required, rules.positiveNumber, rules.minBudget]"
                required
                dense
                class="mb-2"
                prefix="$"
              />
              <v-text-field
                label="Location"
                v-model="newJob.location"
                :rules="[rules.required, rules.maxLocationLength]"
                required
                dense
                class="mb-2"
              />
              <v-card-actions>
                <v-btn :disabled="formLoading" size="small" @click="postJobDialog = false">Cancel</v-btn>
                <v-btn
                  :disabled="!valid || formLoading"
                  color="primary"
                  type="submit"
                  size="small"
                  :loading="formLoading"
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="successSnackbar" color="success" :timeout="3000">
        Job posted successfully!
      </v-snackbar>
    </v-container>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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
const valid = ref(false);
const loading = ref(false);
const formLoading = ref(false);
const error = ref<string | null>(null);
const formError = ref<string | null>(null);
const successSnackbar = ref(false);
const form = ref();

const rules = {
  required: (value: string | number) => !!value || "This field is required",
  maxLength: (value: string) => value.length <= 1000 || "Maximum 1000 characters",
  positiveNumber: (value: number) => value > 0 || "Budget must be positive",
  minBudget: (value: number) => value >= 0.1 || "Minimum budget is $0.10",
  maxLocationLength: (value: string) => value.length <= 100 || "Maximum 100 characters",
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
      status: "OPEN"
    };
    await jobsStore.createJob(jobData);
    postJobDialog.value = false;
    newJob.value = { clientId: "", title: "", description: "", budget: 0, location: "" };
    form.value.resetValidation();
    successSnackbar.value = true;
  } catch (err) {
    formError.value = "Failed to post job. Please try again.";
    console.error("Failed to post job:", err);
  } finally {
    formLoading.value = false;
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
