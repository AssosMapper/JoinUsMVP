<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import Loader from "@/components/ui/Loader.vue";
import associationApplicationService from "@/services/associationApplicationService.ts";
import associationService from "@/services/associationService";
import typeAssociationService from "@/services/typeAssociationService";
import { useUserStore } from "@/store";
import { useNotificationStore } from "@/store/notificationStore";
import { Association } from "@shared/types/association";
import { AssociationApplication } from "@shared/types/association-applications";
import { TypeAssociation } from "@shared/types/type-associations";
import { formatFullAddress } from "@shared/utils/address.util";
import { useDebounce } from "@vueuse/core";
import Dropdown from "primevue/dropdown";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getMediaUrl } from "@/utils/media.util";
const router = useRouter();
const notificationStore = useNotificationStore();
const associations = ref<Association[]>([]);
const associationApplications = ref<AssociationApplication[]>([]);
const loader = ref(false);
const userStore = useUserStore();
const joiningAssociation = ref<string | null>(null);
const typeAssociations = ref<TypeAssociation[]>([]);
const search = ref("");
const selectedType = ref<TypeAssociation | null>(null);

const debouncedSearch = useDebounce(search, 300);

const fetchTypeAssociations = async () => {
  try {
    const data = await typeAssociationService.getAllTypeAssociations();
    typeAssociations.value = data;
  } catch (error) {
    console.log(
      "Erreur lors de la récupération des types d'associations:",
      error
    );
  }
};

const fetchAssociations = async () => {
  loader.value = true;
  try {
    const response = await associationService.getAllAssociations();
    associations.value = response;
  } catch (error) {
    console.log("Erreur lors de la récupération des associations:", error);
  } finally {
    loader.value = false;
  }
};

const fetchAssociationApplications = async () => {
  const associationsIds = associations.value.map(
    (association) => association.id
  ) as string[];

  if (associationsIds.length === 0) return;
  loader.value = true;
  try {
    associationApplications.value =
      await associationApplicationService.getApplicationsByAssociations(
        associationsIds
      );
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  } finally {
    loader.value = false;
  }
};

const getApplicationForAssociation = computed(() => (associationId: string) => {
  return associationApplications.value.find(
    (app) => app.associationId === associationId
  );
});
const goToDetails = (id: string) => {
  router.push({ name: "DisplayAssociationDetails", params: { id } });
};
const isLoading = ref(true);
const getImageSrc = (associationName: string) => {
  if (!associationName?.trim())
    return "/assets/associations-images/default.png";
  const sanitizedAssociationName = associationName
    .replace(/\s+/g, "")
    .toLowerCase();
  return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

const joinAssociation = async (associationId: string) => {
  try {
    joiningAssociation.value = associationId;
    await associationApplicationService.joinAssociation({
      associationId,
      applicationAnswer: "", // Pas besoin de réponse pour une association publique
    });
    await userStore.refetchUser();
    notificationStore.showNotification(
      "Vous avez rejoint l'association avec succès",
      "success"
    );
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  } finally {
    joiningAssociation.value = null;
  }
};

onMounted(async () => {
  await fetchTypeAssociations();
  await fetchAssociations();
  await fetchAssociationApplications();
  isLoading.value = false;
});

watch([debouncedSearch, selectedType], fetchAssociations);
</script>

<template>
  <div>
    <div
      class="title-container shadow-[0_4px_6px_-2px_rgba(0,0,0,0.1)] relative z-10 flex justify-center items-center"
    >
      <div class="px-10">
        <h1 class="text-3xl font-bold text-primary italic">Associations</h1>
      </div>
    </div>
    <div v-if="isLoading">
      <Loader />
    </div>
    <div v-else class="pt-4 px-10">
      <div class="pb-4">
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
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-20 pt-2"
        style="max-height: calc(100vh - 12rem)"
      >
        <div
          v-for="association in associations"
          :key="association.id"
          class="flex flex-col bg-white rounded-xl border-primary shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)] transform transition-all duration-200 ease-in-out hover:shadow-[4px_4px_16px_-1px_rgba(0,0,0,0.15),8px_8px_20px_-4px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:bg-primary-hover/5 cursor-pointer"
          @click="goToDetails(association.id)"
        >
          <div class="flex items-center p-4 gap-4 border-b-primary">
            <div class="flex-shrink-0">
              <JnsImage
                :name="association.name || ''"
                :src="getMediaUrl(association.image?.filepath)"
                size="md"
              />
            </div>
            <div class="flex-grow flex flex-col text-left items-start min-w-0">
              <h5 class="text-lg font-semibold text-gray-900 w-full">
                {{ association.name }}
              </h5>
              <p
                v-if="association.localisation"
                class="text-sm text-gray-600 mt-1"
              >
                <i class="pi pi-map-marker mr-1"></i>
                {{ formatFullAddress(association.localisation) }}
              </p>
            </div>
          </div>

          <div class="p-4 flex flex-col items-center text-center">
            <p class="text-gray-600 mb-3 line-clamp-2 max-w-prose">
              {{ association.description }}
            </p>

            <div class="flex flex-wrap justify-center gap-2 mb-3">
              <span
                v-for="type in association.types"
                :key="type.id"
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {{ type.name }}
              </span>
            </div>
          </div>

          <div class="mt-auto p-4 flex justify-center gap-3 border-t-primary">
            <Button
              @click="goToDetails(association.id as string)"
              type="button"
              class="bg-primary text-white"
            >
              En savoir plus
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
