<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import associationService from '@/services/associationService';
import associationApplicationService from "@/services/associationApplicationService.ts";
import {useUserStore} from "@/store";
import AssociationApplicationFormModal from "@/components/AssociationApplication/AssociationApplicationFormModal.vue";
import { Association } from '@/types/association.types';
import { AssociationApplication } from '@/types/association-application.types';

const router = useRouter();

const associations = ref<Association[]>([]);
const associationApplications = ref<AssociationApplication[]>([]);
const loader = ref(false);
const userStore = useUserStore();
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

const fetchAssociationApplications = async ()  => {
  loader.value = true;
  const associationsIds = associations.value.map(association => association.id);

  try {
    associationApplications.value = await associationApplicationService.getApplicationsByAssociations(associationsIds);;
  } catch (error) {
    console.error('Error fetching association applications:', error);
  }finally {
    loader.value = false;
  }
};
const goToDetails = (id: number) => {
  router.push({ name: 'AssociationDetails', params: { id } });
};

const getImageSrc = (associationName: string) => {
  if (!associationName) return '/assets/associations-images/default.png';
  const sanitizedAssociationName = associationName.replace(/\s+/g, '').toLowerCase();
  return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

onMounted(async () => {
  await fetchAssociations();
  await fetchAssociationApplications();
});
</script>

<template>
  <div class="associations-container">
    <div v-for="association in associations" :key="association.id" class="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
      <div class="relative flex justify-center h-56 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
        <img :src=getImageSrc(association.name) alt="Association Image" class="w-64 h-64 object-cover rounded-lg" />
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
          Created on: {{ new Date(association.createdAt).toLocaleDateString() }}
        </p>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          Members: {{ association.members }}
        </p>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          Types: <span v-for="type in association.types" :key="type.id">{{ type.name }}</span>
        </p>
      </div>

      <div class="p-6 pt-0 flex flex-row justify-center gap-3 items-center">
        <Button @click="goToDetails(association.id)"  type="button">
          En savoir plus
        </Button>
          
          <AssociationApplicationFormModal 
            :applicationQuestion="association.applicationQuestion"
            :associationId="association.id"
            :associationApplication="associationApplications.find(application => application.associationId === association.id)" 
            v-if="!userStore.getAssociation(association.id)"
            />

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
