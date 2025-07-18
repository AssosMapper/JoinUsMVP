<script setup lang="ts">
import EventForm from "@/components/Events/EventForm.vue";
import eventService from "@/services/eventService";
import { useNotificationStore } from "@/store/notificationStore";
import { CreateEventDto, UpdateEventDto, EventDto } from "@shared/dto/events.dto";
import { SaveLocalisationDto } from "@shared/dto/localisation.dto";
import { ref } from "vue";

interface Props {
  event: EventDto;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'event-updated': [event: EventDto];
  'update-cancelled': [];
}>();

const notificationStore = useNotificationStore();
const isUpdating = ref(false);

const handleUpdateEvent = async (
  formData: CreateEventDto | UpdateEventDto,
  localisation?: SaveLocalisationDto,
  imageFile?: File
) => {
  if (!props.event?.id) {
    throw new Error("ID de l'événement manquant");
  }

  isUpdating.value = true;
  
  try {
    const updateData: UpdateEventDto = {
      ...formData,
      id: props.event.id,
    };

    const updatedEvent = await eventService.updateEvent(
      props.event.id,
      updateData,
      localisation,
      imageFile
    );

    notificationStore.showNotification(
      "Événement modifié avec succès",
      "success"
    );

    emit('event-updated', updatedEvent);
  } catch (error: any) {    
    const errorMessage = error?.message || "Erreur lors de la modification de l'événement";
    notificationStore.showNotification(errorMessage, "error");
  } finally {
    isUpdating.value = false;
  }
};
</script>

<template>
  <div class="update-event">
    <EventForm
      :event="event"
      :on-submit="handleUpdateEvent"
    />
  </div>
</template>

<style scoped>
.update-event {
  width: 100%;
}
</style>
