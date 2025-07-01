<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import Map from "@/components/Map.vue";
import type { EventMapType, MapType, MarkerInfo } from "@/types/map.types";
import mediaService from "@/services/mediaService";

interface Props {
  events: EventMapType[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  center: () => ({ lat: 48.8566, lng: 2.3522 }), // Paris par défaut
  zoom: 12,
  height: "400px",
});

const emit = defineEmits<{
  eventClick: [event: EventMapType];
}>();

const router = useRouter();
const geocodingCache = ref<Record<string, google.maps.LatLngLiteral>>({});
const markersReady = ref<MarkerInfo[]>([]);
const geocodingProgress = ref(0);

const mapConfig = computed<MapType>(() => ({
  center: props.center,
  zoom: props.zoom,
  height: props.height,
}));

const hasEvents = computed(() => props.events && props.events.length > 0);

const onEventClick = (event: EventMapType) => {
  emit("eventClick", event);
  router.push(`/displayevent/${event.id}`);
};

const geocodeEvents = async () => {
  if (!hasEvents.value) {
    markersReady.value = [];
    geocodingProgress.value = 0;
    return;
  }

  if (!window.google) return;

  const geocoder = new google.maps.Geocoder();
  const markers: MarkerInfo[] = [];

  for (let i = 0; i < props.events.length; i++) {
    const event = props.events[i];

    if (!event.localisation) continue;

    try {
      // Vérifier le cache
      let position = geocodingCache.value[event.localisation];

      if (!position) {
        // Géocoder l'adresse
        const results = await new Promise<google.maps.GeocoderResult[]>(
          (resolve, reject) => {
            geocoder.geocode(
              { address: event.localisation },
              (results, status) => {
                if (status === "OK" && results) {
                  resolve(results);
                } else {
                  reject(new Error(`Geocoding failed: ${status}`));
                }
              }
            );
          }
        );

        if (results[0]?.geometry?.location) {
          position = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          geocodingCache.value[event.localisation] = position;
        }
      }

      if (position) {
        const imageUrl = event.association?.image
          ? mediaService.getMediaUrl(event.association.image as any)
          : "/assets/associations-images/default.png";

        markers.push({
          position,
          title: event.titre,
          content: `
            <div class="flex items-center p-2 text-black max-w-xs">
              <img src="${imageUrl}" 
                   alt="${event.association?.name || "Association"}"
                   class="w-8 h-8 mr-2 rounded-full object-cover"
                   onerror="this.src='/assets/associations-images/default.png'">
              <div class="flex-1">
                <h3 class="font-bold text-sm mb-1">${event.titre}</h3>
                <p class="text-xs text-gray-600 mb-1">${
                  event.association?.name || ""
                }</p>
                <p class="text-xs text-gray-500">${new Date(
                  event.date
                ).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</p>
              </div>
            </div>
          `,
          icon: {
            url: imageUrl,
            scaledSize: new google.maps.Size(32, 32),
            anchor: { x: 16, y: 16 },
          } as google.maps.Icon,
          clickAction: () => onEventClick(event),
        });
      }
    } catch (error) {
      console.warn(`Failed to geocode event: ${event.titre}`, error);
    }

    geocodingProgress.value = ((i + 1) / props.events.length) * 100;
  }

  markersReady.value = markers;
};

const onMapReady = (map: google.maps.Map) => {
  console.log("EventMap: Map is ready");
  geocodeEvents();
};

const onMapError = (error: string) => {
  console.error("EventMap: Map error", error);
};

watch(() => props.events, geocodeEvents, { deep: true });
</script>

<template>
  <div class="event-map-container">
    <Map
      :config="mapConfig"
      :markers="markersReady"
      @map-ready="onMapReady"
      @map-error="onMapError"
    />

    <!-- Message quand aucun événement -->
    <div
      v-if="!hasEvents"
      class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 rounded-lg"
    >
      <div class="text-center p-4">
        <i class="pi pi-calendar-times text-4xl text-gray-400 mb-2"></i>
        <p class="text-gray-600 font-medium font-semibold">
          Aucun événement à afficher à cette date
        </p>
      </div>
    </div>

    <!-- Progress indicator pour le géocodage -->
    <div
      v-if="hasEvents && geocodingProgress > 0 && geocodingProgress < 100"
      class="absolute top-2 right-2 bg-white rounded-lg shadow-md p-2 text-xs"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-spin pi-spinner"></i>
        <span
          >Chargement des événements...
          {{ Math.round(geocodingProgress) }}%</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-map-container {
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
