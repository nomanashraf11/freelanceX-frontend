<template>
  <div class="min-h-screen flex flex-col">
    <navbar />
    <main class="flex-grow mt-20">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from "../components/NavBar.vue";
</script>
