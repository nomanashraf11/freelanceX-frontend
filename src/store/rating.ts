import { defineStore } from "pinia";
import axios from "axios";
import type { Rating, CreateReview } from "../types/rating";

export const useRatingStore = defineStore("reviews", {
  state: () => ({
    rating: [] as Rating[] | [],
    loading: false,
    error: null,
  }),
  actions: {
    async createReview(reviewData: CreateReview) {
      this.loading = true;
      this.error = null;
      try {
        await axios.post("/rating", reviewData);
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to create review";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchReviewsByUserId(userId: string) {
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

    async fetchReviewsByJobId(jobId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Rating[]>(`/rating/job/${jobId}`);
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
