<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Event } from '@shared/types/event';
import mediaService from "@/services/mediaService";
// import JnsImage from '@/components/ui/JnsImage.vue';
import { useGoogleMapsLoader } from "@/composables/useGoogleMapLoader";

interface Props {
  events: Event[];
  center: { lat: number; lng: number };
}

const props = defineProps<Props>();
const router = useRouter();
const mapDiv = ref<HTMLElement | null>(null);
const { isLoaded } = useGoogleMapsLoader();
let map: google.maps.Map | null = null;
let markers: google.maps.Marker[] = [];

const initMap = () => {
  if (!mapDiv.value) return;

  map = new google.maps.Map(mapDiv.value, {
    center: props.center,
    zoom: 12,
  });
};

const updateMarkers = () => {
  // Supprimer les anciens marqueurs
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  // Ajouter les nouveaux marqueurs
  props.events.forEach(event => {
    if (event.localisation) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: event.localisation }, (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          console.log('Event:', event);
          console.log('Association:', event.association);
          console.log('Association image:', event.association?.image);
          const imageUrl = event.association?.image ? mediaService.getMediaUrl(event.association.image) : "/assets/events-images/default.png";
          console.log('Final image URL:', imageUrl);
          const marker = new google.maps.Marker({
            position: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            },
            map: map,
            title: event.titre,
            icon: {
              url: event.association?.image ? mediaService.getMediaUrl(event.association.image) : "/assets/associations-images/default.png",
              scaledSize: new google.maps.Size(32, 32)
            }
          });

          // Ajouter un infowindow pour chaque marqueur
          const infowindow = new google.maps.InfoWindow({
            content: `
              <div class="flex items-center p-2">
                <img src="${event.association?.image ? mediaService.getMediaUrl(event.association.image) : "/assets/associations-images/default.png"}" 
                     alt="${event.association?.name || 'Association'}"
                     class="w-8 h-8 mr-2">
                <div>
                  <h3 class="font-bold">${event.titre}</h3>
                  <p class="text-sm">${event.description}</p>
                  <p class="text-xs">${new Date(event.date).toLocaleString()}</p>
                </div>
              </div>
            `
          });

          marker.addListener('click', () => {
            router.push(`/displayevent/${event.id}`);
          });

          marker.addListener('mouseover', () => {
            infowindow.open(map, marker);
          });

          marker.addListener('mouseout', () => {
            infowindow.close();
          });

          markers.push(marker);
        }
      });
    }
  });
};

onMounted(async () => {
  if (isLoaded.value) {
    initMap();
    updateMarkers();
  }
});

watch(isLoaded, (loaded) => {
  if (loaded) {
    initMap();
    updateMarkers();
  }
});

watch(() => props.events, updateMarkers, { deep: true });
</script>

<template>
  <div ref="mapDiv" class="w-full h-full"></div>
</template>

<style scoped>
.gm-style-iw {
  padding: 12px;
}
</style>