<template>
  <default-layout>
    <v-container>
      <h1>All Users</h1>
      <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
      <v-progress-circular v-if="loading" indeterminate color="primary" class="mb-4" />
      <v-table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Bio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersStore.users" :key="user.userId">
            <td>{{ user.userId }}</td>
            <td>{{ user.profile.firstName }}</td>
            <td>{{ user.profile.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.profile.bio || "N/A" }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </default-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useUserStore } from "../store/user";

const usersStore = useUserStore();
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    await usersStore.fetchUsers();
  } catch (err) {
    error.value = "Failed to fetch users. Please try again.";
    console.error("Failed to fetch users:", err);
  } finally {
    loading.value = false;
  }
});
</script>
