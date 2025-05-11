<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-text-field label="Email" v-model="email" />
            <v-text-field label="Password" type="password" v-model="password" />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="login">Login</v-btn>
            <v-btn to="/register">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";

const email = ref("");
const password = ref("");
const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push("/");
  } catch (error) {
    console.error(`Login failed: ${error}`);
  }
};
</script>
