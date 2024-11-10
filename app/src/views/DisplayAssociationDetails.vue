<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import {useUserStore} from "@/store";
import associationService from '@/services/associationService';
import eventService from '@/services/eventService';
import { loadGoogleMapsApi } from '@/utils/loadGoogleMapsApi';
import EventList from '@/components/EventsList.vue';
import Loader from '@/components/Loader.vue';
import { AssociationApplication } from '@shared/types/association-applications';
import associationApplicationService from '@/services/associationApplicationService';
import JnsImage from '@/components/ui/JnsImage.vue';

const route = useRoute();
const userStore = useUserStore();
const association = ref<any>(null);
const map = ref<google.maps.Map | null>(null);
const marker = ref<google.maps.Marker | null>(null);
const pastEvents = ref<any[]>([]);
const todayEvents = ref<any[]>([]);
const upcomingEvents = ref<any[]>([]);
const loader = ref(false);
const associationApplication = ref<AssociationApplication | null>(null);
const fetchAssociationDetails = async () => {
  loader.value = true;
  try {
    association.value = await associationService.getAssociationById(route.params.id as string);
    const events = await eventService.getEventsByAssociationId(association.value.id, 5);
    pastEvents.value = events.pastEvents;
    todayEvents.value = events.todayEvents;
    upcomingEvents.value = events.upcomingEvents;
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

    await loadGoogleMapsApi();
    const mapElement = document.getElementById("map") as HTMLElement;
    
    if (!mapElement) {
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: association.value.localisation }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        map.value = new google.maps.Map(mapElement, {
          center: location,
          zoom: 15,
        });

        const icon = {
          url: "/assets/associations-images/default.png",
          scaledSize: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(25, 25)
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

const fetchAssociationApplication = async () => {
   try {
      associationApplication.value = await associationApplicationService.getCurrentApplication(association.value.id) as AssociationApplication;
   } catch (error) {
      console.error('Error fetching association application:', error);
   }
}

onMounted(async () => {
  await fetchAssociationDetails();
  await fetchAssociationApplication();
  loader.value = false;
});
</script>

<template>
  <Loader v-if="loader" />
  <div v-if="association" class="p-6 bg-white rounded-lg shadow-md">
    <div class="flex flex-col md:flex-row w-full">
      <div class="md:w-1/2 pr-4">
        <div class="imageContainer justify-center flex mb-4">
          <JnsImage
            :name="association.name"
            :src="getImageSrc(association.name)"
            size="lg"
          />
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
          <AssociationApplicationFormModal 
            :applicationQuestion="association.applicationQuestion"
            :associationId="association.id"
            :associationApplication="associationApplication" 
            v-if="!userStore.getAssociation(association.id)"
            />

        </div>
      </div>
      <div class="md:w-1/2 mt-4 md:mt-0">
        <div id="map" class="w-full h-64 md:h-full rounded-lg"></div>
      </div>
    </div>
    <EventList title="Today's Events" :events="todayEvents" />
    <EventList title="Past Events" :events="pastEvents" />
    <EventList title="Upcoming Events" :events="upcomingEvents" />
  </div>
</template>

<style scoped>
#map {
  min-height: 300px;
}
</style>
