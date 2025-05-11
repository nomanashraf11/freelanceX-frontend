<template>
  <div
    v-if="dialog"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    @click.self="dialog = false"
  >
    <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900">Notifications</h2>
        <button
          @click="dialog = false"
          class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
        >
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div v-if="notifications.length === 0" class="text-center text-gray-600 py-4">
        No notifications available.
      </div>
      <ul v-else class="space-y-3 max-h-96 overflow-y-auto">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-200"
        >
          <span class="text-sm text-gray-900">{{ notification.message }}</span>
          <button
            @click="dismiss(notification.id)"
            class="text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineModel } from 'vue';

const dialog = defineModel();
const notifications = ref([
  { id: 1, message: 'New job posted' },
  { id: 2, message: 'Bid accepted' },
]);

const dismiss = (id: number) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};
</script>