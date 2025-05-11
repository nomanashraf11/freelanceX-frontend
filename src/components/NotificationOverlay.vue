<template>
  
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