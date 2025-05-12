<template>
  <transition name="modal">
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeModal"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- Modal Content -->
        <div
          class="inline-block align-bottom bg-white rounded-2xl px-6 pt-6 pb-5 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-8"
        >
          <div>
            <h3 class="text-xl leading-6 font-semibold text-gray-900 mb-6">Leave a Review</h3>
            <div class="mt-2 space-y-6">
              <!-- Custom Rating Select -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> Rating </label>
                <div class="relative">
                  <button
                    @click="showRatingDropdown = !showRatingDropdown"
                    class="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    :class="{ 'ring-2 ring-indigo-500': showRatingDropdown }"
                    aria-haspopup="listbox"
                  >
                    <span class="flex items-center">
                      <span class="text-yellow-400 mr-2">{{ displayStars(reviewData.score) }}</span>
                      {{ ratingLabels[reviewData.score] }}
                    </span>
                    <svg
                      class="h-5 w-5 text-gray-400"
                      :class="{ 'rotate-180': showRatingDropdown }"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <!-- Dropdown Options -->
                  <transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <div
                      v-if="showRatingDropdown"
                      class="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
                      role="listbox"
                    >
                      <button
                        v-for="(label, score) in ratingLabels"
                        :key="score"
                        @click="selectRating(score)"
                        class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
                        :class="{ 'bg-indigo-50 text-indigo-600': reviewData.score === score }"
                        role="option"
                        :aria-selected="reviewData.score === score"
                      >
                        <span class="text-yellow-400 mr-2">{{ displayStars(score) }}</span>
                        {{ label }}
                      </button>
                    </div>
                  </transition>
                </div>
              </div>
              <!-- Comment Textarea -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> Comment </label>
                <textarea
                  v-model="reviewData.comment"
                  rows="4"
                  class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="Share your experience..."
                  :class="{ 'border-red-500': commentError }"
                ></textarea>
                <p v-if="commentError" class="mt-1 text-xs text-red-600">
                  Comment must be at least 5 characters long
                </p>
              </div>
            </div>
          </div>
          <!-- Buttons -->
          <div class="mt-6 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              @click="submitReview"
              :disabled="loading || commentError"
              class="w-full inline-flex items-center justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ loading ? "Submitting..." : "Submit Review" }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm transition duration-200"
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
import { defineComponent, reactive, ref, computed } from "vue";
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

    const loading = ref(false);
    const showRatingDropdown = ref(false);

    // Rating labels for display
    const ratingLabels = {
      ONE: "1 Star",
      TWO: "2 Stars",
      THREE: "3 Stars",
      FOUR: "4 Stars",
      FIVE: "5 Stars",
    };

    // Display stars based on score
    const displayStars = (score: string) => {
      const starCount =
        {
          ONE: 1,
          TWO: 2,
          THREE: 3,
          FOUR: 4,
          FIVE: 5,
        }[score] || 0;
      return "★".repeat(starCount) + "☆".repeat(5 - starCount);
    };

    // Form validation for comment
    const commentError = computed(() => {
      return reviewData.comment.length > 0 && reviewData.comment.length < 5;
    });

    // Select rating and close dropdown
    const selectRating = (score: string) => {
      reviewData.score = score;
      showRatingDropdown.value = false;
    };

    const closeModal = () => {
      emit("close");
    };

    const submitReview = async () => {
      if (commentError.value) return;

      loading.value = true;
      try {
        await ratingStore.createRating(reviewData);
        emit("review-submitted");
        closeModal();
      } catch (err) {
        console.error("Failed to submit review:", err);
      } finally {
        loading.value = false;
      }
    };

    return {
      reviewData,
      loading,
      showRatingDropdown,
      ratingLabels,
      displayStars,
      commentError,
      selectRating,
      closeModal,
      submitReview,
    };
  },
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-enter-active .fixed.inset-0,
.modal-leave-active .fixed.inset-0 {
  transition: opacity 0.3s ease;
}

.modal-enter-from .fixed.inset-0,
.modal-leave-to .fixed.inset-0 {
  opacity: 0;
}
</style>
