<template>
  <div class="flex flex-col min-h-screen">
    <!-- Your header is probably inside each page, or you can move it here -->
    <router-view class="flex-grow" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from './components/footer.vue'
</script>
