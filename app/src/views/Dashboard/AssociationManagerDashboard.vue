<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import TabPanels from 'primevue/tabpanels'
import Tabs from 'primevue/tabs'
import JnsImage from "@/components/ui/JnsImage.vue"
import Loader from "@/components/ui/Loader.vue"
import CreateEvent from '../../components/Create/CreateEvent.vue'
import UpdateEvent from '../../components/Update/UpdateEvent.vue'
import UpdateAssociation from '../../components/Update/UpdateAssociation.vue'
import AssociationMembers from "@/components/AssociationDashboard/AssociationMembers.vue"
import ManageAssociationApplications from '../../components/AssociationDashboard/ManageAssociationApplications.vue'
import { useUserStore } from "@/store/userStore"
import { useNotificationStore } from "@/store/notificationStore"
import associationService from "@/services/associationService"
import type { PublicAssociationDto } from "@shared/dto/associations.dto"
import type { Event } from "@shared/types/event"
import type { Media } from "@shared/types/media"
import mediaService from "@/services/mediaService"
import eventService from "@/services/eventService"
import Button from 'primevue/button'

const userStore = useUserStore()
const notificationStore = useNotificationStore()
const association = ref<PublicAssociationDto | null>(null)
const events = ref<Event[]>([])
const isLoading = ref(true)
const activeTab = ref('0')
const selectedEventId = ref<string | null>(null)

const fetchAssociationDetails = async () => {
  try {
    if (userStore.associationId) {
      console.log('User association ID:', userStore.associationId);
      console.log('User roles:', userStore.user?.roles);
      console.log('User associations:', userStore.user?.associations);
      association.value = await associationService.getAssociationById(userStore.associationId)
      console.log('Fetched association:', association.value);
    }
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error")
  } finally {
    isLoading.value = false
  }
}

const fetchEvents = async () => {
  try {
    if (association.value?.id) {
      events.value = await eventService.getEventsByAssociationId(association.value.id, 100);
    }
  } catch (error: any) {
    notificationStore.showNotification(error.message, "error");
  }
};

onMounted(() => {
  console.log('User roles:', userStore.user?.roles);
  console.log('Is Association Manager:', userStore.isAssociationManager);
  console.log('Association ID:', userStore.associationId);
  fetchAssociationDetails().then(() => {
    fetchEvents();
  });
})
</script>

<template>
  <div class="p-6">
    <div v-if="isLoading">
      <Loader />
    </div>

    <div v-else-if="!association" class="text-center p-6 text-gray-600">
      Vous n'avez pas d'association à gérer.
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-6 bg-primary/10 p-6 rounded-lg">
        <div class="flex-shrink-0">
          <JnsImage
            :name="association.name"
            :src="mediaService.getMediaUrl(association.image as Media)"
            size="lg"
          />
        </div>
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
            <Tab value="2">Gérer les candidatures</Tab>
            <Tab value="3">Paramètres</Tab>
            <Tab value="4">Créer un événement</Tab>
            <Tab value="5">Gérer les événements</Tab>
            <Tab value="6" style="display: none">Modifier l'événement</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="0">
              <div class="bg-white rounded-lg shadow p-6">
                <UpdateAssociation :associationId="association.id" />
              </div>
            </TabPanel>

            <TabPanel value="1">
              <div class="bg-white rounded-lg shadow p-6">
                <AssociationMembers
                  :associationId="association.id"
                  :canManageApplications="true"
                />
              </div>
            </TabPanel>

            <TabPanel value="2">
              <div class="bg-white rounded-lg shadow p-6 text-black">
                <ManageAssociationApplications :associationId="association.id" />
              </div>
            </TabPanel>

            <TabPanel value="3">
              <div class="bg-white rounded-lg shadow p-6">
                <UpdateAssociation :associationId="association.id" />
              </div>
            </TabPanel>

            <TabPanel value="4">
              <div class="bg-white rounded-lg shadow p-6">
                <CreateEvent />
              </div>
            </TabPanel>

            <TabPanel value="5">
              <div class="bg-white rounded-lg shadow p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div v-for="event in events" :key="event.id" 
                    class="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all duration-300">
                    <JnsImage
                      :name="event.titre"
                      :src="event.image?.filepath || '/default-event.jpg'"
                      size="lg"
                      :rounded="false"
                      class="w-full h-48"
                    />
                    <div class="p-5">
                      <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-bold tracking-tight text-gray-900">{{ event.titre }}</h3>
                        <span class="text-sm text-gray-500">{{ event.typeEvent?.name }}</span>
                      </div>
                      <p class="mb-3 font-normal text-gray-700">{{ event.description }}</p>
                      <div class="flex items-center text-sm text-gray-500">
                        <i class="pi pi-calendar mr-2"></i>
                        <time>{{ new Date(event.date).toLocaleDateString() }}</time>
                        <i class="pi pi-map-marker ml-4 mr-2"></i>
                        <span>{{ event.localisation }}</span>
                      </div>
                      <div class="mt-4 flex justify-end">
                        <Button
                          class="w-full"
                          icon="pi pi-pencil"
                          severity="secondary"
                          outlined
                          @click="() => {
                            selectedEventId = event.id;
                            activeTab = '6';
                          }"
                        >
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel value="6">
              <div class="bg-white rounded-lg shadow p-6">
                <UpdateEvent v-if="selectedEventId" :eventId="selectedEventId" />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
:deep(.p-tabview-nav) {
  @apply border-b border-gray-200;
}

:deep(.p-tabview-selected) {
  @apply border-b-2 border-primary;
}
</style>