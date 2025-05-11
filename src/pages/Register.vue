<template>
  <div class="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl transform transition-all hover:scale-105">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">Create Your Account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Join us today and start your journey!
        </p>
      </div>
      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        {{ error }}
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="register">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              v-model="email"
              :rules="[rules.required, rules.email]"
              required
              type="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
              placeholder="you@example.com"
            />
            <span v-if="!valid && email && !rules.email(email)" class="text-red-600 text-xs mt-1">{{ rules.email(email) }}</span>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="password"
              :rules="[rules.required, rules.minLength]"
              required
              type="password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
              placeholder="••••••••"
            />
            <span v-if="!valid && password && !rules.minLength(password)" class="text-red-600 text-xs mt-1">{{ rules.minLength(password) }}</span>
          </div>
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
            <input
              id="firstName"
              v-model="firstName"
              :rules="[rules.required]"
              required
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
              placeholder="John"
            />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              id="lastName"
              v-model="lastName"
              :rules="[rules.required]"
              required
              type="text"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
              placeholder="Doe"
            />
          </div>
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              v-model="role"
              :rules="[rules.required]"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
            >
              <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <div>
            <label for="bio" class="block text-sm font-medium text-gray-700">Bio (Optional)</label>
            <textarea
              id="bio"
              v-model="bio"
              :rules="[rules.maxLength]"
              rows="4"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300"
              placeholder="Tell us about yourself..."
            ></textarea>
            <span v-if="bio && !rules.maxLength(bio)" class="text-red-600 text-xs mt-1">{{ rules.maxLength(bio) }}</span>
          </div>
        </div>
        <div class="flex justify-between">
          <button
            :disabled="!valid || loading"
            type="submit"
            class="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
              </svg>
            </span>
            Register
          </button>
          <router-link
            to="/login"
            :disabled="loading"
            class="group relative w-1/2 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-2 transition duration-300"
          >
            Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import type { RegisterUser } from "../types/user";

const router = useRouter();
const userStore = useUserStore();
const valid = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const email = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const bio = ref("");
const role = ref<"CLIENT" | "FREELANCER" | "ADMIN">("FREELANCER");

const roles = ["CLIENT", "FREELANCER", "ADMIN"];

const rules = {
  required: (value: string) => !!value || "This field is required",
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || "Invalid email address";
  },
  minLength: (value: string) => value.length >= 8 || "Minimum 8 characters required",
  maxLength: (value: string) => !value || value.length <= 1000 || "Maximum 1000 characters",
};

const register = async () => {
  if (!valid.value) return;
  loading.value = true;
  error.value = null;
  try {
    const user: RegisterUser = {
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value,
      email: email.value,
      role: role.value,
      bio: bio.value,
    };
    await userStore.register(user);
    router.push("/login");
  } catch (err) {
    error.value = "Registration failed. Please check your details and try again.";
    console.error("Registration failed:", err);
  } finally {
    loading.value = false;
  }
};
</script>