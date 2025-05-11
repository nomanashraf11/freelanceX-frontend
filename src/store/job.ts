import { defineStore } from "pinia";
import type { Job } from "../types/job";
import { getAPI, postAPI } from "../utils/api";

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    jobs: [] as Job[],
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
    async createJob(title: string, description: string) {
      try {
        await postAPI("/job/client", { title, description });
      } catch (error) {
        throw error;
      }
    },
  },
});
