<script setup lang="ts">
import EventCard from "@/components/Events/EventCard.vue";
import eventService from "@/services/eventService";
import { useLayoutRefStore } from "@/store/layoutRefStore";
import {
  EventCard as EventCardType,
  EventParticipation,
} from "@/types/event.types";
import { UserParticipationResponseDto } from "@shared/dto/event-participation.dto";
import type { Event } from "@shared/types/event";
import { useInfiniteScroll } from "@vueuse/core";
import ProgressSpinner from "primevue/progressspinner";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
  events: Event[];
  loading: boolean;
  currentMonthYear: string;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
}>();

const layoutRefStore = useLayoutRefStore();
const userParticipations = ref<UserParticipationResponseDto[]>([]);

// Transformer les événements en EventCard
const eventCards = computed(() => EventCardType.fromEvents(props.events));

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
      }
    : null;
};

onMounted(() => {
  fetchUserParticipations();
});
</script>

<template>
  <div ref="el" class="w-full">
    <div v-if="!loading">
      <div
        v-if="eventCards && eventCards.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <EventCard
          v-for="eventCard in eventCards"
          :key="eventCard.id"
          :event="eventCard"
          :participation="getParticipationForEvent(eventCard.id)"
          :show-association="true"
        />
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
