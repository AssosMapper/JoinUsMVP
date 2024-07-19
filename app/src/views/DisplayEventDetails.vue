<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import eventService from '@/services/eventService';
import { Loader } from '@googlemaps/js-api-loader';

const route = useRoute();
const event = ref(null);
const map = ref<google.maps.Map | null>(null);
const marker = ref<google.maps.Marker | null>(null);

const fetchEventDetails = async () => {
  try {
    const response = await eventService.getEventById(route.params.id);
    event.value = response;
    initMap();
  } catch (error) {
    console.error('Error fetching event details:', error);
  }
};

const initMap = async () => {
  if (!event.value || !event.value.localisation) return;

  const loader = new Loader({
    apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    version: "weekly",
  });

  const google = await loader.load();
  const mapElement = document.getElementById("map") as HTMLElement;
  
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: event.value.localisation }, (results, status) => {
    if (status === "OK" && results && results[0]) {
      const location = results[0].geometry.location;
      map.value = new google.maps.Map(mapElement, {
        center: location,
        zoom: 15,
      });
      marker.value = new google.maps.Marker({
        map: map.value,
        position: location,
        title: event.value.titre,
      });
    } else {
      console.error('Geocode was not successful for the following reason: ' + status);
    }
  });
};

onMounted(() => {
  fetchEventDetails();
});
</script>

<template>
  <div v-if="event" class="p-6 bg-white rounded-lg shadow-md">
    <div class="flex flex-col md:flex-row">
      <div class="md:w-1/2 pr-4">
        <h1 class="text-2xl font-bold mb-4">{{ event.titre }}</h1>
        <img :src="event.image ? `/path/to/images/${event.image}` : '/path/to/default/image.png'" alt="Event Image" class="w-64 h-64 object-cover mb-4" />
        <p class="text-lg mb-2">{{ event.description }}</p>
        <p class="text-lg mb-2">Location: {{ event.localisation }}</p>
        <p class="text-lg mb-2">Date: {{ new Date(event.date).toLocaleDateString() }}</p>
        <p class="text-lg mb-2">Time: {{ new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
        <p class="text-lg mb-2">Public: {{ event.isPublic ? 'Yes' : 'No' }}</p>
        <!-- Ajoutez d'autres détails si nécessaire -->
      </div>
      <div class="md:w-1/2 mt-4 md:mt-0">
        <div id="map" class="w-full h-64 md:h-full rounded-lg"></div>
      </div>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<style scoped>
#map {
  min-height: 300px;
}
</style>