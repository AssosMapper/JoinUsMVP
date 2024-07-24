<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import associationService from '@/services/associationService';
import { loadGoogleMapsApi } from '../utils/loadGoogleMapsApi';

const route = useRoute();
const association = ref<any>(null); // Ajustez le type selon votre interface
const map = ref<google.maps.Map | null>(null);
const marker = ref<google.maps.Marker | null>(null);
const loader = ref(false);

const fetchAssociationDetails = async () => {
  loader.value = true;
  try {
    association.value = await associationService.getAssociationById(route.params.id);
    await initMap();
  } catch (error) {
    console.error('Error fetching association details:', error);
  } finally {
    loader.value = false;
  }
};

const initMap = async () => {
  if (!association.value || !association.value.localisation) return;

  try {
    await loadGoogleMapsApi();
    const mapElement = document.getElementById("map") as HTMLElement;

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
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  } catch (error) {
    console.error('Error loading Google Maps API:', error);
  }
};

onMounted(() => {
  fetchAssociationDetails();
});
</script>

<template>
  <div v-if="loader">
    Loading...
  </div>
  <div v-else v-if="association" class="p-6 bg-white rounded-lg shadow-md">
    <div class="flex flex-col md:flex-row w-full">
      <div class="md:w-1/2 pr-4">
        <div class="imageContainer justify-center flex mb-4">
          <img src="/assets/associations-images/default.png" alt="Association Image" class="w-64 h-64" />
        </div>
        <div class="infosContainer">
          <h1 class="text-2xl font-bold mb-4">{{ association.name }}</h1>
          <p class="text-lg mb-2">{{ association.description }}</p>
          <p class="text-lg mb-2">Location: {{ association.localisation }}</p>
          <p class="text-lg mb-2">Created on: {{ new Date(association.createdAt).toLocaleDateString() }}</p>
          <p class="text-lg mb-2">Members: {{ association.members }}</p>
          <p class="text-lg mb-2">
            Types: 
            <span v-for="type in association.types" :key="type.id" class="mr-2">{{ type.name }}</span>
          </p>
        </div>
      </div>
      <div class="md:w-1/2 mt-4 md:mt-0">
        <div id="map" class="w-full h-64 md:h-full rounded-lg"></div>
      </div>
    </div>
  </div>

</template>

<style scoped>
#map {
  min-height: 300px;
}
</style>
