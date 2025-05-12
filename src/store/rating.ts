import { defineStore } from "pinia";
import axios from "axios";
import type { Rating, CreateReview } from "../types/rating";
import { getAPI, postAPI } from "../utils/api";

export const useRatingStore = defineStore("reviews", {
  state: () => ({
    rating: [] as Rating[] | [],
    loading: false,
    error: null,
  }),
  actions: {
    async createRating(reviewData: CreateReview) {
      this.loading = true;
      this.error = null;
      try {
        await postAPI("/rating", reviewData);
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to create review";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchRatingsByUserId(userId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Rating[]>(`/rating/user/${userId}`);
        this.rating = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch reviews";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchRatingsByJobId(jobId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await getAPI<Rating[]>(`/rating/job/${jobId}`);
        this.rating = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch reviews";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
