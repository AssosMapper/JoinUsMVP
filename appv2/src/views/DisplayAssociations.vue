<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import associationService from '@/services/associationService';

const router = useRouter();

const associations = ref([]);
const loader = ref(false);

const fetchAssociations = async () => {
  loader.value = true;
  try {
    associations.value = await associationService.getAllAssociations();
  } catch (error) {
    console.error('Error fetching associations:', error);
  }finally {
    loader.value = false;
  }
};

const goToDetails = (id: number) => {
  router.push({ name: 'AssociationDetails', params: { id } });
};

onMounted(() => {
  fetchAssociations();
});
</script>

<template>
  <div class="associations-container">
    <div v-for="association in associations" :key="association.id" class="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
      <div class="relative flex justify-center h-56 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
        <img src="/assets/associations-images/default.png" alt="card-image" class="height-full" />
      </div>
      <div class="p-6">
        <h5 class="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {{ association.name }}
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          {{ association.description }}
        </p>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          Location: {{ association.localisation }}
        </p>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          Created on: {{ new Date(association.dateCreated).toLocaleDateString() }}
        </p>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          Members: {{ association.members }}
        </p>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          Types: <span v-for="type in association.types" :key="type.id">{{ type.name }}</span>
        </p>
      </div>
      <div class="p-6 pt-0">
        <button @click="goToDetails(association.id)" class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none" type="button">
          Read More
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.associations-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
