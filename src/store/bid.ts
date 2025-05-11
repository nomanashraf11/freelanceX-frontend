import { defineStore } from "pinia";
import type { Bid } from "../types/bid";
import { getAPI, postAPI } from "../utils/api";

export const useBidsStore = defineStore("bids", {
  state: () => ({
    bids: [] as Bid[],
  }),
  actions: {
    async fetchBids(jobId: string) {
      try {
        const response = await getAPI<Bid[]>(`/bid/client/job/${jobId}`);
        this.bids = response.data;
      } catch (error) {
        this.bids = [];
        throw error;
      }
    },
    async createBid(jobId: string, amount: number) {
      try {
        await postAPI("/bid/freelancer", { jobId, amount });
      } catch (error) {
        throw error;
      }
    },
  },
});
