<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import associationService from '@/services/associationService';
import { Loader } from '@googlemaps/js-api-loader';

const route = useRoute();
const association = ref(null);
const map = ref<google.maps.Map | null>(null);
const marker = ref<google.maps.Marker | null>(null);

const fetchAssociationDetails = async () => {
  try {
    const response = await associationService.getAssociationById(route.params.id);
    association.value = response.data;
    initMap();
  } catch (error) {
    console.error('Error fetching association details:', error);
  }
};

const getImageSrc = (associationName: string) => {
  try {
    return require(`../assets/associations-images/${associationName.replace(/\s+/g, '').toLowerCase()}.png`);
  } catch (e) {
    return require('../assets/associations-images/default.png'); 
  }
};

const initMap = async () => {
  if (!association.value || !association.value.localisation) return;

  const loader = new Loader({
    apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    version: "weekly",
  });

  const google = await loader.load();
  const mapElement = document.getElementById("map") as HTMLElement;
  
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: association.value.localisation }, (results, status) => {
    if (status === "OK" && results && results[0]) {
      const location = results[0].geometry.location;
      map.value = new google.maps.Map(mapElement, {
        center: location,
        zoom: 15,
      });
      
      // Créer une icône personnalisée avec l'image de l'association
      const icon = {
        url: getImageSrc(association.value.name),
        scaledSize: new google.maps.Size(50, 50), // Ajustez la taille selon vos besoins
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
};

onMounted(() => {
  fetchAssociationDetails();
});
</script>

<template>
  <div v-if="association" class="p-6 bg-white rounded-lg shadow-md">
    <div class="flex flex-col md:flex-row w-full">
      <div class="md:w-1/2 pr-4">
        <div class="imageContainer justify-center flex mb-4">
          <img :src="getImageSrc(association.name)" alt="Association Image" class="w-64 h-64" />
        </div>
        <div class="infosContainer">
          <h1 class="text-2xl font-bold mb-4">{{ association.name }}</h1>
          <p class="text-lg mb-2">{{ association.description }}</p>
          <p class="text-lg mb-2">Location: {{ association.localisation }}</p>
          <p class="text-lg mb-2">Created on: {{ new Date(association.dateCreated).toLocaleDateString() }}</p>
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
  <div v-else>
    Loading...
  </div>
</template>

<style scoped>
#map {
  min-height: 300px;
}
</style>