<script setup lang="ts">
import ParticipateEventButton from "@/components/Events/ParticipateEventButton.vue";
import JnsImage from "@/components/ui/JnsImage.vue";
import eventService from "@/services/eventService";
import mediaService from "@/services/mediaService";
import { useLayoutRefStore } from "@/store/layoutRefStore";
import { EventParticipation } from "@/types/event.types";
import { UserParticipationResponseDto } from "@shared/dto/event-participation.dto";
import type { Event } from "@shared/types/event";
import { friendlyDate } from "@shared/utils/date";
import { useInfiniteScroll } from "@vueuse/core";
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
  events: Event[];
  loading: boolean;
  currentMonthYear: string;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
}>();

const layoutRefStore = useLayoutRefStore();
const userParticipations = ref<UserParticipationResponseDto[]>([]);

useInfiniteScroll(
  layoutRefStore.mainRef,
  async () => {
    if (!props.loading && props.hasMore) await props.fetchMore();
  },
  {
    distance: 50,
  }
);

const fetchUserParticipations = async () => {
  try {
    userParticipations.value = await eventService.getUserParticipations();
  } catch (error) {
    console.error("Error fetching user participations:", error);
    userParticipations.value = [];
  }
};

const getParticipationForEvent = (
  eventId: string
): EventParticipation | null => {
  const participation = userParticipations.value.find(
    (p) => p.event.id === eventId
  );
  return participation
    ? {
        id: participation.id,
        registrationDate: participation.registrationDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    : null;
};

const truncateDescription = (description: string, maxLength: number = 255) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + "...";
};

const goToEventDetails = (id: string) => {
  router.push({ name: "EventDetails", params: { id } });
};

onMounted(() => {
  fetchUserParticipations();
});

const isEventPast = (eventDate: Date) => {
  return eventDate < new Date();
};
</script>

<template>
  <div ref="el" class="w-full">
    <div v-if="!loading">
      <div
        v-if="events && events.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <Card
          v-for="event in events"
          :key="event.id"
          class="flex flex-col bg-white rounded-xl border-primary shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)] transform transition-all duration-200 ease-in-out hover:shadow-[4px_4px_16px_-1px_rgba(0,0,0,0.15),8px_8px_20px_-4px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:bg-primary-hover/5 cursor-pointer"
          @click="goToEventDetails(event.id)"
        >
          <template #content>
            <div class="flex flex-col">
              <div class="flex gap-4 mb-4">
                <JnsImage
                  :name="event.titre"
                  :src="
                    event.image
                      ? mediaService.getMediaUrl(event.image)
                      : '/default-event.jpg'
                  "
                  size="md"
                  class="w-32 h-32 rounded-lg"
                />
                <div class="flex flex-col justify-center flex-1">
                  <span class="text-lg font-semibold text-gray-700">
                    <i class="pi pi-users mr-1"></i>
                    {{ event.association?.name }}
                  </span>
                  <span
                    class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm w-fit mt-2 mx-auto"
                  >
                    {{ event.typeEvent?.name }}
                  </span>
                </div>
              </div>
              <div
                class="flex flex-col p-4 border-t-primary border-surface-300 dark:border-surface-700"
              >
                <div class="flex flex-col mb-4">
                  <span class="text-base font-semibold text-gray-700">{{
                    event.titre
                  }}</span>
                </div>
                <div class="flex flex-col gap-2 mb-4 items-center">
                  <div class="flex items-center gap-2 text-gray-600">
                    <i class="pi pi-calendar"></i>
                    {{ friendlyDate(new Date(event.date)) }}
                  </div>
                  <div class="flex items-center gap-2 text-gray-500">
                    <i class="pi pi-map-marker"></i>
                    {{ event.localisation }}
                  </div>
                </div>
                <div class="flex flex-col justify-between flex-1">
                  <p class="text-gray-600 line-clamp-3">
                    {{ truncateDescription(event.description) }}
                  </p>
                </div>
                <div class="mt-auto pt-3 flex justify-center gap-3">
                  <ParticipateEventButton
                    v-if="!isEventPast(new Date(event.date))"
                    :event-id="event.id"
                    :participation="getParticipationForEvent(event.id)"
                    @click.stop
                  />
                  <Button
                    @click.stop="goToEventDetails(event.id)"
                    class="bg-primary text-white"
                  >
                    En savoir plus
                  </Button>
                </div>
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
