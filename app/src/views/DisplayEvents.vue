<script setup lang="ts">
import Calendar from "@/components/Calendar.vue";
import EventsList from "@/components/EventsList.vue";
import eventService from "@/services/eventService";
import { Event } from "@shared/types/event";
import { useDebounce } from "@vueuse/core";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import { onMounted, ref, watch } from "vue";

const events = ref<Event[]>([]);
const search = ref("");
const loading = ref(false);
const activeTab = ref("0");

const debouncedSearch = useDebounce(search, 300);

const fetchEvents = async () => {
  loading.value = true;
  try {
    const today = new Date();
    const response = await eventService.getEventsByMonth(
      today.getFullYear(),
      today.getMonth() + 1,
      true,
      debouncedSearch.value
    );
    events.value = response;
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
  } finally {
    loading.value = false;
  }
};

watch(debouncedSearch, fetchEvents);

onMounted(fetchEvents);
</script>

<template>
  <Tabs v-model:value="activeTab">
    <div class="relative">
      <!-- Header fixe avec search et tabs -->
      <div class="fixed md:static top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div class="p-4">
          <div class="flex justify-center mb-4">
            <IconField class="w-full max-w-3xl">
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="search"
                placeholder="Rechercher un événement..."
                class="w-full"
              />
            </IconField>
          </div>
        </div>

        <!-- Navigation des tabs -->
        <div>
          <TabList class="flex justify-center">
            <Tab value="0">
              <template #default>
                <i class="pi pi-list mr-2" />
                Liste
              </template>
            </Tab>
            <Tab value="1">
              <template #default>
                <i class="pi pi-calendar mr-2" />
                Calendrier
              </template>
            </Tab>
            <Tab value="2">
              <template #default>
                <i class="pi pi-map mr-2" />
                Carte
              </template>
            </Tab>
          </TabList>
        </div>
      </div>

      <!-- Contenu -->
      <div>
        <TabPanels>
          <TabPanel value="0">
            <EventsList :events="events" :loading="loading" />
          </TabPanel>

          <TabPanel value="1">
            <Calendar :events="events" />
          </TabPanel>

          <TabPanel value="2">
            <div class="text-center p-4">Fonctionnalité à venir</div>
          </TabPanel>
        </TabPanels>
      </div>
    </div>
  </Tabs>
</template>

<style scoped>
:deep(.p-tablist) {
  border-bottom: 2px solid var(--surface-border);
}

:deep(.p-tab) {
  padding: 1rem 2rem;
  font-weight: 600;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

:deep(.p-tab[data-p-highlight="true"]) {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

:deep(.p-tab:not([data-p-highlight="true"]):hover) {
  color: var(--primary-color);
  border-bottom-color: var(--surface-hover);
}

:deep(.p-tabpanel) {
  padding: 0;
}
</style>
