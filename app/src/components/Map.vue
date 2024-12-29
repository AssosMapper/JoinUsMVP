<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Event } from '@shared/types/event';
// import JnsImage from './ui/JnsImage.vue';
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

const getImageSrc = (associationName: string) => {
  if (!associationName) return "/assets/associations-images/default.png";
  const sanitizedAssociationName = associationName.replace(/\s+/g, "").toLowerCase();
  return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

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
          const marker = new google.maps.Marker({
            position: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            },
            map: map,
            title: event.titre,
            icon: {
              url: getImageSrc(event.association?.name || ''),
              scaledSize: new google.maps.Size(32, 32),
            }
          });

          // Ajouter un infowindow pour chaque marqueur
          const infowindow = new google.maps.InfoWindow({
            content: `
              <div class="flex items-center p-2">
                <h3 class="font-bold">${event.titre}</h3>
                <p class="text-sm">${event.description}</p>
                <p class="text-xs">${new Date(event.date).toLocaleString()}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            router.push(`/events/${event.id}`);
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