<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
<<<<<<< HEAD
=======
import {useUserStore} from "@/store";
import type { Event } from "@shared/types/event";
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
import associationService from '@/services/associationService';
import eventService from '@/services/eventService';
import { loadGoogleMapsApi } from '@/utils/loadGoogleMapsApi';
import EventList from '@/components/EventsList.vue';
<<<<<<< HEAD
import Loader from '@/components/Loader.vue';

const route = useRoute();
const association = ref<any>(null);
const map = ref<google.maps.Map | null>(null);
const marker = ref<google.maps.Marker | null>(null);
const pastEvents = ref<any[]>([]);
const todayEvents = ref<any[]>([]);
const upcomingEvents = ref<any[]>([]);
const loader = ref(false);

=======
import Loader from '@/components/ui/Loader.vue';
import { AssociationApplication } from '@shared/types/association-applications';
import associationApplicationService from '@/services/associationApplicationService';
import JnsImage from '@/components/ui/JnsImage.vue';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';

const route = useRoute();
const userStore = useUserStore();
const association = ref<any>(null);
const map = ref<google.maps.Map | null>(null);
const marker = ref<google.maps.Marker | null>(null);
const pastEvents = ref<Event[]>([]);
const todayEvents = ref<Event[]>([]);
const upcomingEvents = ref<Event[]>([]);
const loader = ref(false);
const associationApplication = ref<AssociationApplication | null>(null);
const activeTab = ref(0);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
const fetchAssociationDetails = async () => {
  loader.value = true;
  try {
    association.value = await associationService.getAssociationById(route.params.id as string);
<<<<<<< HEAD
    const events = await eventService.getEventsByAssociationId(association.value.id, 5);
    pastEvents.value = events.pastEvents;
    todayEvents.value = events.todayEvents;
    upcomingEvents.value = events.upcomingEvents;
=======
    console.log('Association:', association.value);
    const events = await eventService.getEventsByAssociationId(association.value.id, 100);
    console.log('Events received:', events);
    // Trier les événements par date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    pastEvents.value = events.filter((event: Event) => new Date(event.date) < today);
    todayEvents.value = events.filter((event: Event) => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === today.getFullYear() &&
             eventDate.getMonth() === today.getMonth() &&
             eventDate.getDate() === today.getDate();
    });
    upcomingEvents.value = events.filter((event: Event) => new Date(event.date) > today);

    console.log('Events split:', {
      past: pastEvents.value,
      today: todayEvents.value,
      upcoming: upcomingEvents.value
    });
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    await nextTick(); // Ensure DOM is rendered before initializing the map
    await initMap();
  } catch (error) {
    console.error('Error fetching association details:', error);
  } finally {
    loader.value = false;
  }
};

const getImageSrc = (associationName: string) => {
  if (!associationName) return '/assets/associations-images/default.png';
  const sanitizedAssociationName = associationName.replace(/\s+/g, '').toLowerCase();
  return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

const initMap = async () => {
  if (!association.value || !association.value.localisation) return;

  try {

<<<<<<< HEAD
    await loadGoogleMapsApi();
=======
    await loadGoogleMapsApi(import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    const mapElement = document.getElementById("map") as HTMLElement;
    
    if (!mapElement) {
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: association.value.localisation }, (results, status) => {
      if (status === "OK" && results && results[0]) {
<<<<<<< HEAD
        const location = results[0].geometry.location;
=======
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        map.value = new google.maps.Map(mapElement, {
          center: location,
          zoom: 15,
        });

        const icon = {
          url: "/assets/associations-images/default.png",
          scaledSize: new google.maps.Size(50, 50),
<<<<<<< HEAD
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(25, 25)
=======
          origin: { x: 0, y: 0 },
          anchor: { x: 25, y: 25 }
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        };

        marker.value = new google.maps.Marker({
          map: map.value,
          position: location,
          title: association.value.name,
          icon: icon
        });
      } else {
      }
    });
  } catch (error) {
    console.error('Error loading Google Maps API:', error);
  }
};

<<<<<<< HEAD
onMounted(() => {
  fetchAssociationDetails();
=======
const fetchAssociationApplication = async () => {
  if (!association.value?.id) return;
  
  try {
    associationApplication.value = await associationApplicationService.getCurrentApplication(association.value.id) as AssociationApplication;
  } catch (error: any) {
    if (error?.statusCode !== 404) {
      console.error('Error fetching association application:', error);
    }
  }
}

onMounted(async () => {
  await fetchAssociationDetails();
  await fetchAssociationApplication();
  loader.value = false;
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
});
</script>

<template>
  <Loader v-if="loader" />
<<<<<<< HEAD
  <div v-if="association" class="p-6 bg-white rounded-lg shadow-md">
    <div class="flex flex-col md:flex-row w-full">
      <div class="md:w-1/2 pr-4">
        <div class="imageContainer justify-center flex mb-4">
          <img :src=getImageSrc(association.name) alt="Association Image" class="w-64 h-64 object-cover rounded-lg" />
        </div>
        <div class="infosContainer">
          <h1 class="text-2xl font-bold mb-4">{{ association.name }}</h1>
          <p class="text-lg mb-2">{{ association.description }}</p>
          <p class="text-lg mb-2">Location: {{ association.localisation }}</p>
          <p class="text-lg mb-2">Created on: {{ new Date(association.createdAt).toLocaleDateString() }}</p>
          <p class="text-lg mb-2">Members: {{ association.members }}</p>
          <p class="text-lg mb-2">
            Types: 
            <span v-for="type in association.types" :key="type.id" class="mr-2 inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{{ type.name }}</span>
          </p>
        </div>
      </div>
      <div class="md:w-1/2 mt-4 md:mt-0">
        <div id="map" class="w-full h-64 md:h-full rounded-lg"></div>
      </div>
    </div>
    <EventList title="Today's Events" :events="todayEvents" />
    <EventList title="Past Events" :events="pastEvents" />
    <EventList title="Upcoming Events" :events="upcomingEvents" />
=======
  <div v-if="association" class="p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-6 bg-primary/10 p-6 rounded-lg">
        <div class="flex-shrink-0">
          <JnsImage
            :name="association.name"
            :src="getImageSrc(association.name)"
            size="lg"
          />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ association.name }}
          </h1>
          <p class="text-gray-600 mt-2">
            <i class="pi pi-map-marker mr-1"></i>
            {{ association.localisation }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="card">
        <Tabs scrollable v-model:value="activeTab" :lazy="true">
          <TabList>
            <Tab value="0">Informations</Tab>
            <Tab value="1">Carte</Tab>
            <Tab value="2">Événements du jour</Tab>
            <Tab value="3">Événements passés</Tab>
            <Tab value="4">Événements à venir</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="0">
              <div class="bg-white rounded-lg shadow p-6">
                <div class="space-y-4">
                  <p class="text-lg">{{ association.description }}</p>
                  <p class="text-gray-600">Créée le: {{ new Date(association.createdAt).toLocaleDateString() }}</p>
                  <p class="text-gray-600">Membres: {{ association.members }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="type in association.types" :key="type.id" 
                          class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {{ type.name }}
                    </span>
                  </div>
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
                <div id="map" class="w-full h-[600px] rounded-lg"></div>
              </div>
            </TabPanel>

            <TabPanel value="2">
              <div class="bg-white rounded-lg shadow p-6">
                <EventList 
                  :events="todayEvents"
                  :loading="loader"
                  :current-month-year="new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })"
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
                  :current-month-year="new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })"
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
                  :current-month-year="new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })"
                  :fetch-more="async () => {}"
                  :has-more="false"
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  </div>
</template>

<style scoped>
#map {
  min-height: 300px;
}
</style>
