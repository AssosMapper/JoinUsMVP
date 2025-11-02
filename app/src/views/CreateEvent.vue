<script setup lang="ts">
import CreateEventComponent from '@/components/Create/CreateEvent.vue';
import { useNotificationStore } from '@/store/notificationStore';
import { EventDto } from '@shared/dto/events.dto';
import { useRouter } from 'vue-router';

const notificationStore = useNotificationStore();
const router = useRouter();

const handleEventCreated = (createdEvent: EventDto) => {
  router.push(`/displayEvent/${createdEvent.id}`);
};

</script>

<template>
  <div class="create-event-page h-full bg-surface-50">
    <div class="container mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-primary mb-2">Créer un événement</h1>
        <p class="text-gray-600">Remplissez le formulaire ci-dessous pour créer un nouvel événement.</p>
      </div>
      
      <CreateEventComponent @event:created="handleEventCreated" />
    </div>
  </div>
</template>
