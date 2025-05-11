<template>
  <v-app-bar app>
    <v-btn text class="title-btn" @click="goToDashboard">
      <v-toolbar-title>My App</v-toolbar-title>
    </v-btn>
    <v-spacer />
    <v-btn icon size="small" @click="showNotifications = true">
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon size="small" v-bind="props">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/profile">Profile</v-list-item>
        <v-list-item v-if="userStore.user?.role === 'ADMIN'" to="/admin/users">All Users</v-list-item>
        <v-list-item @click="logout">Logout</v-list-item>
      </v-list>
    </v-menu>
    <notification-overlay v-model="showNotifications" />
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import NotificationOverlay from './NotificationOverlay.vue'

const router = useRouter()
const userStore = useUserStore()
const showNotifications = ref(false)

const goToDashboard = () => {
  router.push('/')
}

const logout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.title-btn {
  text-transform: none;
  padding: 0;
  font-size: 0.9rem;
  letter-spacing: normal;
}
.title-btn .v-toolbar-title {
  font-size: 1.1rem;
}
</style>