import { defineStore } from "pinia";
import { getAPI } from "../utils/api";
import type { Notification } from "../types/notification";

export const useNotificationStore = defineStore("notifications", {
  state: () => ({
    notifications: [] as Notification[] | [],
  }),
  actions: {
    async fetchNotification(userId: string) {
      try {
        const response = await getAPI<Notification[]>(
          `/notification/user/${userId}`
        );
        this.notifications = response.data;
      } catch (error) {
        throw new Error("Failed to create contract");
      }
    },
  },
});
