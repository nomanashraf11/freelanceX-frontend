<template>
  <div class="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div
      class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl transform transition-all hover:scale-105"
    >
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">Sign In</h2>
        <p class="mt-2 text-center text-sm text-gray-600">Welcome back! Please login to your account.</p>
      </div>
      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        {{ error }}
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              v-model="email"
              required
              type="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
              placeholder="you@example.com"
            />
            <span v-if="email && !rules.email(email)" class="text-red-600 text-xs mt-1">{{
              rules.email(email)
            }}</span>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              required
              type="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
              placeholder="••••••••"
            />
            <span v-if="password && !rules.minLength(password)" class="text-red-600 text-xs mt-1">{{
              rules.minLength(password)
            }}</span>
          </div>
        </div>
        <div class="flex justify-between">
          <button
            :disabled="!valid || loading"
            type="submit"
            class="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="animate-spin h-5 w-5 text-white"
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
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
              </svg>
            </span>
            Login
          </button>
          <router-link
            to="/register"
            :disabled="loading"
            class="group relative w-1/2 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-2 transition duration-300"
          >
            Register
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const error = ref<string | null>(null);

const email = ref("");
const password = ref("");

const rules = {
  required: (value: string) => !!value || "This field is required",
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || "Invalid email address";
  },
  minLength: (value: string) => value.length >= 8 || "Minimum 8 characters required",
};

const valid = computed(() => {
  return (
    rules.required(email.value) === true &&
    rules.email(email.value) === true &&
    rules.required(password.value) === true &&
    rules.minLength(password.value) === true
  );
});

const login = async () => {
  if (!valid.value) return;
  loading.value = true;
  error.value = null;
  try {
    await userStore.login(email.value, password.value);
    router.push("/");
  } catch (err) {
    error.value = "Login failed. Please check your credentials and try again.";
    console.error("Login failed:", err);
  } finally {
    loading.value = false;
  }
};
</script>
