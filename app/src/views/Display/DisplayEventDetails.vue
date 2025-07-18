<script setup lang="ts">
import EventMap from "@/components/EventMap.vue";
import ParticipantEventList from "@/components/Events/ParticipantEventList.vue";
import ParticipateEventButton from "@/components/Events/ParticipateEventButton.vue";
import UpdateEvent from "@/components/Update/UpdateEvent.vue";
import eventService from "@/services/eventService";
import { EventMapType } from "@/types/map.types";
import { EventParticipantResponseDto } from "@shared/dto/event-participation.dto";
import { EventDto } from "@shared/dto/events.dto";
import { formatFullAddress } from "@shared/utils/address.util";
import { plainToInstance } from "class-transformer";
import Chip from "primevue/chip";
import ProgressSpinner from "primevue/progressspinner";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import Tabs from "primevue/tabs";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getMediaUrl } from "@/utils/media.util";
import { useNotificationStore } from "@/store/notificationStore";
import { useUserStore } from "@/store/userStore";

const route = useRoute();
const event = ref(null);
const activeTab = ref("0");
const loader = ref(true);
const participants = ref<EventParticipantResponseDto[]>([]);
const participantsLoading = ref(false);
const notificationStore = useNotificationStore();
const userStore = useUserStore();

// Computed pour vérifier si l'utilisateur peut modifier l'événement
const canEditEvent = computed(() => {
  if (!event.value || !userStore.isAuthenticated) return false;
  
  // Admin peut tout modifier
  if (userStore.isAdmin) return true;
  
  // Events manager peut modifier les événements de son association
  if (userStore.isEventsManager) {
    return event.value.association?.id === userStore.associationId;
  }
  
  return false;
});

// Computed pour vérifier si l'événement est passé
const isEventPast = computed(() => {
  if (!event.value?.date) return false;
  return new Date(event.value.date) < new Date();
});

// Computed pour convertir l'événement au format EventMapType
const eventForMap = computed<EventMapType[]>(() => {
  if (!event.value) return [];

  return [
    plainToInstance(EventMapType, event.value, {
      enableImplicitConversion: true,
    }),
  ];
});

// Centre de la carte basé sur la localisation de l'événement
const mapCenter = computed(() => {
  // Paris par défaut, sera mis à jour par géocodage dans EventMap
  return { lat: 48.8566, lng: 2.3522 };
});

// Computed pour le lien Google Maps
const googleMapsUrl = computed(() => {
  if (!event.value?.localisation) return '';
  const address = formatFullAddress(event.value.localisation);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
});

// Computed pour formater la date
const formattedDate = computed(() => {
  if (!event.value?.date) return '';
  const date = new Date(event.value.date);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Computed pour formater l'heure
const formattedTime = computed(() => {
  if (!event.value?.date) return '';
  const date = new Date(event.value.date);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
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
  console.log("fetchParticipants");
  if (!event.value) return;

  participantsLoading.value = true;
  try {
    participants.value = await eventService.getEventParticipants(
      event.value.id
    );
    console.log(participants.value);
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

const onParticipationSuccess = () => {
  fetchParticipants();
};

const onParticipationError = () => {
  notificationStore.showNotification("Erreur lors de l'enregistrement de la participation", "error");
};

const onEventUpdated = (updatedEvent: EventDto) => {
  event.value = updatedEvent;
  // Retourner à l'onglet informations après la modification
  activeTab.value = "0";
};

const onImageError = ref(false);

onMounted(() => {
  fetchEventDetails();
});
</script>

<template>
  <div v-if="event" class="p-4 w-full md:w-9/12 lg:w-8/12 md:mx-auto mt-5">
    <!-- Image principale avec badge -->
    <div v-if="!onImageError"
    class="relative mb-6">
      <div class="rounded-lg md:h-80 overflow-hidden shadow-lg">
        <img 
          :src="
            event.image?.filepath
              ? getMediaUrl(event.image?.filepath)
              : ''
          "
          @error="onImageError = true"
          :alt="event.titre"
          class="w-full h-full object-cover aspect-3/2"
        />
        <!-- Badge de visibilité -->
        <div class="absolute top-4 left-4">
          <Chip
            :label="event.isPublic ? 'Publique' : 'Réservé aux membres de l\'association'"
            :class="event.isPublic ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'"
            class="font-medium"
          />
        </div>
      </div>
    </div>

    <!-- Informations de l'événement -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <!-- Date et heure -->
      <div class="flex items-center gap-2 text-primary font-medium text-sm mb-3">
        <i class="pi pi-calendar"></i>
        <span>{{ formattedDate }} | {{ formattedTime }}</span>
      </div>

      <!-- Titre -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4 text-left">{{ event.titre }} 
        <span class="text-sm font-normal align-middle">
           <Chip
          :label="event.typeEvent.name"
          class="bg-primary/10 text-primary"
          />
      </span>
      </h1>

      <!-- Type d'événement -->
      <div class="mb-4">
       
      </div>

      <!-- Description -->
      <div class="mb-6">
        <p class="text-gray-700 leading-relaxed text-justify">{{ event.description }}</p>
      </div>

      <!-- Informations supplémentaires -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Association -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <i class="pi pi-users text-primary"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500 text-left">Organisé par</p>
            <p class="font-medium text-gray-900">{{ event.association.name }}</p>
          </div>
        </div>

        <!-- Localisation -->
        <div class="flex items-center gap-3" v-if="event.localisation">
          <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <i class="pi pi-map-marker text-primary"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500 text-left">Lieu</p>
            <a
              :href="googleMapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-primary hover:text-primary-dark transition-colors cursor-pointer text-left"
            >
              {{ formatFullAddress(event.localisation) }}
              <i class="pi pi-external-link ml-1 text-xs"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton de participation -->
    <div v-if="!isEventPast" class="flex justify-center mb-6">
      <ParticipateEventButton
        :event-id="event.id"
        class="px-8 py-2"
        @event-participation-success="onParticipationSuccess"
        @event-participation-error="onParticipationError"
      />
    </div>

    <!-- Onglets -->
    <div class="bg-white rounded-lg shadow-sm">
      <Tabs scrollable v-model:value="activeTab" :lazy="true">
        <TabList class="border-b border-gray-200">
          <Tab value="0" class="px-6 py-3 font-medium">Informations</Tab>
          <Tab value="1" class="px-6 py-3 font-medium">Carte</Tab>
          <Tab value="2" class="px-6 py-3 font-medium">Participants</Tab>
          <Tab value="3" class="px-6 py-3 font-medium">Commentaires</Tab>
          <Tab v-if="canEditEvent && !isEventPast" value="4" class="px-6 py-3 font-medium">
            <i class="pi pi-edit mr-2"></i>Modifier
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="0">
           
          </TabPanel>

          <TabPanel value="1">
            <div class="p-6">
              <EventMap
                :events="eventForMap"
                :center="mapCenter"
                height="600px"
                @event-click="onEventClick"
              />
            </div>
          </TabPanel>

          <TabPanel value="2">
            <div class="p-6">
              <h2 class="text-lg font-semibold mb-4">Participants</h2>
              <ParticipantEventList
                :participants="participants"
                :loading="participantsLoading"
              />
            </div>
          </TabPanel>

          <TabPanel value="3">
            <div class="p-6">
              <h2 class="text-lg font-semibold mb-4">Commentaires</h2>
              <p class="text-gray-600">Commentaires à venir...</p>
            </div>
          </TabPanel>

          <TabPanel v-if="canEditEvent && !isEventPast" value="4">
            <div class="p-6">
              <UpdateEvent
                :event="event"
                @event-updated="onEventUpdated"
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
  border-bottom: 1px solid var(--surface-border);
}

:deep(.p-tab) {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

:deep(.p-tab.p-tab-active) {
  border-bottom-color: var(--primary-color);
  color: var(--primary-color);
}

:deep(.p-tab:not(.p-tab-active):hover) {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color-light);
}

:deep(.p-tabpanel) {
  padding: 0;
}
</style>
