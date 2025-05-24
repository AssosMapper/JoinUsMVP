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
          class="flex flex-col bg-white rounded-xl border-primary 
                 shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)]
                 transform transition-all duration-200 ease-in-out
                 hover:shadow-[4px_4px_16px_-1px_rgba(0,0,0,0.15),8px_8px_20px_-4px_rgba(0,0,0,0.2)]
                 hover:-translate-y-1 hover:bg-primary-hover/5
                 cursor-pointer"
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
              <div class="absolute top-2 right-2 bg-primary text-white rounded-full">
                <span
                  class="px-3 py-1 bg-primary/10 rounded-full text-sm"
                >
                  {{ event.typeEvent.name }}
                </span>
              </div>
            </div>
          </template>
          <template #title>
            <div class="flex flex-col">
              <span class="text-gray-800">{{ event.titre }}</span>
              <span class="text-sm text-gray-600">
                <i class="pi pi-users mr-1"></i>
                {{ event.association.name }}
              </span>
            </div>
          </template>
          <template #subtitle>
            <div class="flex items-center gap-2 text-gray-600">
              <i class="pi pi-calendar"></i>
              {{ friendlyDate(new Date(event.date)) }}
            </div>
          </template>
          <template #content>
            <div class="flex flex-col p-4 border-t-primary">
              <div class="flex items-center gap-2 text-gray-500">
                <i class="pi pi-map-marker"></i>
                {{ event.localisation }}
              </div>
              <p class="text-gray-600 mb-3 line-clamp-2 max-w-prose mt-2 text-gray-700">
                {{ truncateDescription(event.description) }}
              </p>
              <div class="mt-auto pt-3 flex justify-center gap-3 border-t-primary">
                <Button @click.stop="goToEventDetails(event.id)" class="bg-primary text-white">
                  En savoir plus
                </Button>
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
