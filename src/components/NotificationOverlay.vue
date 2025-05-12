<template>
  <div
    v-if="dialog"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    @click.self="dialog = false"
  >
    <div
      class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900">Notifications</h2>
        <button
          @click="dialog = false"
          class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
        >
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div
        v-if="notifications.length === 0"
        class="text-center text-gray-600 py-4"
      >
        No notifications available.
      </div>
      <ul v-else class="space-y-3 max-h-96 overflow-y-auto">
        <li
          v-for="notification in notifications"
          :key="notification.notificationId"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-200"
        >
          <span class="text-sm text-gray-900">{{ notification.content }}</span>
          <button
            @click="dismiss(notification.notificationId)"
            class="text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
          >
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "../store/notification";
import { useUserStore } from "../store/user";
const userStore = useUserStore();
const dialog = defineModel();
const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);

// Fetch notifications when dialog opens
watch(dialog, async (newVal) => {
  if (newVal) {
    try {
      const userId = userStore.user?.userId;
      // Replace this with actual user ID (e.g. from auth store)
      if (userId) {
        await notificationStore.fetchNotification(userId);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }
});

const dismiss = (id: string) => {
  notificationStore.notifications = notificationStore.notifications.filter(
    (n) => n.notificationId !== id
  );
};
</script>
