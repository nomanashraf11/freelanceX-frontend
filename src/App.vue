<template>
  <div class="flex flex-col min-h-screen">

    <router-view class="flex-grow" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from './components/footer.vue'
</script>
