<template>
  <transition name="modal">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            class="absolute inset-0 bg-gray-500 opacity-75"
            @click="closeModal"
          ></div>
        </div>

        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >

        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        >
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Leave a Review
            </h3>
            <div class="mt-2">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  v-model="reviewData.score"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="ONE">1 Star</option>
                  <option value="TWO">2 Stars</option>
                  <option value="THREE">3 Stars</option>
                  <option value="FOUR">4 Stars</option>
                  <option value="FIVE">5 Stars</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  v-model="reviewData.comment"
                  rows="3"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Share your experience..."
                ></textarea>
              </div>
            </div>
          </div>
          <div
            class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense"
          >
            <button
              type="button"
              @click="submitReview"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
            >
              {{ loading ? "Submitting..." : "Submit Review" }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue"; // Add ref to imports
import { useRatingStore } from "../store/rating";

export default defineComponent({
  name: "ReviewModal",
  props: {
    jobId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  emits: ["close", "review-submitted"],
  setup(props, { emit }) {
    const ratingStore = useRatingStore();

    const reviewData = reactive({
      jobId: props.jobId,
      userId: props.userId,
      score: "FIVE",
      comment: "",
    });

    const loading = ref(false); // Now properly imported

    const closeModal = () => {
      emit("close");
    };

    const submitReview = async () => {
      loading.value = true;
      try {
        await ratingStore.createRating(reviewData);
        emit("review-submitted"); // Notify parent of success
        closeModal(); // Close the modal
      } catch (err) {
        console.error("Failed to submit review:", err);
      } finally {
        loading.value = false;
      }
    };

    return {
      reviewData,
      loading,
      closeModal,
      submitReview,
    };
  },
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
