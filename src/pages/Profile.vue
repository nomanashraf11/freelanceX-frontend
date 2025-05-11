<template>
  <default-layout>
    <v-container>
      <h1>Profile</h1>
      <v-card>
        <v-card-text>
          <p>Username: {{ user?.username }}</p>
          <p>Email: {{ user?.email }}</p>
        </v-card-text>
      </v-card>
    </v-container>
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useUserStore } from '../store/user'

const userStore = useUserStore()
const user = userStore.user
</script>