<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import Loader from "@/components/ui/Loader.vue";
import associationService from "@/services/associationService";
import typeAssociationService from "@/services/typeAssociationService";
import { useNotificationStore } from "@/store/notificationStore";
import { useUserStore } from "@/store/userStore";
import type { Association } from "@shared/types/association.ts";
import type { TypeAssociation } from "@shared/types/type-associations";
import { formatFullAddress } from "@shared/utils/address.util";
import { useDebounce } from "@vueuse/core";
import Dropdown from "primevue/dropdown";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import { getMediaUrl } from "@/utils/media.util";
import { Localisation } from "@shared/types/localisation";

const notificationStore = useNotificationStore();
const userStore = useUserStore();
const associations = ref<Association[]>([]);
const typeAssociations = ref<TypeAssociation[]>([]);
const selectedType = ref<TypeAssociation | null>(null);
const search = ref("");
const isLoading = ref(true);
const router = useRouter();

const debouncedSearch = useDebounce(search, 300);

const fetchAssociations = async () => {
  try {
    associations.value = await associationService.getMyAssociations();
    // Mettre à jour le userStore avec les associations récupérées
    await userStore.updateMyAssociations(associations.value);
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
    console.error(
      "Erreur lors de la récupération des types d'associations:",
      error
    );
  }
};

onMounted(() => {
  fetchTypeAssociations();
  fetchAssociations();
});
</script>

<template>
  <div class="overflow-x-hidden">
    <div
      class="title-container shadow-[0_4px_15px_-3px_rgba(0,0,0,0.2)] relative z-10 flex justify-center items-center"
    >
      <div class="px-10">
        <h1 class="text-3xl font-bold text-primary italic">Mes Associations</h1>
      </div>
    </div>

    <!-- Barre de recherche et filtres -->
    <div v-if="false" class="px-10 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Dropdown
            v-model="selectedType"
            :options="typeAssociations"
            optionLabel="name"
            placeholder="Type d'association"
            :class="[
              'font-semibold',
              selectedType ? 'text-[#168003]' : 'text-gray-600',
            ]"
            :showClear="true"
          />
          <IconField class="w-[400px]">
            <InputIcon
              class="pi pi-search"
              :class="search ? 'text-[#168003]' : 'text-gray-600'"
            />
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
        style="max-height: calc(100vh - 12rem)"
      >
        <div
          v-for="association in associations"
          :key="association.id"
          class="flex flex-col h-full bg-white rounded-xl border-primary shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)] transform transition-all duration-200 ease-in-out hover:shadow-[4px_4px_16px_-1px_rgba(0,0,0,0.15),8px_8px_20px_-4px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:bg-primary-hover/5 cursor-pointer"
          @click="navigateToDashboard(association.id!)"
        >
          <!-- En-tête avec image et informations -->
          <div class="flex items-center p-4 gap-4 border-b border-gray-200">
            <div class="flex-shrink-0">
              <JnsImage
                :name="association.name"
                :src="getMediaUrl(association.image?.filepath)"
                size="md"
              />
            </div>
            <div class="flex-grow flex flex-col text-left items-start min-w-0">
              <h5 class="text-lg font-semibold text-gray-900 w-full truncate">
                {{ association.name }}
              </h5>
              <p
                v-if="association.localisation"
                class="text-sm text-gray-600 mt-1 w-full truncate"
                :title="formatFullAddress(association.localisation as Localisation)"
              >
                <i class="pi pi-map-marker mr-1"></i>
                {{
                  formatFullAddress(association.localisation as Localisation)
                }}
              </p>
            </div>
          </div>

          <!-- Contenu principal avec tags uniquement -->
          <div class="flex flex-col flex-grow px-4 py-2 justify-center">
            <!-- Tags -->
            <div class="flex flex-wrap justify-center items-center gap-2">
              <template v-if="association.types && association.types.length > 0">
                <span
                  v-for="type in association.types"
                  :key="type.id"
                  class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {{ type.name }}
                </span>
              </template>
              <span
                v-else
                class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                Autre
              </span>
            </div>
          </div>

          <!-- Footer avec bouton aligné -->
          <div class="mt-auto p-3 border-t border-gray-200">
            <Button
              class="w-full bg-primary text-white justify-center"
              @click="navigateToDashboard(association.id!)"
            >
              Accéder au tableau de bord
            </Button>
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
