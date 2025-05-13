<template>
    <footer class="bg-gray-100 text-gray-600 text-sm text-center py-4 border-t mt-auto">
      <p>&copy; {{ currentYear }} FreelanceX. All rights reserved.</p>
    </footer>
  </template>
  
  <script setup lang="ts">
  const currentYear = new Date().getFullYear()
  </script>
  
  <style scoped>
  footer {
    width: 100%;
  }
  </style>
  