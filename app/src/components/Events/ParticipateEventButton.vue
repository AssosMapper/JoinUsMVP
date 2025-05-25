<script setup lang="ts">
import eventService from "@/services/eventService";
import { useNotificationStore } from "@/store/notificationStore";
import { EventParticipation } from "@/types/event.types";
import {
  ParticipateEventDto,
  UserParticipationResponseDto,
} from "@shared/dto/event-participation.dto";
import { onMounted, ref } from "vue";

interface Props {
  eventId: string;
  participation?: EventParticipation | null;
}

const props = defineProps<Props>();

const eventParticipation = ref<EventParticipation | null>(
  props.participation || null
);
const isLoading = ref(false);
const notificationStore = useNotificationStore();
const fetchParticipation = async () => {
  if (props.participation !== undefined) return;

  try {
    isLoading.value = true;
    const participation = (await eventService.getUserParticipation(
      props.eventId
    )) as UserParticipationResponseDto | null;
    eventParticipation.value = participation
      ? {
          id: participation.id,
          registrationDate: participation.registrationDate,
        }
      : null;
  } catch (error) {
    eventParticipation.value = null;
  } finally {
    isLoading.value = false;
  }
};

const handleParticipation = async () => {
  try {
    isLoading.value = true;

    if (eventParticipation.value) {
      await eventService.cancelParticipation(props.eventId);
      eventParticipation.value = null;
    } else {
      const participateDto: ParticipateEventDto = { eventId: props.eventId };
      const participation = (await eventService.participateEvent(
        participateDto
      )) as UserParticipationResponseDto | null;
      eventParticipation.value = {
        id: participation.id,
        registrationDate: participation.registrationDate,
      };
    }
  } catch (error) {
    console.error("Error handling participation:", error);
    notificationStore.showNotification(error.message, "error");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchParticipation();
});
</script>

<template>
  <Button
    :label="eventParticipation ? 'Ne plus participer' : 'Participer'"
    :loading="isLoading"
    :severity="eventParticipation ? 'danger' : 'success'"
    @click="handleParticipation"
  />
</template>
