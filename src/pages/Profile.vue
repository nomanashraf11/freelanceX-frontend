<template>
  <default-layout>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-lg w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl transform transition-all hover:scale-105">
        <div>
          <h1 class="text-center text-3xl font-extrabold text-gray-900">Your Profile</h1>
          <p class="mt-2 text-center text-sm text-gray-600">
            View and manage your personal information
          </p>
        </div>
        <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <dl class="space-y-4">
            <div class="flex items-center">
              <dt class="w-1/3 text-sm font-medium text-gray-700">First Name</dt>
              <dd class="w-2/3 text-sm text-gray-900">{{ user?.profile.firstName || 'Not provided' }}</dd>
            </div>
            <div class="flex items-center">
              <dt class="w-1/3 text-sm font-medium text-gray-700">Last Name</dt>
              <dd class="w-2/3 text-sm text-gray-900">{{ user?.profile.lastName || 'Not provided' }}</dd>
            </div>
            <div class="flex items-center">
              <dt class="w-1/3 text-sm font-medium text-gray-700">Email</dt>
              <dd class="w-2/3 text-sm text-gray-900">{{ user?.email || 'Not provided' }}</dd>
            </div>
            <div class="flex items-center">
              <dt class="w-1/3 text-sm font-medium text-gray-700">Role</dt>
              <dd class="w-2/3 text-sm text-gray-900">{{ user?.role.toString() || 'Not provided' }}</dd>
            </div>
            <div class="flex items-start">
              <dt class="w-1/3 text-sm font-medium text-gray-700">Bio</dt>
              <dd class="w-2/3 text-sm text-gray-900">{{ user?.profile.bio || 'No bio provided' }}</dd>
            </div>
          </dl>
        </div>
        <div class="flex justify-center">
          <router-link
            to="/edit-profile"
            class="group inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
          >
            Edit Profile
          </router-link>
        </div>
      </div>
    </div>
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useUserStore } from "../store/user";

const userStore = useUserStore();
const user = userStore.user;
</script>