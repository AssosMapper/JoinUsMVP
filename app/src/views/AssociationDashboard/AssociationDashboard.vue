<script setup lang="ts">
import AssociationMembers from "@/components/AssociationDashboard/AssociationMembers.vue";
import ManageAssociationApplications from "@/components/AssociationDashboard/ManageAssociationApplications.vue";
import JnsImage from "@/components/ui/JnsImage.vue";
import Loader from "@/components/ui/Loader.vue";
import associationService from "@/services/associationService";
import { useNotificationStore } from "@/store/notificationStore";
import { useUserStore } from "@/store/userStore";
import { canManageAssociation } from "@/utils/check-role";
import { User } from "@shared/types";
import type { Association } from "@shared/types/association";
import ConfirmDialog from "primevue/confirmdialog";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import Tabs from "primevue/tabs";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const association = ref<Association | null>(null);
const isLoading = ref(true);
const activeTab = ref("0");

const canManageApplications = computed(() =>
  canManageAssociation(userStore.user as User, route.params.id as string)
);

const getImageSrc = (associationName: string | undefined) => {
  if (!associationName) return "/assets/associations-images/default.png";
  const sanitizedAssociationName = associationName
    .replace(/\s+/g, "")
    .toLowerCase();
  return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

const loadAssociation = async () => {
  try {
    association.value = await associationService.getAssociationById(
      route.params.id as string
    );
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  }
};

onMounted(async () => {
  try {
    await loadAssociation();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="p-6">
    <div v-if="isLoading">
      <Loader />
    </div>

    <div v-else-if="association" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-6 bg-primary/10 p-6 rounded-lg">
        <JnsImage
          :name="association.name"
          :src="getImageSrc(association.name)"
          size="lg"
        />
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ association.name }}
          </h1>
          <p class="text-gray-600 mt-2">
            <i class="pi pi-map-marker mr-1"></i>
            {{ association.localisation }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="card">
        <Tabs v-model:value="activeTab" :lazy="true">
          <TabList>
            <Tab value="0">Informations</Tab>
            <Tab value="1">Membres</Tab>
            <Tab v-if="canManageApplications" value="2"
              >Gérer les candidatures</Tab
            >
          </TabList>

          <TabPanels>
            <TabPanel value="0">
              <div class="p-4 bg-white rounded-lg shadow">
                <h3 class="text-xl font-semibold mb-4">À propos</h3>
                <p class="text-gray-600">{{ association.description }}</p>
              </div>
            </TabPanel>

            <TabPanel value="1">
              <AssociationMembers
                :associationId="route.params.id as string"
                :canManageApplications="canManageApplications"
              />
            </TabPanel>

            <TabPanel v-if="canManageApplications" value="2">
              <ManageAssociationApplications :associationId="association.id!" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>

  <ConfirmDialog />
</template>
