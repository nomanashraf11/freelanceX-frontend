<template>
  <default-layout>
    <v-container>
      <h1>Dashboard</h1>
      <v-btn v-if="userStore.user?.role === 'CLIENT'" color="primary" @click="postJobDialog = true">
        Post Job
      </v-btn>
      <v-row>
        <v-col v-for="job in jobsStore.jobs" :key="job.jobId" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>{{ job.title }}</v-card-title>
            <v-card-text>{{ job.description }}</v-card-text>
            <v-card-actions>
              <v-btn :to="`/job/${job.jobId}`">View Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="postJobDialog" max-width="500">
        <v-card>
          <v-card-title>Post a New Job</v-card-title>
          <v-card-text>
            <v-text-field label="Job Title" v-model="newJob.title" />
            <v-textarea label="Job Description" v-model="newJob.description" />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="postJobDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="submitJob">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useJobsStore } from "../store/job";
import { useUserStore } from "../store/user";

const jobsStore = useJobsStore();
const userStore = useUserStore();
const postJobDialog = ref(false);
const newJob = ref({ title: "", description: "" });

onMounted(async () => {
  try {
    await jobsStore.fetchJobs();
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
  }
});

const submitJob = async () => {
  try {
    await jobsStore.createJob(newJob.value.title, newJob.value.description);
    postJobDialog.value = false;
    newJob.value = { title: "", description: "" };
  } catch (error) {
    console.error("Failed to post job:", error);
  }
};
</script>
