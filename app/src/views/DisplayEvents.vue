<script setup lang="ts">
import { shallowRef, ref, onMounted, defineAsyncComponent } from 'vue';
import eventService from '@/services/eventService';
import EventList from '@/components/EventsList.vue';

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
  const today = new Date().toISOString().split('T')[0]; 
  fetchEventsByDate(today, 5); 
});
</script>

<template>
  <div class="association-manager-interface">    
    <nav>
      <button @click="currentView = 'Calendar'">Calendar</button> |
      <button @click="currentView = 'Map'">Map</button> 
    </nav>
    <component :is="components[currentView]"></component>
    
    <EventList title="Today's Events" :events="todayEvents" />
    <EventList title="Past Events" :events="pastEvents" />
    <EventList title="Upcoming Events" :events="upcomingEvents" />
  </div>
</template>

<style scoped>
.association-manager-interface {
  padding: 20px;
}
</style>
