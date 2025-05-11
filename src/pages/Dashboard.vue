<template>
  <default-layout>
    <v-container>
      <h1>Dashboard</h1>
      <v-row>
        <v-col v-for="job in jobs" :key="job.id" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>{{ job.title }}</v-card-title>
            <v-card-text>{{ job.description }}</v-card-text>
            <v-card-actions>
              <v-btn :to="`/job/${job.id}`">View Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </default-layout>
</template>

<script setup lang="ts">
import DefaultLayout from '../layouts/DefaultLayout.vue'

const jobs = [
  { id: 1, title: 'Web Developer', description: 'Build a Vue app' },
  { id: 2, title: 'Designer', description: 'Create UI mockups' },
]
</script>