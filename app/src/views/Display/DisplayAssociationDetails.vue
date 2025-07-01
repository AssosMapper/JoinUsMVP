<script setup lang="ts">
import AssociationApplicationFormModal from "@/components/AssociationApplication/AssociationApplicationFormModal.vue";
import EventList from "@/components/EventsList.vue";
import EventMap from "@/components/EventMap.vue";
import JnsImage from "@/components/ui/JnsImage.vue";
import Loader from "@/components/ui/Loader.vue";
import associationApplicationService from "@/services/associationApplicationService";
import associationService from "@/services/associationService";
import eventService from "@/services/eventService";
import { useUserStore } from "@/store";
import type { EventMapType } from "@/types/map.types";
import { AssociationApplication } from "@shared/types/association-applications";
import type { Event } from "@shared/types/event";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import Tabs from "primevue/tabs";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const userStore = useUserStore();
const association = ref<any>(null);
const pastEvents = ref<Event[]>([]);
const todayEvents = ref<Event[]>([]);
const upcomingEvents = ref<Event[]>([]);
const loader = ref(false);
const associationApplication = ref<AssociationApplication | null>(null);
const activeTab = ref("0");

// Computed pour convertir les événements au format EventMapType
const eventsForMap = computed<EventMapType[]>(() => {
  const allEvents = [
    ...pastEvents.value,
    ...todayEvents.value,
    ...upcomingEvents.value,
  ];
  return allEvents.map((event) => ({
    id: event.id,
    titre: event.titre,
    description: event.description,
    localisation: event.localisation,
    date:
      typeof event.date === "string" ? event.date : event.date.toISOString(),
    association: event.association
      ? {
          id: event.association.id,
          name: event.association.name,
          image:
            typeof event.association.image === "string"
              ? event.association.image
              : event.association.image?.filename,
        }
      : undefined,
    typeEvent: event.typeEvent
      ? {
          name: event.typeEvent.name,
        }
      : undefined,
  }));
});

// Centre de la carte basé sur la localisation de l'association
const mapCenter = computed(() => {
  // Paris par défaut, sera mis à jour par géocodage si nécessaire
  return { lat: 48.8566, lng: 2.3522 };
});

const fetchAssociationDetails = async () => {
  try {
    association.value = await associationService.getAssociationById(
      route.params.id as string
    );
    console.log("Association:", association.value);
    const events = await eventService.getEventsByAssociationId(
      association.value.id,
      100
    );
    console.log("Events received:", events);
    // Trier les événements par date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    pastEvents.value = events.filter(
      (event: Event) => new Date(event.date) < today
    );
    todayEvents.value = events.filter((event: Event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === today.getFullYear() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getDate() === today.getDate()
      );
    });
    upcomingEvents.value = events.filter(
      (event: Event) => new Date(event.date) > today
    );

    console.log("Events split:", {
      past: pastEvents.value,
      today: todayEvents.value,
      upcoming: upcomingEvents.value,
    });
  } catch (error) {
    console.error("Error fetching association details:", error);
  }
};

const getImageSrc = (associationName: string) => {
  if (!associationName) return "/assets/associations-images/default.png";
  const sanitizedAssociationName = associationName
    .replace(/\s+/g, "")
    .toLowerCase();
  return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

const fetchAssociationApplication = async () => {
  if (!association.value?.id) return;

  try {
    associationApplication.value =
      (await associationApplicationService.getCurrentApplication(
        association.value.id
      )) as AssociationApplication;
  } catch (error: any) {
    if (error?.statusCode !== 404)
      console.error("Error fetching association application:", error);
  }
};

const onEventClick = (event: EventMapType) => {
  console.log("Event clicked:", event);
};

onMounted(async () => {
  loader.value = true;
  await fetchAssociationDetails();
  await fetchAssociationApplication();
  loader.value = false;
});
</script>

<template>
  <Loader v-if="loader" />
  <div v-if="association" class="p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-6 bg-primary-hover p-6 rounded-lg">
        <div class="flex-shrink-0">
          <JnsImage
            :name="association.name"
            :src="getImageSrc(association.name)"
            size="lg"
          />
        </div>
        <div class="flex flex-col items-start">
          <div class="flex items-center gap-2 mb-2">
            <span
              v-for="type in association.types"
              :key="type.id"
              class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {{ type.name }}
            </span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ association.name }}
          </h1>
          <div class="text-gray-600 flex items-center mt-2 ml-[2px]">
            <i class="pi pi-map-marker mr-1"></i>
            {{ association.localisation }}
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="card">
        <Tabs scrollable v-model:value="activeTab" :lazy="true">
          <TabList>
            <Tab value="0" class="p-tab">Informations</Tab>
            <Tab value="1" class="p-tab">Carte</Tab>
            <Tab value="2" class="p-tab">Événements du jour</Tab>
            <Tab value="3" class="p-tab">Événements passés</Tab>
            <Tab value="4" class="p-tab">Événements à venir</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="0">
              <div class="bg-white rounded-lg shadow p-6">
                <div class="space-y-4">
                  <p class="text-lg">{{ association.description }}</p>
                  <p class="text-gray-600">
                    Créée le:
                    {{ new Date(association.createdAt).toLocaleDateString() }}
                  </p>
                  <p class="text-gray-600">
                    Membres: {{ association.members }}
                  </p>
                  <AssociationApplicationFormModal
                    v-if="!userStore.getAssociation(association.id)"
                    :applicationQuestion="association.applicationQuestion"
                    :associationId="association.id"
                    :associationApplication="associationApplication"
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel value="1">
              <div class="bg-white rounded-lg shadow p-6">
                <EventMap
                  :events="eventsForMap"
                  :center="mapCenter"
                  height="600px"
                  @event-click="onEventClick"
                />
              </div>
            </TabPanel>

            <TabPanel value="2">
              <div class="bg-white rounded-lg shadow p-6">
                <EventList
                  :events="todayEvents"
                  :loading="loader"
                  :current-month-year="
                    new Date().toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    })
                  "
                  :fetch-more="async () => {}"
                  :has-more="false"
                />
              </div>
            </TabPanel>

            <TabPanel value="3">
              <div class="bg-white rounded-lg shadow p-6">
                <EventList
                  :events="pastEvents"
                  :loading="loader"
                  :current-month-year="
                    new Date().toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    })
                  "
                  :fetch-more="async () => {}"
                  :has-more="false"
                />
              </div>
            </TabPanel>

            <TabPanel value="4">
              <div class="bg-white rounded-lg shadow p-6">
                <EventList
                  :events="upcomingEvents"
                  :loading="loader"
                  :current-month-year="
                    new Date().toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    })
                  "
                  :fetch-more="async () => {}"
                  :has-more="false"
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<style scoped>
#map {
  min-height: 300px;
}
</style>
