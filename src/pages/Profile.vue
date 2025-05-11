<template>
  <default-layout>
    <v-container>
      <h1>Profile</h1>
      <v-card>
        <v-card-text>
          <p>FirstName: {{ user?.firstName }}</p>
          <p>LastName: {{ user?.lastName }}</p>
          <p>Email: {{ user?.email }}</p>
          <p>Role: {{ user?.role.toString() }}</p>
          <p>Bio: {{ user?.bio }}</p>
        </v-card-text>
      </v-card>
    </v-container>
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useUserStore } from "../store/user";

const userStore = useUserStore();
const user = userStore.user;
</script>
