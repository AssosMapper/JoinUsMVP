<script setup lang="ts">
import AssociationMembers from "@/components/AssociationDashboard/AssociationMembers.vue";
import ManageAssociationApplications from "@/components/AssociationDashboard/ManageAssociationApplications.vue";
import EventCard from "@/components/Events/EventCard.vue";
import JnsImage from "@/components/ui/JnsImage.vue";
import Loader from "@/components/ui/Loader.vue";
import associationService from "@/services/associationService";
import eventService from "@/services/eventService";
import mediaService from "@/services/mediaService";
import { useNotificationStore } from "@/store/notificationStore";
import { useUserStore } from "@/store/userStore";
import { canManageAssociation } from "@/utils/check-role";
import { EventCard as EventCardType } from "@/types/event.types";
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
import { formatFullAddress } from "@shared/utils/address.util";
import { Localisation } from "@shared/types/localisation";
const route = useRoute();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const association = ref<PublicAssociationDto | null>(null);
const events = ref([]);
const isLoading = ref(true);
const activeTab = ref("0");

const associationId = computed(() => route.params.id as string);
const canManageApplications = computed(() =>
  canManageAssociation(
    userStore.user as unknown as User,
    route.params.id as string
  )
);
// Transformer les événements en EventCard
const eventCards = computed(() => EventCardType.fromEvents(events.value));

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
          <p v-if="association.localisation" class="text-gray-600 mt-2">
            <i class="pi pi-map-marker mr-1"></i>
            {{ formatFullAddress(association.localisation as Localisation) }}
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
                :associationId="associationId"
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
                  <EventCard
                    v-for="event in eventCards"
                    :key="event.id"
                    :event="event"
                  />
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
