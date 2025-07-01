<script setup lang="ts">
import EventMap from "@/components/EventMap.vue";
import ParticipantEventList from "@/components/Events/ParticipantEventList.vue";
import JnsImage from "@/components/ui/JnsImage.vue";
import eventService from "@/services/eventService";
import mediaService from "@/services/mediaService";
import type { EventMapType } from "@/types/map.types";
import { EventParticipantResponseDto } from "@shared/dto/event-participation.dto";
import ProgressSpinner from "primevue/progressspinner";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import Tabs from "primevue/tabs";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const event = ref(null);
const activeTab = ref("0");
const loader = ref(true);
const participants = ref<EventParticipantResponseDto[]>([]);
const participantsLoading = ref(false);

// Computed pour convertir l'événement au format EventMapType
const eventForMap = computed<EventMapType[]>(() => {
  if (!event.value) return [];

  return [
    {
      id: event.value.id,
      titre: event.value.titre,
      description: event.value.description,
      localisation: event.value.localisation,
      date:
        typeof event.value.date === "string"
          ? event.value.date
          : event.value.date.toISOString(),
      association: event.value.association
        ? {
            id: event.value.association.id,
            name: event.value.association.name,
            image:
              typeof event.value.association.image === "string"
                ? event.value.association.image
                : event.value.association.image?.filename,
          }
        : undefined,
      typeEvent: event.value.typeEvent
        ? {
            name: event.value.typeEvent.name,
          }
        : undefined,
    },
  ];
});

// Centre de la carte basé sur la localisation de l'événement
const mapCenter = computed(() => {
  // Paris par défaut, sera mis à jour par géocodage dans EventMap
  return { lat: 48.8566, lng: 2.3522 };
});

const fetchEventDetails = async () => {
  try {
    event.value = await eventService.getEventById(route.params.id as string);
  } catch (error) {
    console.error("Error fetching event details:", error);
  } finally {
    loader.value = false;
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

const onEventClick = (eventData: EventMapType) => {
  console.log("Event clicked:", eventData);
  // L'événement est déjà affiché, donc pas de redirection
};

watch(
  () => activeTab.value,
  async (newValue) => {
    if (newValue === "2") {
      await fetchParticipants();
    }
  }
);

onMounted(() => {
  fetchEventDetails();
});
</script>

<template>
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
                <EventMap
                  :events="eventForMap"
                  :center="mapCenter"
                  height="600px"
                  @event-click="onEventClick"
                />
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
