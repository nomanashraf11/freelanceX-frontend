<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>Register</v-card-title>
          <v-card-text>
            <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
            <v-form ref="form" v-model="valid" @submit.prevent="register">
              <v-text-field label="Email" v-model="email" :rules="[rules.required, rules.email]" required />
              <v-text-field
                label="Password"
                type="password"
                v-model="password"
                :rules="[rules.required, rules.minLength]"
                required
              />
              <v-text-field label="First Name" v-model="firstName" :rules="[rules.required]" required />
              <v-text-field label="Last Name" v-model="lastName" :rules="[rules.required]" required />
              <v-select v-model="role" :items="roles" label="Role" :rules="[rules.required]" required />
              <v-textarea
                label="Bio"
                v-model="bio"
                :rules="[rules.maxLength]"
                placeholder="Tell us about yourself (optional)"
              />
              <v-card-actions>
                <v-btn :disabled="!valid || loading" color="primary" type="submit" :loading="loading">
                  Register
                </v-btn>
                <v-btn to="/login" :disabled="loading">Login</v-btn>
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
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import type { RegisterUser } from "../types/user";

const router = useRouter();
const userStore = useUserStore();
const form = ref();
const valid = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const email = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const bio = ref("");
const role = ref<"CLIENT" | "FREELANCER" | "ADMIN">("FREELANCER");

const roles = ["CLIENT", "FREELANCER", "ADMIN"];

const rules = {
  required: (value: string) => !!value || "This field is required",
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || "Invalid email address";
  },
  minLength: (value: string) => value.length >= 8 || "Minimum 8 characters required",
  maxLength: (value: string) => !value || value.length <= 1000 || "Maximum 1000 characters",
};

const register = async () => {
  if (!valid.value) return;
  loading.value = true;
  error.value = null;
  try {
    const user: RegisterUser = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      role: role.value,
      bio: bio.value,
    };
    await userStore.register(user);
    router.push("/");
  } catch (err) {
    error.value = "Registration failed. Please check your details and try again.";
    console.error("Registration failed:", err);
  } finally {
    loading.value = false;
  }
};
</script>
