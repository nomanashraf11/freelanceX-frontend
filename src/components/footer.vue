<template>
    <footer class="bg-indigo-600 text-white text-center py-6 mt-auto shadow-inner">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p class="text-sm">&copy; {{ currentYear }} FREELANCEX. All rights reserved.</p>
        <div class="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" class="hover:underline text-sm">Privacy Policy</a>
          <a href="#" class="hover:underline text-sm">Terms</a>
          <a href="#" class="hover:underline text-sm">Contact</a>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  const currentYear = new Date().getFullYear()
  </script>
  <style scoped>
  footer {
    background-color: #545165; /* Indigo-600 */
    color: white;
    padding: 1.5rem 1rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  footer a {
    margin-left: 1rem;
    color: #d1d5db;
    text-decoration: none;
  }
  
  footer a:hover {
    text-decoration: underline;
    color: #fff;
  }
  </style>
  