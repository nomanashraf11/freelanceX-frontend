<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title>Notifications</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="n in notifications" :key="n.id">
            <v-list-item-title>{{ n.message }}</v-list-item-title>
            <v-btn icon small @click="dismiss(n.id)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineModel } from 'vue'

const dialog = defineModel()
const notifications = ref([
  { id: 1, message: 'New job posted' },
  { id: 2, message: 'Bid accepted' },
])

const dismiss = (id: number) => {
  notifications.value = notifications.value.filter((n) => n.id !== id)
}
</script>