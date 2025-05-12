import { defineStore } from "pinia";
import type { Bid, BidCreate } from "../types/bid";
import { deleteAPI, getAPI, postAPI } from "../utils/api";

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

    async fetchBidsByFreelancer(freelancerId: string) {
      try {
        const response = await getAPI<Bid[]>(`/bid/freelancer/${freelancerId}`);
        this.bids = response.data;
      } catch (error) {
        this.bids = [];
        throw error;
      }
    },
    async withdrawBid(bidId: string, freelancerId: string) {
      try {
        console.log(bidId, freelancerId);
        await deleteAPI(`/bid/${bidId}/freelancer/${freelancerId}`);
        // Remove the bid from local state
        this.bids = this.bids.filter((bid) => bid.bidId !== bidId);
        return true;
      } catch (error) {
        console.error("Failed to withdraw bid:", error);
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
