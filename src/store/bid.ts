import { defineStore } from "pinia";
import type { Bid, BidCreate } from "../types/bid";
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
    async fetchBidsByFreelancer(userId: string) {
      try {
        const response = await getAPI<Bid[]>(`/bid/freelancer/${userId}`);
        this.bids = response.data;
      } catch (error) {
        this.bids = [];
        throw error;
      }
    },
    async createBid(bid: BidCreate) {
      try {
        await postAPI("/bid/freelancer", bid);
      } catch (error) {
        throw error;
      }
    },
  },
});
