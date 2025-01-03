<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import Loader from "@/components/ui/Loader.vue";
import associationService from "@/services/associationService";
import { useNotificationStore } from "@/store/notificationStore";
import type { Association } from "@shared/types/association.ts";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

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
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Mes Associations</h1>

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
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
    >
      <div
        v-for="association in associations"
        :key="association.id"
        class="flex bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateToDashboard(association.id!)"
      >
        <div class="flex-shrink-0">
          <JnsImage
            :name="association.name"
            :src="getImageSrc(association.name)"
            size="md"
          />
        </div>

        <div class="ml-4 flex flex-col justify-center">
          <h5 class="text-lg font-semibold text-gray-900">
            {{ association.name }}
          </h5>
          <p class="text-sm text-gray-600 mt-1">
            <i class="pi pi-map-marker mr-1"></i>
            {{ association.localisation }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
