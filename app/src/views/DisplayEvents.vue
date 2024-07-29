<script setup lang="ts">
import { shallowRef, ref, onMounted, defineAsyncComponent } from 'vue';
import eventService from '@/services/eventService';

const components = {
  'Calendar': defineAsyncComponent(() => import('../components/Calendar.vue')),
  'Map': defineAsyncComponent(() => import('../components/Map.vue')),
};

const currentView = shallowRef('Calendar');
const pastEvents = ref([]);
const todayEvents = ref([]);
const upcomingEvents = ref([]);

const fetchEventsByDate = async (date, limit) => {
  try {
    const events = await eventService.getEventsByDate(date, limit);
    pastEvents.value = events.pastEvents;
    todayEvents.value = events.todayEvents;
    upcomingEvents.value = events.upcomingEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

onMounted(() => {
  const today = new Date().toISOString().split('T')[0]; // Date du jour au format YYYY-MM-DD
  fetchEventsByDate(today, 5); // Charger les événements avec une limite de 5
});
</script>

<template>
  <div class="association-manager-interface">    
    <nav>
      <button @click="currentView = 'Calendar'">Calendar</button> |
      <button @click="currentView = 'Map'">Map</button> 
    </nav>
    <component :is="components[currentView]"></component>
    
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">Today's Events:</h2>
      <ul class="list-disc pl-5">
        <li v-for="event in todayEvents" :key="event.id" class="mb-2">
          <span class="font-semibold">{{ event.titre }}</span> - {{ new Date(event.date).toLocaleDateString() }}
        </li>
      </ul>
      <p v-if="todayEvents.length === 0" class="text-gray-500 italic">No events today.</p>
    </div>
    
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">Past Events:</h2>
      <ul class="list-disc pl-5">
        <li v-for="event in pastEvents" :key="event.id" class="mb-2">
          <span class="font-semibold">{{ event.titre }}</span> - {{ new Date(event.date).toLocaleDateString() }}
        </li>
      </ul>
      <p v-if="pastEvents.length === 0" class="text-gray-500 italic">No past events.</p>
    </div>
    
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">Upcoming Events:</h2>
      <ul class="list-disc pl-5">
        <li v-for="event in upcomingEvents" :key="event.id" class="mb-2">
          <span class="font-semibold">{{ event.titre }}</span> - {{ new Date(event.date).toLocaleDateString() }}
        </li>
      </ul>
      <p v-if="upcomingEvents.length === 0" class="text-gray-500 italic">No upcoming events.</p>
    </div>
  </div>
</template>

<style scoped>
.association-manager-interface {
  padding: 20px;
}
.mt-8 {
  margin-top: 20px;
}
</style>
