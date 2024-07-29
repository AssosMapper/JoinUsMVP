
  
<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    title: String,
    events: Array
});
</script>

<template>
    <div class="events-section mt-8">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <ul class="list-disc pl-5">
        <li v-for="event in events" :key="event.id" class="mb-2">
          <span class="font-semibold">{{ event.titre }}</span> - {{ new Date(event.date).toLocaleDateString() }}
        </li>
      </ul>
      <p v-if="events.length === 0" class="text-gray-500 italic">No {{ title.toLowerCase() }}.</p>
    </div>
</template>
  
<style scoped>
.events-section {
    margin-top: 20px;
}
</style>
  