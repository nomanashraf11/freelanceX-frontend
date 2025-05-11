<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Client Dashboard</h1>
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Your Jobs</h2>
      <p>Client content goes here...</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
</script>
