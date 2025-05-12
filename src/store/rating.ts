import { defineStore } from "pinia";
import type { Rating, CreateReview } from "../types/rating";
import { getAPI, postAPI } from "../utils/api";

export const useRatingStore = defineStore("reviews", {
  state: () => ({
    ratings: [] as Rating[] | [],
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
        const response = await getAPI<Rating[]>(`/rating/user/${userId}`);
        this.ratings = response.data;
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
        this.ratings = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch reviews";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
