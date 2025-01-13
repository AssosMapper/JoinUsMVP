<script setup lang="ts">
import eventService from "@/services/eventService";
import typeEventService from "@/services/typeEventService";
import type { Event } from "@shared/types/event";
import type { TypeEvents } from "@shared/types/type-events";
import { useDebounce } from "@vueuse/core";
import Dropdown from "primevue/dropdown";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import { onMounted, ref, watch, defineAsyncComponent, shallowRef } from "vue";
import Map from '@/components/Map.vue';

const events = ref<Array<Event>>([]);
const typeEvents = ref<Array<TypeEvents>>([]);
const search = ref("");
const loading = ref(false);
const activeTab = ref("0");
const currentDate = ref(new Date());
const selectedType = ref<TypeEvents | null>(null);

const debouncedSearch = useDebounce(search, 300);

const components = {
  'CreateEvent': defineAsyncComponent(() => import('../../components/Create/CreateEvent.vue')),
  'UpdateEvent': defineAsyncComponent(() => import('../../components/Update/UpdateEvent.vue')),
}

const currentComponent = shallowRef<'CreateEvent' | 'UpdateEvent' | null>(null);

const fetchTypeEvents = async () => {
  try {
    const data = await typeEventService.getAllTypeEvents();
    typeEvents.value = data as TypeEvents[];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des types d'événements :",
      error
    );
  }
};

const fetchEvents = async () => {
  loading.value = true;
  try {
    const response = await eventService.getEventsByMonth(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      true,
      debouncedSearch.value,
      selectedType.value?.id
    );
    events.value = response;
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchTypeEvents();
  fetchEvents();
});

const handlePreviousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
  fetchEvents();
};

const handleNextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
  fetchEvents();
};

watch([debouncedSearch, selectedType], fetchEvents);
</script>

<template>
  <Tabs v-model:value="activeTab">
    <div class="relative">
      <!-- Header fixe avec search et tabs -->
      <div class="fixed md:static top-0 left-0 right-0 z-20 bg-white shadow-md">
        <div class="px-4">
          <TabList class="flex items-center gap-4">
            <!-- Barre de recherche et filtres -->
            <div class="flex items-center gap-4 flex-1">
              <IconField class="flex-1">
                <InputIcon class="pi pi-search" :class="search ? 'text-[#168003]' : 'text-gray-600'" />
                <InputText
                  v-model="search"
                  placeholder="Rechercher un événement..."
                  class="w-full placeholder:text-gray-600 text-[#168003]"
                />
              </IconField>
              <Dropdown
                v-model="selectedType"
                :options="typeEvents"
                optionLabel="name"
                placeholder="Type d'événement"
                :class="[
                  'font-semibold',
                  selectedType ? 'text-[#168003]' : 'text-gray-600'
                ]"
                :showClear="true"
              />
            </div>

            <Tab value="3" class="ml-4">
              <Dropdown 
                v-model="currentComponent" 
                :options="['CreateEvent', 'UpdateEvent']"
                placeholder="Mes événements" 
                :class="[
                  'font-semibold',
                  currentComponent ? 'text-[#168003]' : 'text-gray-600'
                ]"
              >
                <template #value="{ value }">
                  <i class="pi pi-user mr-2" :class="currentComponent ? 'text-[#168003]' : 'text-gray-600'" />
                  {{ value === 'CreateEvent' ? 'Créer un événement' : 
                     value === 'UpdateEvent' ? 'Modifier un événement' : 
                     'Mes événements' }}
                </template>
                <template #option="{ option }">
                  {{ option === 'CreateEvent' ? 'Créer un événement' : 'Modifier un événement' }}
                </template>
              </Dropdown>
            </Tab>
          </TabList>
        </div>
      </div>

      <!-- Navigation des tabs -->
      <section class="px-10">
        <div class="flex items-center justify-between w-full mb-4">
          <div class="flex gap-4">
            <Tab value="0">
              <template #default>
                <i class="pi pi-list mr-2" 
                   :class="[
                     activeTab === '0' ? 'text-[#168003]' : 'text-gray-600',
                     'hover:text-[#168003] transition-colors duration-200'
                   ]" />
                Liste
              </template>
            </Tab>
            <Tab value="1">
              <template #default>
                <i class="pi pi-calendar mr-2" 
                   :class="[
                     activeTab === '1' ? 'text-[#168003]' : 'text-gray-600',
                     'hover:text-[#168003] transition-colors duration-200'
                   ]" />
                Calendrier
              </template>
            </Tab>
            <Tab value="2">
              <template #default>
                <i class="pi pi-map mr-2" 
                   :class="[
                     activeTab === '2' ? 'text-[#168003]' : 'text-gray-600',
                     'hover:text-[#168003] transition-colors duration-200'
                   ]" />
                Carte
              </template>
            </Tab>
          </div>
          <DateSwitchComponent
            :current-date="currentDate"
            @previous="handlePreviousMonth"
            @next="handleNextMonth"
          />
        </div>

        <!-- Contenu -->
        <div class="overflow-y-auto pb-20" style="max-height: calc(100vh - 18rem);">
          <TabPanels>
            <TabPanel value="0">
              <EventsList
                :events="events"
                :loading="loading"
                :current-month-year="
                  currentDate.toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric',
                  })
                "
              />
            </TabPanel>

            <TabPanel value="1">
              <Calendar :events="events" :current-date="currentDate" />
            </TabPanel>

            <TabPanel value="2">
              <div class="h-[calc(100vh-12rem)] w-full">
                <Map 
                  :events="events"
                  :center="{ lat: 48.8566, lng: 2.3522 }"
                />
              </div>
            </TabPanel>

            <TabPanel value="3">
              <component 
                v-if="currentComponent" 
                :is="components[currentComponent]"
              />
              <div v-else class="text-center py-8">
                Sélectionnez une action dans le menu déroulant
              </div>
            </TabPanel>
          </TabPanels>
        </div>
      </section>
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
  border-bottom-color: var(--primary-color);
}

:deep(.p-tab:not([data-p-highlight="true"]):hover) {
  border-bottom-color: var(--surface-hover);
}

:deep(.p-tabpanel) {
  padding: 0;
}
</style>
