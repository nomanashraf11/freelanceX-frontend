import { defineStore } from "pinia";
import type { Job, JobCreate } from "../types/job";
import { getAPI, postAPI } from "../utils/api";

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    jobs: [] as Job[],
    job: null as Job | null,
  }),
  actions: {
    async fetchJobs() {
      try {
        const response = await getAPI<Job[]>("/job");
        this.jobs = response.data;
      } catch (error) {
        this.jobs = [];
        throw error;
      }
    },
    async fetchJob(jobId: string) {
      try {
        const response = await getAPI<Job>(`/job/${jobId}`);
        this.job = response.data;
      } catch (error) {
        this.job = null;
        throw error;
      }
    },
    async createJob(job: JobCreate) {
      try {
        await postAPI("/job/client", job);
      } catch (error) {
        throw error;
      }
    },
    async refreshJobs() {
      this.jobs = []; // Clear current jobs to force refresh
      await this.fetchJobs(); // Call your existing fetch method
    },
  },
});
