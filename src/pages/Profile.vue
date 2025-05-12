<template>
  <default-layout>
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-center text-3xl font-extrabold text-gray-900 mb-8">Your Profile</h1>
        <p class="text-center text-sm text-gray-600 mb-8">View and manage your personal information</p>
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Profile Box -->
          <div class="flex-1 bg-white p-8 rounded-xl shadow-2xl transform transition-all hover:scale-105">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <dl class="space-y-4">
                <div class="flex items-center">
                  <dt class="w-1/3 text-sm font-medium text-gray-700">First Name</dt>
                  <dd class="w-2/3 text-sm text-gray-900">{{ user?.profile.firstName || "Not provided" }}</dd>
                </div>
                <div class="flex items-center">
                  <dt class="w-1/3 text-sm font-medium text-gray-700">Last Name</dt>
                  <dd class="w-2/3 text-sm text-gray-900">{{ user?.profile.lastName || "Not provided" }}</dd>
                </div>
                <div class="flex items-center">
                  <dt class="w-1/3 text-sm font-medium text-gray-700">Email</dt>
                  <dd class="w-2/3 text-sm text-gray-900">{{ user?.email || "Not provided" }}</dd>
                </div>
                <div class="flex items-center">
                  <dt class="w-1/3 text-sm font-medium text-gray-700">Role</dt>
                  <dd class="w-2/3 text-sm text-gray-900">{{ user?.role.toString() || "Not provided" }}</dd>
                </div>
                <div v-if="user?.role.toString() === 'FREELANCER'" class="flex items-center">
                  <dt class="w-1/3 text-sm font-medium text-gray-700">Skill Verification</dt>
                  <dd class="w-2/3 text-sm text-gray-900">
                    <button
                      @click="verifySkills"
                      :disabled="verifying"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer"
                      :class="{
                        'bg-green-100 text-green-800': user?.profile.skillVerified,
                        'bg-red-100 text-red-800': !user?.profile.skillVerified,
                        'opacity-50 cursor-not-allowed': verifying,
                      }"
                    >
                      {{ user?.profile.skillVerified ? "Verified" : "Not Verified" }}
                    </button>
                  </dd>
                </div>
                <div class="flex items-start">
                  <dt class="w-1/3 text-sm font-medium text-gray-700">Bio</dt>
                  <dd class="w-2/3 text-sm text-gray-900">{{ user?.profile.bio || "No bio provided" }}</dd>
                </div>
              </dl>
            </div>
            <div class="flex justify-center mt-6">
              <router-link
                to="/edit-profile"
                class="group inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
              >
                Edit Profile
              </router-link>
            </div>
          </div>
          <!-- Reviews Box -->
          <div class="flex-1 bg-white p-8 rounded-xl shadow-2xl transform transition-all hover:scale-105">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Reviews</h2>
            <div>
              <div v-if="ratingStore.loading" class="text-center text-sm text-gray-600">
                Loading reviews...
              </div>
              <div v-else-if="ratings.length === 0" class="text-center text-sm text-gray-600">
                No reviews yet
              </div>
              <div v-else class="space-y-4 max-h-[400px] overflow-y-auto">
                <div
                  v-for="rating in ratings"
                  :key="rating.ratingId"
                  class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div class="flex items-center mb-2">
                    <span class="font-medium text-gray-900">
                      {{ rating.user.firstName }} {{ rating.user.lastName }}
                    </span>
                    <span class="ml-2 text-sm text-gray-500">(Freelancer)</span>
                    <span class="ml-auto text-yellow-500">
                      {{ displayRating(rating.score) }}
                    </span>
                  </div>
                  <p class="text-gray-700">{{ rating.comment }}</p>
                  <p class="text-sm text-gray-500 mt-2">
                    {{ formatDate(rating.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useUserStore } from "../store/user";
import { postAPI } from "../utils/api";
import { useRatingStore } from "../store/rating";
import type { Rating } from "../types/rating";

const userStore = useUserStore();
const ratingStore = useRatingStore();
const user = userStore.user;
const verifying = ref(false);
const ratings = ref([] as Rating[]);

const verifySkills = async () => {
  if (user?.profile.skillVerified || !user?.userId) return;

  verifying.value = true;
  try {
    const verifySkillRequest = {
      userId: user.userId,
      skills: "java,python",
    };
    await postAPI(`/skill/verify`, verifySkillRequest);
    user.profile.skillVerified = true;
  } catch (error: any) {
    console.error("Failed to verify skills:", error);
  } finally {
    verifying.value = false;
  }
};

const displayRating = (score: string) => {
  const ratingMap: Record<string, string> = {
    ONE: "★☆☆☆☆",
    TWO: "★★☆☆☆",
    THREE: "★★★☆☆",
    FOUR: "★★★★☆",
    FIVE: "★★★★★",
  };
  return ratingMap[score] || "☆☆☆☆☆";
};

const fetchReviews = async () => {
  if (!user?.userId) return;

  try {
    await ratingStore.fetchRatingsByUserId(user.userId);
    ratings.value = ratingStore.ratings;
  } catch (error: any) {
    console.error("Failed to fetch reviews:", error);
    ratings.value = [];
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  fetchReviews();
});
</script>
