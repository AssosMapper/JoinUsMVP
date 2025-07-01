<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import type { MapType, MapState, MarkerInfo } from "@/types/map.types";
import { useGoogleMapsLoader } from "@/composables/useGoogleMapLoader";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";

interface Props {
  config: MapType;
  markers?: MarkerInfo[];
}

const props = withDefaults(defineProps<Props>(), {
  markers: () => [],
});

const emit = defineEmits<{
  mapReady: [map: google.maps.Map];
  mapError: [error: string];
}>();

const mapDiv = ref<HTMLElement | null>(null);
const { isLoaded } = useGoogleMapsLoader();

const mapState = ref<MapState>({
  loading: true,
  error: false,
  initialized: false,
});

let map: google.maps.Map | null = null;
let markersArray: google.maps.Marker[] = [];

const initMap = async () => {
  if (!mapDiv.value || !isLoaded.value || !props.config) return;

  try {
    mapState.value.loading = true;
    mapState.value.error = false;

    await nextTick();

    map = new google.maps.Map(mapDiv.value, {
      center: props.config?.center || { lat: 48.8566, lng: 2.3522 },
      zoom: props.config?.zoom || 12,
    });

    mapState.value.initialized = true;
    mapState.value.loading = false;

    emit("mapReady", map);
    updateMarkers();
  } catch (error) {
    console.error("Error initializing map:", error);
    mapState.value.loading = false;
    mapState.value.error = true;
    emit(
      "mapError",
      error instanceof Error
        ? error.message
        : "Erreur de chargement de la carte"
    );
  }
};

const updateMarkers = () => {
  if (!map) return;

  // Supprimer les anciens marqueurs
  markersArray.forEach((marker) => marker.setMap(null));
  markersArray = [];

  // Ajouter les nouveaux marqueurs
  props.markers.forEach((markerInfo) => {
    const marker = new google.maps.Marker({
      position: markerInfo.position,
      map: map,
      title: markerInfo.title,
      icon: markerInfo.icon,
    });

    if (markerInfo.content) {
      const infowindow = new google.maps.InfoWindow({
        content: markerInfo.content,
      });

      marker.addListener("mouseover", () => {
        infowindow.open(map, marker);
      });

      marker.addListener("mouseout", () => {
        infowindow.close();
      });
    }

    if (markerInfo.clickAction) {
      marker.addListener("click", markerInfo.clickAction);
    }

    markersArray.push(marker);
  });
};

const retryLoadMap = () => {
  mapState.value.loading = true;
  mapState.value.error = false;
  initMap();
};

onMounted(() => {
  if (isLoaded.value) {
    initMap();
  }
});

watch(isLoaded, (loaded) => {
  if (loaded && !mapState.value.initialized) {
    initMap();
  }
});

watch(() => props.markers, updateMarkers, { deep: true });
</script>

<template>
  <div
    class="relative w-full"
    :style="{ height: props.config?.height || '400px' }"
  >
    <!-- Loading State -->
    <div
      v-if="mapState.loading"
      class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg"
    >
      <div class="text-center">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
        <p class="mt-4 text-gray-600">Chargement de la carte...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="mapState.error"
      class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg"
    >
      <div class="text-center p-6">
        <i class="pi pi-exclamation-triangle text-4xl text-orange-500 mb-4"></i>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          Impossible de charger la carte
        </h3>
        <p class="text-gray-600 mb-4">
          Une erreur s'est produite lors du chargement de la carte.
        </p>
        <Button
          @click="retryLoadMap"
          label="Actualiser"
          icon="pi pi-refresh"
          class="bg-primary text-white"
        />
      </div>
    </div>

    <!-- Map Container -->
    <div
      ref="mapDiv"
      class="w-full h-full rounded-lg"
      :class="{ 'opacity-0': mapState.loading || mapState.error }"
    ></div>
  </div>
</template>

<style scoped>
.gm-style-iw {
  padding: 12px;
}
</style>
