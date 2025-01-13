<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import Loader from "@/components/ui/Loader.vue";
import associationService from "@/services/associationService";
import typeAssociationService from "@/services/typeAssociationService";
import { useNotificationStore } from "@/store/notificationStore";
import type { Association } from "@shared/types/association.ts";
import type { TypeAssociation } from "@shared/types/type-association";
import { useDebounce } from "@vueuse/core";
import Dropdown from "primevue/dropdown";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";

const notificationStore = useNotificationStore();
const associations = ref<Association[]>([]);
const typeAssociations = ref<TypeAssociation[]>([]);
const search = ref("");
const isLoading = ref(true);
const router = useRouter();

const debouncedSearch = useDebounce(search, 300);

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

const fetchTypeAssociations = async () => {
  try {
    const data = await typeAssociationService.getAllTypeAssociations();
    typeAssociations.value = data;
  } catch (error) {
    console.error("Erreur lors de la récupération des types d'associations:", error);
  }
};

onMounted(() => {
  fetchTypeAssociations();
  fetchAssociations();
});
</script>

<template>
  <div class="overflow-x-hidden">
    <div class="title-container 
                shadow-[0_4px_15px_-3px_rgba(0,0,0,0.2)]
                relative z-10 flex justify-center items-center">
      <div class="px-10 ">
        <h1 class="text-3xl font-bold text-primary italic">Mes Associations</h1>
      </div>
    </div>

    <!-- Barre de recherche et filtres -->
    <div class="px-10 py-4 ">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Dropdown
            v-model="selectedType"
            :options="typeAssociations"
            optionLabel="name"
            placeholder="Type d'association"
            :class="[
              'font-semibold',
              selectedType ? 'text-[#168003]' : 'text-gray-600'
            ]"
            :showClear="true"
          />
          <IconField class="w-[400px]">
            <InputIcon class="pi pi-search" :class="search ? 'text-[#168003]' : 'text-gray-600'" />
            <InputText
              v-model="search"
              placeholder="Rechercher une association..."
              class="w-full placeholder:text-gray-600 text-[#168003]"
            />
          </IconField>
        </div>
      </div>
    </div>

    <div v-if="isLoading">
      <Loader />
    </div>

    <div
      v-else-if="associations.length === 0"
      class="text-center p-6 text-gray-600"
    >
      Vous n'êtes membre d'aucune association.
    </div>

    <div v-else class="pt-4 px-10">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-20 pt-2"
        style="max-height: calc(100vh - 12rem);"
      >
        <div
          v-for="association in associations"
          :key="association.id"
          class="flex flex-col bg-white rounded-xl border-primary 
                 shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)]
                 transform transition-all duration-200 ease-in-out
                 hover:shadow-[4px_4px_16px_-1px_rgba(0,0,0,0.15),8px_8px_20px_-4px_rgba(0,0,0,0.2)]
                 hover:-translate-y-1 hover:bg-primary-hover/5
                 cursor-pointer"
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
  </div>
</template>

<style scoped>
.title-container {
  height: 4.5rem;
}
</style>
