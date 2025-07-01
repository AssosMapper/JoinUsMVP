<script setup lang="ts">
import { ref, computed } from "vue";
import Map from "@/components/Map.vue";
import type { MapType, MarkerInfo } from "@/types/map.types";

interface Props {
  localisation: string;
  name: string;
  image?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  center: () => ({ lat: 48.8566, lng: 2.3522 }), // Paris par défaut
  zoom: 15,
  height: "400px",
});

const markersReady = ref<MarkerInfo[]>([]);
const geocodingComplete = ref(false);

const mapConfig = computed<MapType>(() => ({
  center: props.center,
  zoom: props.zoom,
  height: props.height,
}));

const geocodeLocation = async () => {
  if (!window.google || !props.localisation) return;

  const geocoder = new google.maps.Geocoder();

  try {
    const results = await new Promise<google.maps.GeocoderResult[]>(
      (resolve, reject) => {
        geocoder.geocode({ address: props.localisation }, (results, status) => {
          if (status === "OK" && results) {
            resolve(results);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      }
    );

    if (results[0]?.geometry?.location) {
      const position = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };

      const imageUrl = props.image || "/assets/associations-images/default.png";

      markersReady.value = [
        {
          position,
          title: props.name,
          content: `
          <div class="flex items-center p-3 text-black max-w-xs">
            <img src="${imageUrl}" 
                 alt="${props.name}"
                 class="w-10 h-10 mr-3 rounded-full object-cover"
                 onerror="this.src='/assets/associations-images/default.png'">
            <div class="flex-1">
              <h3 class="font-bold text-base mb-1">${props.name}</h3>
              <p class="text-sm text-gray-600">${props.localisation}</p>
            </div>
          </div>
        `,
          icon: {
            url: imageUrl,
            scaledSize: new google.maps.Size(40, 40),
            anchor: { x: 20, y: 20 },
          } as google.maps.Icon,
        },
      ];

      // Centrer la carte sur la localisation trouvée
      mapConfig.value.center = position;
      geocodingComplete.value = true;
    }
  } catch (error) {
    console.warn(`Failed to geocode location: ${props.localisation}`, error);
  }
};

const onMapReady = (map: google.maps.Map) => {
  console.log("AssociationMap: Map is ready");
  geocodeLocation();
};

const onMapError = (error: string) => {
  console.error("AssociationMap: Map error", error);
};
</script>

<template>
  <div class="association-map-container">
    <Map
      :config="mapConfig"
      :markers="markersReady"
      @map-ready="onMapReady"
      @map-error="onMapError"
    />

    <!-- Indicateur de localisation -->
    <div
      v-if="!geocodingComplete && localisation"
      class="absolute top-2 right-2 bg-white rounded-lg shadow-md p-2 text-xs"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-spin pi-spinner"></i>
        <span>Localisation...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.association-map-container {
  position: relative;
  width: 100%;
}

:deep(.gm-style-iw) {
  max-width: 300px !important;
}

:deep(.gm-style-iw-c) {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.gm-style-iw-d) {
  overflow: hidden !important;
  max-height: none !important;
}
</style>
