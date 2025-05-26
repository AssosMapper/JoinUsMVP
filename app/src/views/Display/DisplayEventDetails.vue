<script setup lang="ts">
import ParticipantEventList from "@/components/Events/ParticipantEventList.vue";
import JnsImage from "@/components/ui/JnsImage.vue";
import eventService from "@/services/eventService";
import mediaService from "@/services/mediaService";
import { loadGoogleMapsApi } from "@/utils/loadGoogleMapsApi";
import { EventParticipantResponseDto } from "@shared/dto/event-participation.dto";
import ProgressSpinner from "primevue/progressspinner";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import Tabs from "primevue/tabs";
import { nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const event = ref(null);
const map = ref<google.maps.Map | null>(null);
const marker = ref<google.maps.Marker | null>(null);
const activeTab = ref("0");
const loader = ref(true);
const mapInitialized = ref(false);
const participants = ref<EventParticipantResponseDto[]>([]);
const participantsLoading = ref(false);

const fetchEventDetails = async () => {
  try {
    event.value = await eventService.getEventById(route.params.id as string);
  } catch (error) {
    console.error("Error fetching event details:", error);
  }
};

const fetchParticipants = async () => {
  if (!event.value) return;

  participantsLoading.value = true;
  try {
    participants.value = await eventService.getEventParticipants(
      event.value.id
    );
  } catch (error) {
    console.error("Error fetching participants:", error);
  } finally {
    participantsLoading.value = false;
  }
};

const initMap = async () => {
  if (!event.value || !event.value.localisation || mapInitialized.value) return;

  try {
    await loadGoogleMapsApi(import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY);
    const mapElement = document.getElementById("map") as HTMLElement;
    if (!mapElement) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: event.value.localisation },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          const latLng = results[0].geometry.location;
          const location: google.maps.LatLngLiteral = {
            lat: Number(latLng.lat()),
            lng: Number(latLng.lng()),
          };
          map.value = new google.maps.Map(mapElement, {
            center: location,
            zoom: 15,
          });

          const icon = {
            url: "/assets/events-images/default.png",
            scaledSize: new google.maps.Size(50, 50),
            origin: { x: 0, y: 0 },
            anchor: { x: 25, y: 25 },
          };

          marker.value = new google.maps.Marker({
            map: map.value,
            position: { lat: location.lat, lng: location.lng },
            title: event.value.titre,
            icon: icon,
          });
          mapInitialized.value = true;
        }
      }
    );
  } catch (error) {
    console.error("Error loading Google Maps API:", error);
  }
};

watch(
  () => activeTab.value,
  async (newValue) => {
    if (newValue === "1") {
      await nextTick();
      initMap();
    } else if (newValue === "2") {
      await fetchParticipants();
    }
  }
);

onMounted(() => {
  fetchEventDetails();
});
</script>

<template>
  <!-- <Loader v-if="loader" /> -->
  <div v-if="event" class="p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-6 bg-primary-hover p-6 rounded-lg">
        <div class="flex-shrink-0">
          <JnsImage
            :name="event.titre"
            :src="
              event.image
                ? mediaService.getMediaUrl(event.image)
                : '/default-event.jpg'
            "
            size="lg"
          />
        </div>

        <div>
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-2"
            >
              {{ event.typeEvent.name }}
            </span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">{{ event.titre }}</h1>
          <div class="flex items-center text-gray-600 mt-2">
            <i class="pi pi-users mr-2"></i>
            {{ event.association.name }}
          </div>
          <div class="flex items-center gap-4 text-gray-600 mt-2">
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar"></i>
              {{ new Date(event.date).toLocaleDateString() }}
              {{
                new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-map-marker"></i>
              {{ event.localisation }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="card">
        <Tabs scrollable v-model:value="activeTab" :lazy="true">
          <TabList>
            <Tab value="0">Informations</Tab>
            <Tab value="1">Carte</Tab>
            <Tab value="2">Participants</Tab>
            <Tab value="3">Commentaires</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="0">
              <div class="bg-white rounded-lg shadow p-6">
                <div class="space-y-6">
                  <div>
                    <p class="text-lg">{{ event.description }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <i
                        :class="
                          event.isPublic ? 'pi pi-lock-open' : 'pi pi-lock'
                        "
                      ></i>
                      {{
                        event.isPublic ? "Événement public" : "Événement privé"
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel value="1">
              <div class="bg-white rounded-lg shadow p-6">
                <div id="map" class="w-full h-[600px] rounded-lg"></div>
              </div>
            </TabPanel>

            <TabPanel value="2">
              <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold mb-4">Participants</h2>
                <ParticipantEventList
                  :participants="participants"
                  :loading="participantsLoading"
                />
              </div>
            </TabPanel>

            <TabPanel value="3">
              <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold mb-4">Commentaires</h2>
                <p class="text-gray-600">Commentaires à venir...</p>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
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
  min-height: 300px;
}

:deep(.p-tablist) {
  border-bottom: 2px solid var(--surface-border);
}

:deep(.p-tab) {
  padding: 1rem 2rem;
  font-weight: 600;
  transition: all 0.2s;
}

:deep(.p-tab.p-tab-active) {
  @apply border-b-2 border-[#168003];
}

:deep(.p-tab:not(.p-tab-active):hover) {
  @apply border-b-2 border-gray-200;
}

:deep(.p-tabpanel) {
  padding: 0;
}
</style>
