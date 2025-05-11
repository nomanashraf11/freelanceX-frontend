<template>
  <v-app-bar app>
    <v-toolbar-title>My App</v-toolbar-title>
    <v-spacer />
    <v-btn icon @click="showNotifications = true">
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/profile">Profile</v-list-item>
        <v-list-item @click="logout">Logout</v-list-item>
      </v-list>
    </v-menu>
    <notification-overlay v-model="showNotifications" />
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import NotificationOverlay from './NotificationOverlay.vue'

const showNotifications = ref(false)
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
}
</script>