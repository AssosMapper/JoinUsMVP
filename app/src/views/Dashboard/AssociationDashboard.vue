<script setup lang="ts">
import AssociationMembers from "@/components/AssociationDashboard/AssociationMembers.vue";
import ManageAssociationApplications from "@/components/AssociationDashboard/ManageAssociationApplications.vue";
import JnsImage from "@/components/ui/JnsImage.vue";
import Loader from "@/components/ui/Loader.vue";
import associationService from "@/services/associationService";
import eventService from "@/services/eventService";
import mediaService from "@/services/mediaService";
import { useNotificationStore } from "@/store/notificationStore";
import { useUserStore } from "@/store/userStore";
import { canManageAssociation } from "@/utils/check-role";
import type { PublicAssociationDto } from "@shared/dto/associations.dto";
import { User } from "@shared/types";
import type { Media } from "@shared/types/media";
import ConfirmDialog from "primevue/confirmdialog";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import Tabs from "primevue/tabs";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const association = ref<PublicAssociationDto | null>(null);
const events = ref([]);
const isLoading = ref(true);
const activeTab = ref("0");

const canManageApplications = computed(() =>
  canManageAssociation(userStore.user as User, route.params.id as string)
);

const loadAssociation = async () => {
  try {
    const result = await associationService.getAssociationById(
      route.params.id as string
    );
    association.value = result;
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  }
};

const fetchEvents = async () => {
  try {
    if (association.value?.id) {
      events.value = await eventService.getEventsByAssociationId(
        association.value.id,
        100
      );
    }
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  }
};

onMounted(async () => {
  try {
    await loadAssociation();
    await fetchEvents();
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
      <div class="flex items-center space-x-6 bg-primary-hover p-6 rounded-lg">
        <JnsImage
          :name="association.name"
          :src="mediaService.getMediaUrl(association.image as Media)"
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
        <Tabs scrollable v-model:value="activeTab" :lazy="true">
          <TabList>
            <Tab value="0">Informations</Tab>
            <Tab value="1">Membres</Tab>
            <Tab value="2">Évènements</Tab>
            <Tab v-if="canManageApplications" value="3">
              Gérer les candidatures
            </Tab>
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

            <TabPanel value="2">
              <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-6">
                  Évènements de l'association
                </h2>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <div
                    @click="router.push(`/displayEvent/${event.id}`)"
                    v-for="event in events"
                    :key="event.id"
                    class="bg-white border cursor-pointer border-gray-200 rounded-lg shadow hover:shadow-lg transition-all duration-300"
                  >
                    <JnsImage
                      :name="event.titre"
                      :src="event.image || '/default-event.jpg'"
                      size="lg"
                      :rounded="false"
                      class="w-full h-48"
                    />
                    <div class="p-5">
                      <div class="flex justify-between items-start mb-4">
                        <h3
                          class="text-xl font-bold tracking-tight text-gray-900"
                        >
                          {{ event.titre }}
                        </h3>
                        <span class="text-sm text-gray-500">{{
                          event.type
                        }}</span>
                      </div>
                      <p class="mb-3 font-normal text-gray-700">
                        {{ event.description }}
                      </p>
                      <div class="flex items-center text-sm text-gray-500">
                        <i class="pi pi-calendar mr-2"></i>
                        <time>{{
                          new Date(event.date).toLocaleDateString()
                        }}</time>
                        <i class="pi pi-map-marker ml-4 mr-2"></i>
                        <span>{{ event.location }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel v-if="canManageApplications" value="3">
              <ManageAssociationApplications
                :associationId="route.params.id as string"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>

  <ConfirmDialog />
</template>
