<template>
  <default-layout>
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h1 class="text-center text-3xl font-extrabold text-gray-900 mb-6">Edit Profile</h1>
        <form @submit.prevent="updateProfile">
          <div class="space-y-6">
            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                v-model="form.firstName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                v-model="form.lastName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Bio -->
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="bio"
                rows="4"
                v-model="form.bio"
                class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
          </div>

          <!-- Save Button -->
          <div class="mt-8 flex justify-center gap-4">
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>

            <router-link
              to="/profile"
              class="inline-flex justify-center py-2 px-6 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 transition duration-300"
            >
              Cancel
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useUserStore } from "../store/user";
import { patchAPI } from "../utils/api";

const userStore = useUserStore();
const router = useRouter();

const form = ref({
  firstName: userStore.user?.profile.firstName || "",
  lastName: userStore.user?.profile.lastName || "",
  email: userStore.user?.email || "",
  bio: userStore.user?.profile.bio || "",
});

const saving = ref(false);

const updateProfile = async () => {
  if (!userStore.user?.userId) return;

  saving.value = true;

  try {
    await patchAPI(`/user/update-profile`, {
      userId: userStore.user.userId,
      ...form.value,
    });

    // Update local store
    userStore.user.profile.firstName = form.value.firstName;
    userStore.user.profile.lastName = form.value.lastName;
    userStore.user.profile.bio = form.value.bio;

    router.push("/profile");
  } catch (error) {
    console.error("Failed to update profile:", error);
  } finally {
    saving.value = false;
  }
};
</script>