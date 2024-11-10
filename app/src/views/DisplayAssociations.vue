<script setup lang="ts">
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import associationService from '@/services/associationService';
import associationApplicationService from "@/services/associationApplicationService.ts";
import {useUserStore} from "@/store";
import AssociationApplicationFormModal from "@/components/AssociationApplication/AssociationApplicationFormModal.vue";
import { Association } from '@/types/association.types';
import { AssociationApplication } from '@/types/association-application.types';
import { useNotificationStore } from '@/store/notificationStore';
import Loader from '@/components/ui/Loader.vue';
import JnsImage from '@/components/ui/JnsImage.vue';

const router = useRouter();
const notificationStore = useNotificationStore();
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
    associationApplications.value = await associationApplicationService.getApplicationsByAssociations(associationsIds);
  } catch (error) {
    notificationStore.showNotification(error.message, "error")
  }finally {
    loader.value = false;
  }
};

const getApplicationForAssociation = computed(() => (associationId: string) => {
  return associationApplications.value.find(app => app.associationId === associationId);
});
const goToDetails = (id: number) => {
  router.push({ name: 'AssociationDetails', params: { id } });
};
const isLoading = ref(true);
const getImageSrc = (associationName: string) => {
  if (!associationName) return '/assets/associations-images/default.png';
  const sanitizedAssociationName = associationName.replace(/\s+/g, '').toLowerCase();
  return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

onBeforeMount(async () => {
  await fetchAssociations();
  await fetchAssociationApplications();
  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading">
    <Loader/>
  </div>
  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    <div v-for="association in associations" 
         :key="association.id" 
         class="flex flex-col bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow">
      
      <div class="flex items-center p-4 gap-4 border-b">
        <div class="flex-shrink-0">
          <JnsImage
            :name="association.name || ''"
            :src="getImageSrc(association.name)"
            size="md"
          />
        </div>
        <div class="flex-grow flex flex-col items-start min-w-0">
          <h5 class="text-xl font-semibold text-gray-900 truncate">
            {{ association.name }}
          </h5>
          <p class="text-sm text-gray-600 mt-1">
            <i class="pi pi-map-marker mr-1"></i>
            {{ association.localisation }}
          </p>
        </div>
      </div>

      <div class="p-4 flex flex-col items-center text-center">
        <p class="text-gray-600 mb-3 line-clamp-2 max-w-prose">
          {{ association.description }}
        </p>
        <p class="text-gray-600 mb-4">
          <i class="pi pi-users mr-1"></i>
          {{ association.members }} membres
        </p>
        <div class="flex flex-wrap justify-center gap-2 mb-3">
          <span v-for="type in association.types" 
                :key="type.id"
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
            {{ type.name }}
          </span>
        </div>
      </div>

      <div class="mt-auto p-4 flex justify-center gap-3 border-t">
        <Button @click="goToDetails(association.id)" type="button">
          En savoir plus
        </Button>
        
        <AssociationApplicationFormModal 
          :applicationQuestion="association.applicationQuestion"
          :associationId="association.id"
          :associationApplication="getApplicationForAssociation(association.id)" 
          v-if="!userStore.getAssociation(association.id)"
        />
      </div>
    </div>
  </div>
</template>

