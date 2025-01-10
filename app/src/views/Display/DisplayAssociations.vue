<script setup lang="ts">
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

const fetchAssociations = async () => {
  loader.value = true;
  try {
    associations.value = await associationService.getAllAssociations();
  } catch (error) {
    console.error("Error fetching associations:", error);
  } finally {
    loader.value = false;
  }
};

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
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold border-b-danger pb-4 text-primary">Associations</h1>
    <div v-if="isLoading">
      <Loader />
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div
        v-for="association in associations"
        :key="association.id"
        class="flex flex-col bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow border-primary"
      >
        <div class="flex items-center p-4 gap-4 border-b-primary">
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

        <div class="mt-auto p-4 flex justify-center gap-3 border-t-primary">
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
        </div>
      </div>
    </div>
  </div>
</template>
