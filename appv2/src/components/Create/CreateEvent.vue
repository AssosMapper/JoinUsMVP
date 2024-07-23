<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/usersStore';
import eventService from '@/services/eventService';
import associationService from '@/services/associationService';
import typeEventService from '@/services/typeEventService';
import { useRouter } from 'vue-router';
import GoogleAutoCompleteComponent from '../GoogleAutoCompleteComponent.vue';
import { useNotificationStore } from '@/store/notificationStore.ts';

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const isAdmin = userStore.isAdmin;

const event = ref({
  titre: '',
  description: '',
  image: '',
  date: '',
  localisation: '',
  association_id: isAdmin ? null : userStore.associationId,
  user_id: userStore.id,
  type_event_id: null as number | null,
  isPublic: true,
});

const associations = ref<{ id: number, name: string }[]>([]);
const typeEvents = ref<{ id: number, name: string }[]>([]);

const handleSubmit = async () => {
  try {
    const token = userStore.access_token;
    if (!isAdmin) {
      event.value.association_id = userStore.associationId;
    }

    if (event.value.association_id === null || event.value.user_id === null || event.value.type_event_id === null) {
      notificationStore.showNotification("Association, User, and Event Type must be selected", "error");
      return;
    }

    const dataToSend = {
      ...event.value,
      association_id: event.value.association_id ?? 0,
      user_id: event.value.user_id ?? 0,
      type_event_id: event.value.type_event_id ?? 0
    };

    await eventService.createEvent(dataToSend, token);
    notificationStore.showNotification("Evenement créé avec succès !", "success");
    router.push('/');
  } catch (error) {
    console.error('Error creating event:', error);
    notificationStore.showNotification("Erreur lors de la création de l'évènement", "error");
  }
};

const fetchAssociations = async () => {
  try {
    const response = await associationService.getAllAssociations();
    associations.value = response.data;
  } catch (error) {
    console.error('Error fetching associations:', error);
  }
};

const fetchTypeEvents = async () => {
  try {
    const response = await typeEventService.getAllTypeEvents();
    typeEvents.value = response.data;
  } catch (error) {
    console.error('Error fetching type events:', error);
  }
};

onMounted(() => {
  if (isAdmin) {
    fetchAssociations();
  }
  fetchTypeEvents();
});
</script>

<template>
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Create Event</h2>

      <div class="mb-4">
        <label for="titre" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
        <input
          type="text"
          id="titre"
          v-model="event.titre"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
        <textarea
          id="description"
          v-model="event.description"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        ></textarea>
      </div>

      <div class="mb-4">
        <label for="image" class="block text-sm font-medium leading-6 text-gray-900">Image URL</label>
        <input
          type="text"
          id="image"
          v-model="event.image"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label for="date" class="block text-sm font-medium leading-6 text-gray-900">Date</label>
        <input
          type="datetime-local"
          id="date"
          v-model="event.date"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label for="localisation" class="block text-sm font-medium leading-6 text-gray-900">Localisation</label>
        <GoogleAutoCompleteComponent
          id="localisation"
          v-model="event.localisation"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4" v-if="isAdmin">
        <label for="association_id" class="block text-sm font-medium leading-6 text-gray-900">Association</label>
        <select
          id="association_id"
          v-model="event.association_id"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option v-for="association in associations" :key="association.id" :value="association.id">
            {{ association.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label for="type_event_id" class="block text-sm font-medium leading-6 text-gray-900">Event Type</label>
        <select
          id="type_event_id"
          v-model="event.type_event_id"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option v-for="typeEvent in typeEvents" :key="typeEvent.id" :value="typeEvent.id">
            {{ typeEvent.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label for="isPublic" class="block text-sm font-medium leading-6 text-gray-900">Public Event</label>
        <input
          type="checkbox"
          id="isPublic"
          v-model="event.isPublic"
          class="mt-1"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      >
        Create Event
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
