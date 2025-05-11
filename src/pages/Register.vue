<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>Register</v-card-title>
          <v-card-text>
            <v-text-field label="Username" v-model="username" />
            <v-text-field label="Email" v-model="email" />
            <v-text-field label="Password" type="password" v-model="password" />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="register">Register</v-btn>
            <v-btn to="/login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    // Simulate API call
    localStorage.setItem('token', 'dummy-token')
    router.push('/')
  } catch (error) {
    console.error('Registration failed')
  }
}
</script>