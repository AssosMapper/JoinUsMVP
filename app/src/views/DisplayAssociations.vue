<script setup lang="ts">
<<<<<<< HEAD
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import associationService from '@/services/associationService';

const router = useRouter();

const associations = ref([]);
const loader = ref(false);
=======
import AssociationApplicationFormModal from "@/components/AssociationApplication/AssociationApplicationFormModal.vue";
import JnsImage from "@/components/ui/JnsImage.vue";
import Loader from "@/components/ui/Loader.vue";
import associationApplicationService from "@/services/associationApplicationService.ts";
import associationService from "@/services/associationService";
import { useUserStore } from "@/store";
import { useNotificationStore } from "@/store/notificationStore";
import { Association } from "@shared/types/association";
import { AssociationApplication } from "@shared/types/association-applications";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const notificationStore = useNotificationStore();
const associations = ref<Association[]>([]);
const associationApplications = ref<AssociationApplication[]>([]);
const loader = ref(false);
const userStore = useUserStore();
const joiningAssociation = ref<string | null>(null);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

const fetchAssociations = async () => {
  loader.value = true;
  try {
    associations.value = await associationService.getAllAssociations();
  } catch (error) {
<<<<<<< HEAD
    console.error('Error fetching associations:', error);
  }finally {
=======
    console.error("Error fetching associations:", error);
  } finally {
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    loader.value = false;
  }
};

<<<<<<< HEAD
const goToDetails = (id: number) => {
  router.push({ name: 'AssociationDetails', params: { id } });
};

const getImageSrc = (associationName: string) => {
  if (!associationName) return '/assets/associations-images/default.png';
  const sanitizedAssociationName = associationName.replace(/\s+/g, '').toLowerCase();
  return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

onMounted(() => {
  fetchAssociations();
=======
const fetchAssociationApplications = async () => {
  loader.value = true;
  const associationsIds = associations.value.map(
    (association) => association.id
  ) as string[];

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
  router.push({ name: "AssociationDetails", params: { id } });
};
const isLoading = ref(true);
const getImageSrc = (associationName: string) => {
  if (!associationName?.trim()) return "/assets/associations-images/default.png";
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
  await fetchAssociations();
  await fetchAssociationApplications();
  isLoading.value = false;
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
});
</script>

<template>
<<<<<<< HEAD
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
      <div class="p-6 pt-0">
        <button @click="goToDetails(association.id)" class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none" type="button">
          Read More
        </button>
=======
  <div v-if="isLoading">
    <Loader />
  </div>
  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    <div
      v-for="association in associations"
      :key="association.id"
      class="flex flex-col bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow"
    >
      <div class="flex items-center p-4 gap-4 border-b">
        <div class="flex-shrink-0">
          <JnsImage
            :name="association.name || ''"
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

      <div class="mt-auto p-4 flex justify-center gap-3 border-t">
        <Button @click="goToDetails(association.id as string)" type="button">
          En savoir plus
        </Button>

        <template v-if="!userStore.getAssociation(association.id)">
          <Button
            v-if="association.isPublic"
            @click="joinAssociation(association.id)"
            :loading="joiningAssociation === association.id"
          >
            Rejoindre
          </Button>

          <AssociationApplicationFormModal
            v-else
            :applicationQuestion="association.applicationQuestion"
            :associationId="association.id"
            :associationApplication="
              getApplicationForAssociation(association.id)
            "
          />
        </template>
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      </div>
    </div>
  </div>
</template>
<<<<<<< HEAD

<style scoped>
.associations-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
=======
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
