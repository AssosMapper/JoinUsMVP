<<<<<<< HEAD

  
<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    title: String,
    events: Array
});
</script>

<template>
    <div class="events-section mt-8">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <ul class="list-disc pl-5">
        <li v-for="event in events" :key="event.id" class="mb-2">
          <span class="font-semibold">{{ event.titre }}</span> - {{ new Date(event.date).toLocaleDateString() }}
        </li>
      </ul>
      <p v-if="events.length === 0" class="text-gray-500 italic">No {{ title.toLowerCase() }}.</p>
    </div>
</template>
  
<style scoped>
.events-section {
    margin-top: 20px;
}
</style>
  
=======
<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import { useLayoutRefStore } from "@/store/layoutRefStore";
import { friendlyDate } from "@shared/utils/date";
import { useInfiniteScroll } from "@vueuse/core";
import Badge from "primevue/badge";
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";
import { useRouter } from "vue-router";
import type { Event } from "@shared/types/event";
import mediaService from "@/services/mediaService";

const router = useRouter();
const props = defineProps<{
  events: Event[];
  loading: boolean;
  currentMonthYear: string;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
}>();

const layoutRefStore = useLayoutRefStore();

useInfiniteScroll(
  layoutRefStore.mainRef,
  async () => {
    if (!props.loading && props.hasMore) await props.fetchMore();
  },
  {
    distance: 50,
  }
);

const truncateDescription = (description: string, maxLength: number = 255) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + "...";
};

const goToEventDetails = (id: string) => {
  router.push({ name: "EventDetails", params: { id } });
};
</script>

<template>
  <div
    ref="el"
    class="w-full"
  >
    <div v-if="!loading">
      <div 
        v-if="events && events.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <Card
          v-for="event in events"
          :key="event.id"
          class="event-card cursor-pointer"
          @click="goToEventDetails(event.id)"
        >
          <template #header>
            <div class="relative">
              <JnsImage
                :name="event.titre"
                :src="event.image ? mediaService.getMediaUrl(event.image) : '/default-event.jpg'"
                size="lg"
                :rounded="false"
                class="w-full h-48"
              />
              <div class="absolute top-2 right-2">
                <Badge
                  :value="event.typeEvent.name"
                  severity="info"
                  class="bg-black/50 text-white border-none"
                />
              </div>
            </div>
          </template>
          <template #title>
            {{ event.titre }}
          </template>
          <template #subtitle>
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar"></i>
              {{ friendlyDate(new Date(event.date)) }}
            </div>
          </template>
          <template #content>
            <p class="mb-3">{{ truncateDescription(event.description) }}</p>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <i class="pi pi-map-marker"></i>
                {{ event.localisation }}
              </div>
              <div class="flex items-center gap-2">
                <i class="pi pi-users"></i>
                {{ event.association.name }}
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        Il n'y a pas d'événements en {{ props.currentMonthYear }}
      </div>
    </div>
    <div v-if="loading" class="flex justify-center p-4">
      <ProgressSpinner />
    </div>
  </div>
</template>

<style scoped>
.event-card {
  transition: transform 0.2s;
}

.event-card:hover {
  transform: translateY(-5px);
}

:deep(.p-card-header) {
  padding: 0;
}

:deep(.p-card-body) {
  padding: 1.25rem;
}
</style>
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
