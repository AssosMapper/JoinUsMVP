<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import eventService from '@/services/eventService';
import {loadGoogleMapsApi} from '@/utils/loadGoogleMapsApi';
import ProgressSpinner from 'primevue/progressspinner';
import mediaService from '@/services/mediaService';
import JnsBadge from '@/components/JnsBadge.vue';
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
  <div v-if="event" class="p-6">
    <div class="flex flex-col md:flex-row gap-6">
      <div class="w-full md:w-1/2">
        <div class="flex flex-col bg-white rounded-xl border-primary 
                    shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)]">
          <!-- Image avec overlay -->
          <div class="relative">
            <JnsImage
              :name="event.titre"
              :src="event.image ? mediaService.getMediaUrl(event.image) : '/default-event.jpg'"
              size="lg"
              :rounded="false"
              class="w-full h-96 object-cover rounded-t-xl"
            />
            <div class="absolute top-2 right-2 bg-primary text-white rounded-t-xl">
              <span class="px-3 py-1 bg-primary/10 rounded-full text-sm">
                {{ event.typeEvent.name }}
              </span>
            </div>
          </div>
          
          <!-- Contenu -->
          <div class="p-4">
            <!-- Titre et association -->
            <div class="flex flex-col mb-4">
              <h1 class="text-xl font-semibold text-gray-800">{{ event.titre }}</h1>
              <span class="text-sm text-gray-600">
                <i class="pi pi-users mr-1"></i>
                {{ event.association.name }}
              </span>
            </div>
            
            <!-- Date -->
            <div class="flex items-center gap-2 text-gray-600 mb-4">
              <i class="pi pi-calendar"></i>
              {{ new Date(event.date).toLocaleDateString() }}
              {{ new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </div>
            
            <!-- Localisation -->
            <div class="flex items-center gap-2 text-gray-500 mb-4">
              <i class="pi pi-map-marker"></i>
              {{ event.localisation }}
            </div>
            
            <!-- Description -->
            <p class="text-gray-700 mb-4">
              {{ event.description }}
            </p>
            
            <!-- Statut public/privé -->
            <div class="flex items-center gap-2 text-gray-600">
              <i class="pi pi-lock-open" v-if="event.isPublic"></i>
              <i class="pi pi-lock" v-else></i>
              {{ event.isPublic ? 'Événement public' : 'Événement privé' }}
            </div>
          </div>
        </div>
      </div>

      <div class="w-full md:w-1/2">
        <div class="flex flex-col bg-white rounded-xl border-primary 
                    shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)]">
          <div id="map" class="w-full h-96 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex justify-center p-4">
      <ProgressSpinner />
    </div>
  </div>
</template>

<style scoped>
#map {
  @apply rounded-xl;
}
</style>