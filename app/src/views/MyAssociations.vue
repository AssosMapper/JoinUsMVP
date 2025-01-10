<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import Loader from "@/components/ui/Loader.vue";
import associationService from "@/services/associationService";
import { useNotificationStore } from "@/store/notificationStore";
import type { Association } from "@shared/types/association.ts";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";

const notificationStore = useNotificationStore();
const associations = ref<Association[]>([]);
const isLoading = ref(true);
const router = useRouter();

const getImageSrc = (associationName: string | undefined) => {
  if (!associationName) return "/assets/associations-images/default.png";
  const sanitizedAssociationName = associationName
    .replace(/\s+/g, "")
    .toLowerCase();
  return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

const fetchAssociations = async () => {
  try {
    associations.value = await associationService.getMyAssociations();
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  } finally {
    isLoading.value = false;
  }
};

const navigateToDashboard = (associationId: string) => {
  router.push(`/associations/${associationId}/dashboard`);
};

onMounted(() => {
  fetchAssociations();
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6 pb-4 text-primary border-b-danger">Mes Associations</h1>

    <div v-if="isLoading">
      <Loader />
    </div>

    <div
      v-else-if="associations.length === 0"
      class="text-center p-6 text-gray-600"
    >
      Vous n'êtes membre d'aucune association.
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
    >
      <div
        v-for="association in associations"
        :key="association.id"
        class="flex flex-col bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow border-primary"
        @click="navigateToDashboard(association.id!)"
      >
        <div class="flex items-center p-4 gap-4 border-b-primary">
          <div class="flex-shrink-0">
            <JnsImage
              :name="association.name"
              :src="getImageSrc(association.name)"
              size="md"
            />
          </div>
          <div class="flex-grow flex flex-col text-left items-start min-w-0">
            <h5 class="text-lg font-semibold text-gray-900 w-full">
              {{ association.name }}
            </h5>
            <p class="text-sm text-gray-600 mt-1">
              <i class="pi pi-map-marker mr-1"></i>
              {{ association.localisation }}
            </p>
          </div>
        </div>

        <div class="flex flex-col items-center text-center">
          <p class="text-gray-600 mb-3 line-clamp-2 max-w-prose p-4">
            {{ association.description }}
          </p>
          <div class="flex flex-wrap justify-center gap-2 mb-3 px-4">
            <span
              v-for="type in association.types"
              :key="type.id"
              class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {{ type.name }}
            </span>
          </div>
          <div class="mt-auto p-4 flex justify-center gap-3 border-t-primary w-full">
            <Button @click="navigateToDashboard(association.id!)">
              Accéder au tableau de bord
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
