import { defineStore } from "pinia";
import type { Job, JobCreate, JobUpdate } from "../types/job";
import { deleteAPI, getAPI, postAPI, putAPI } from "../utils/api";

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    jobs: [] as Job[],
    job: null as Job | null,
    clientJobs: [] as Job[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchJobs() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getAPI<Job[]>("/job");
        this.jobs = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch jobs";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchJob(jobId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getAPI<Job>(`/job/${jobId}`);
        this.job = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch job";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchJobsByClient(clientId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getAPI<Job[]>(`/job/client/${clientId}`);
        this.clientJobs = response.data;
      } catch (err: any) {
        this.error =
          err.response?.data?.message || "Failed to fetch client jobs";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createJob(job: JobCreate) {
      this.loading = true;
      this.error = null;
      try {
        await postAPI("/job/client", job);
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to create job";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Add this new method for updating a job
    async updateJob(jobId: string, clientId: string, jobData: JobUpdate) {
      this.loading = true;
      this.error = null;
      try {
        const response = await putAPI<Job>(
          `/job/${jobId}/client/${clientId}`,
          jobData
        );
        // Update the job in clientJobs array if it exists
        const index = this.clientJobs.findIndex((j) => j.jobId === jobId);
        if (index !== -1) {
          this.clientJobs[index] = response.data;
        }
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to update job";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async deleteJob(jobId: string, clientId: string | undefined) {
      this.loading = true;
      this.error = null;
      try {
        await deleteAPI<Job>(`/job/${jobId}/client/${clientId}`);
        return "Job deleted successfully";
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to update job";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async refreshJobs() {
      this.jobs = [];
      await this.fetchJobs();
    },

    async refreshClientJobs(clientId: string) {
      this.clientJobs = [];
      await this.fetchJobsByClient(clientId);
    },
  },
});
