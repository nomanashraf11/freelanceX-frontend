<template>
  <v-container fluid class="d-flex justify-center align-center" style="height: 100vh">
    <v-row justify="center" align="center" class="w-100">
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-title class="text-h6">Login</v-card-title>
          <v-card-text>
            <v-alert v-if="error" type="error" class="mb-4" density="compact">{{ error }}</v-alert>

            <v-form ref="form" v-model="valid" @submit.prevent="login">
              <v-text-field
                label="Email"
                v-model="email"
                :rules="[rules.required, rules.email]"
                required
                density="compact"
              />
              <v-text-field
                label="Password"
                type="password"
                v-model="password"
                :rules="[rules.required, rules.minLength]"
                required
                density="compact"
              />

              <v-card-actions class="justify-space-between">
                <v-btn
                  :disabled="!valid || loading"
                  variant="outlined"
                  type="submit"
                  :loading="loading"
                  density="comfortable"
                  class="mr-2"
                >
                  Login
                </v-btn>
                <v-btn to="/register" :disabled="loading" density="comfortable"> Register </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter} from "vue-router";
import { useUserStore } from "../store/user";

const router = useRouter();
const userStore = useUserStore();
const form = ref();
const valid = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const email = ref("");
const password = ref("");

const rules = {
  required: (value: string) => !!value || "This field is required",
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || "Invalid email address";
  },
  minLength: (value: string) => value.length >= 8 || "Minimum 8 characters required",
};

const login = async () => {
  if (!valid.value) return;
  loading.value = true;
  error.value = null;
  try {
    await userStore.login(email.value, password.value);
    router.push("/");
  } catch (err) {
    error.value = "Login failed. Please check your credentials and try again.";
    console.error("Login failed:", err);
  } finally {
    loading.value = false;
  }
};
</script>
