<template>
  <default-layout>
    <v-container>
      <h1>Job Details</h1>
      <v-card>
        <v-card-title>{{ job.title }}</v-card-title>
        <v-card-text>{{ job.description }}</v-card-text>
        <v-card-actions>
          <v-btn @click="placeBid">Place Bid</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'

// Mock job data
const route = useRoute()
const job = {
  id: route.params.id,
  title: 'Sample Job',
  description: 'This is a detailed description of the job.',
}

const placeBid = () => {
  alert('Bid placed!')
}
</script>