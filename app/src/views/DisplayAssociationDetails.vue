<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import associationService from '@/services/associationService';

const route = useRoute();
const association = ref(null);

const fetchAssociationDetails = async () => {
  try {
    const response = await associationService.getAssociationById(route.params.id);
    association.value = response.data;
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

onMounted(() => {
  fetchAssociationDetails();
});
</script>

<template>
  <div v-if="association" class="p-6 bg-white rounded-lg shadow-md">
    <div class="flex justify-center flex-col md:flex-row w-full">
        <div class="imageContainer justify-center flex md:w-40 w-full">
            <img :src="getImageSrc(association.name)" alt="Association Image" class="w-64 h-64 mb-4" />
        </div>
        <div class="infosContainer w-inherit">
            <h1 class="text-2xl font-bold mb-4">{{ association.name }}</h1>
            <p class="text-lg">{{ association.description }}</p>
            <p class="text-lg">Location: {{ association.localisation }}</p>
            <p class="text-lg">Created on: {{ new Date(association.dateCreated).toLocaleDateString() }}</p>
            <p class="text-lg">Members: {{ association.members }}</p>
            <p class="text-lg">Types: 
            <span v-for="type in association.types" :key="type.id">{{ type.name }}</span>
            </p>
        </div>
    </div>

  </div>
  <div v-else>
    Loading...
  </div>
</template>

<style scoped>
.w-inherit{
    width: inherit;
}

.w-40{
    width: 40%
}
</style>
