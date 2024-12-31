<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import eventService from '@/services/eventService';
import {loadGoogleMapsApi} from '@/utils/loadGoogleMapsApi';
const route = useRoute();
const event = ref(null);
const map = ref<google.maps.Map | null>(null);
const marker = ref<google.maps.Marker | null>(null);

const fetchEventDetails = async () => {
  try {
    event.value = await eventService.getEventById(route.params.id as string);
    initMap();
  } catch (error) {
    console.error('Error fetching event details:', error);
  }
};

const initMap = async () => {
  if (!event.value || !event.value.localisation) return;

  try {
    await loadGoogleMapsApi(import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY);
    const mapElement = document.getElementById("map") as HTMLElement;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: event.value.localisation }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const latLng = results[0].geometry.location;
        const location: google.maps.LatLngLiteral = {
          lat: Number(latLng.lat()),
          lng: Number(latLng.lng())
        };
        map.value = new google.maps.Map(mapElement, {
          center: location,
          zoom: 15,
        });

        const icon = {
          url: "/assets/events-images/default.png",
          scaledSize: new google.maps.Size(50, 50),
          origin: { x: 0, y: 0 },
          anchor: { x: 25, y: 25 }
        };

        marker.value = new google.maps.Marker({
          map: map.value,
          position: { lat: location.lat, lng: location.lng },
          title: event.value.titre,
          icon: icon
        });
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  } catch (error) {
    console.error('Error loading Google Maps API:', error);
  }
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
        <div class="imageContainer justify-center flex mb-4">
          <img src="/assets/events-images/default.png" alt="Event Image" class="w-64 h-64" />
        </div>
        <p class="text-lg mb-2">{{ event.description }}</p>
        <p class="text-lg mb-2">Location: {{ event.localisation }}</p>
        <p class="text-lg mb-2">Date: {{ new Date(event.date).toLocaleDateString() }}</p>
        <p class="text-lg mb-2">Time: {{ new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
        <p class="text-lg mb-2">Public: {{ event.isPublic ? 'Yes' : 'No' }}</p>
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