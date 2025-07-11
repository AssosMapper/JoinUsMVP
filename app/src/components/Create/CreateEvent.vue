<script setup lang="ts">
import EventForm from "@/components/Events/EventForm.vue";
import eventService from "@/services/eventService";
import { useNotificationStore } from "@/store/notificationStore";
import { CreateEventDto, UpdateEventDto } from "@shared/dto/events.dto";
import { SaveLocalisationDto } from "@shared/dto/localisation.dto";
import { useRouter } from "vue-router";

const notificationStore = useNotificationStore();
const router = useRouter();

const handleSubmit = async (
  formData: CreateEventDto | UpdateEventDto,
  localisation?: SaveLocalisationDto,
  imageFile?: File
) => {
  try {
    await eventService.createEvent(formData as CreateEventDto, localisation, imageFile);
    
    notificationStore.showNotification(
      "Événement créé avec succès !",
      "success"
    );
    
    await router.push("/");
  } catch (error: any) {
    throw error; // Re-throw pour que EventForm gère l'affichage de l'erreur
  }
};
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <EventForm :onSubmit="handleSubmit" />
  </div>
</template>

<style scoped></style>
