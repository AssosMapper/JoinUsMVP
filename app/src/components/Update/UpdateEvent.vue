<script setup lang="ts">
<<<<<<< HEAD
import {ref, onMounted, watch} from 'vue';
import {useUserStore} from '@/store/usersStore';
import eventService from '@/services/eventService';
import associationService from '@/services/associationService';
import typeEventService from '@/services/typeEventService';
import {useRouter} from 'vue-router';
import GoogleAutoCompleteComponent from '../GoogleAutoCompleteComponent.vue';

const userStore = useUserStore();
=======
import associationService from "@/services/associationService";
import eventService from "@/services/eventService";
import typeEventService from "@/services/typeEventService";
import { useUserStore } from "@/store/userStore";
import { useNotificationStore } from "@/store/notificationStore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import GoogleAutoCompleteComponent from "../GoogleAutoCompleteComponent.vue";

const userStore = useUserStore();
const notificationStore = useNotificationStore();
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
const router = useRouter();

const isAdmin = userStore.isAdmin;
const isAssociationManager = userStore.isAssociationManager;

<<<<<<< HEAD
const event = ref({
  titre: '',
  description: '',
  image: '',
  date: '',
  localisation: '',
=======
const checkPermissions = () => {
  if (!isAssociationManager && !isAdmin) {
    notificationStore.showNotification(
      "Vous devez être gestionnaire d'association pour modifier un événement",
      "error"
    );
    router.push('/');
    return false;
  }
  return true;
};

const event = ref({
  id: "" as string,
  titre: "",
  description: "",
  image: "",
  date: "",
  localisation: "",
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  associationId: null as string | null,
  typeEventId: null as string | null,
  isPublic: true,
  association: null as any,
});

<<<<<<< HEAD
const selectedEventId = ref<number | null>(null);
const associations = ref<{ id: number, name: string }[]>([]);
const typeEvents = ref<{ id: number, name: string }[]>([]);
const events = ref<{ id: number, titre: string }[]>([]);

const fetchEventDetails = async (id: number) => {
  try {
    const eventData = await eventService.getEventById(id);
    console.log(eventData)
=======
const associations = ref<{ id: string; name: string }[]>([]);
const typeEvents = ref<{ id: string; name: string }[]>([]);

const props = defineProps<{
  eventId: string;
}>();

const fetchEventDetails = async (id: string) => {
  try {
    const eventData = await eventService.getEventById(id);
    console.log(eventData);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    event.value = {
      id: eventData.id,
      titre: eventData.titre,
      description: eventData.description,
      image: eventData.image,
      date: formatDateForInput(eventData.date),
      localisation: eventData.localisation,
      associationId: eventData.association?.id ?? null,
      typeEventId: eventData.typeEvent?.id ?? null,
      isPublic: eventData.isPublic,
      association: eventData.association,
    };
<<<<<<< HEAD
    console.log(event.value.association)
  } catch (error) {
    console.error('Error fetching event details:', error);
=======
    console.log(event.value.association);
  } catch (error) {
    console.error("Error fetching event details:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const handleSubmit = async () => {
  try {
<<<<<<< HEAD

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {association, id, ...dataToSend} = {
      ...event.value,
      associationId: event.value.associationId,
      typeEventId: event.value.typeEventId
    };

    await eventService.updateEvent(selectedEventId.value, dataToSend);
    await router.push('/');
  } catch (error) {
    console.error('Error updating event:', error);
=======
    if (!checkPermissions()) return;

    const { association, id, ...dataToSend } = {
      ...event.value,
      associationId: event.value.associationId,
      typeEventId: event.value.typeEventId,
    };

    await eventService.updateEvent(props.eventId, dataToSend);
    await router.push("/");
  } catch (error) {
    console.error("Error updating event:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const fetchAssociations = async () => {
  try {
    associations.value = await associationService.getAllAssociations();
  } catch (error) {
<<<<<<< HEAD
    console.error('Error fetching associations:', error);
=======
    console.error("Error fetching associations:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const fetchTypeEvents = async () => {
  try {
<<<<<<< HEAD
    typeEvents.value = await typeEventService.getAllTypeEvents();
  } catch (error) {
    console.error('Error fetching type events:', error);
  }
};

const fetchEvents = async () => {
  try {
    let response;
    if (isAdmin) {
      response = await eventService.getAllEvents();
    } else {
      response = await eventService.getEventsByUserId(userStore.id as number);
    }
    events.value = response;
  } catch (error) {
    console.error('Error fetching events:', error);
=======
    const response = await typeEventService.getAllTypeEvents();
    typeEvents.value = Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error fetching type events:", error);
    typeEvents.value = [];
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const handlePlaceChanged = (place: any) => {
  event.value.localisation = place.formatted_address;
};

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
<<<<<<< HEAD
  const formattedDate = new Date(date.getTime() - (offset * 60 * 1000));
=======
  const formattedDate = new Date(date.getTime() - offset * 60 * 1000);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  return formattedDate.toISOString().slice(0, 16);
};

onMounted(() => {
<<<<<<< HEAD
  fetchAssociations();
  fetchTypeEvents();
  fetchEvents();
});

watch(selectedEventId, (newId) => {
  if (newId !== null) {
    fetchEventDetails(newId);
  }
});

=======
  if (!checkPermissions()) return;

  fetchAssociations();
  fetchTypeEvents();
  if (props.eventId) {
    fetchEventDetails(props.eventId);
  }
});
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
</script>

<template>
  <div
<<<<<<< HEAD
      class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Update Event</h2>

      <div v-if="isAdmin" class="mb-4">
        <label for="event-select" class="block text-sm font-medium leading-6 text-gray-900">Select Event</label>
        <select
            id="event-select"
            v-model="selectedEventId"
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="" disabled>Select an event</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.titre }}
          </option>
        </select>
      </div>

      <div v-if="isAssociationManager" class="mb-4">
        <label for="event-select" class="block text-sm font-medium leading-6 text-gray-900">Select Event</label>
        <select
            id="event-select"
            v-model="selectedEventId"
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="" disabled>Select an event</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.titre }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label for="titre" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
        <input
            type="text"
            id="titre"
            v-model="event.titre"
            required
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
=======
    class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg text-black"
  >
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">
        Update Event
      </h2>

      <div class="mb-4">
        <label
          for="titre"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Title</label
        >
        <input
          type="text"
          id="titre"
          v-model="event.titre"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        />
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
        <textarea
            id="description"
            v-model="event.description"
            required
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
=======
        <label
          for="description"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Description</label
        >
        <textarea
          id="description"
          v-model="event.description"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        ></textarea>
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="image" class="block text-sm font-medium leading-6 text-gray-900">Image URL</label>
        <input
            type="text"
            id="image"
            v-model="event.image"
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
=======
        <label
          for="image"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Image URL</label
        >
        <input
          type="text"
          id="image"
          v-model="event.image"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        />
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="date" class="block text-sm font-medium leading-6 text-gray-900">Date</label>
        <input
            type="datetime-local"
            id="date"
            v-model="event.date"
            required
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
=======
        <label
          for="date"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Date</label
        >
        <input
          type="datetime-local"
          id="date"
          v-model="event.date"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        />
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="localisation" class="block text-sm font-medium leading-6 text-gray-900">Localisation</label>
        <GoogleAutoCompleteComponent
            id="localisation"
            v-model="event.localisation"
            :value="event.localisation"
            required
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
=======
        <label
          for="localisation"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Localisation</label
        >
        <GoogleAutoCompleteComponent
          id="localisation"
          v-model="event.localisation"
          :value="event.localisation"
          @place-changed="handlePlaceChanged"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        />
      </div>

      <div v-if="isAdmin" class="mb-4">
<<<<<<< HEAD
        <label for="association" class="block text-sm font-medium leading-6 text-gray-900">Association</label>
        <div
            id="association"
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-gray-100"
=======
        <label
          for="association"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Association</label
        >
        <div
          id="association"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-gray-100"
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        >
          {{ event.association?.name }}
        </div>
      </div>

      <div class="mb-4" v-if="isAdmin">
<<<<<<< HEAD
        <label for="associationId" class="block text-sm font-medium leading-6 text-gray-900">Attribuer nouvelle
          Association</label>
        <select
            id="associationId"
            v-model="event.associationId"
            required
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option v-for="association in associations" :key="association.id" :value="association.id">
=======
        <label
          for="associationId"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Attribuer nouvelle Association</label
        >
        <select
          id="associationId"
          v-model="event.associationId"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option
            v-for="association in associations"
            :key="association.id"
            :value="association.id"
          >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
            {{ association.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="type_event_id" class="block text-sm font-medium leading-6 text-gray-900">Event Type</label>
        <select
            id="type_event_id"
            v-model="event.typeEventId"
            required
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option v-for="typeEvent in typeEvents" :key="typeEvent.id" :value="typeEvent.id">
=======
        <label
          for="type_event_id"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Event Type</label
        >
        <select
          id="type_event_id"
          v-model="event.typeEventId"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option
            v-for="typeEvent in typeEvents"
            :key="typeEvent.id"
            :value="typeEvent.id"
          >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
            {{ typeEvent.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="isPublic" class="block text-sm font-medium leading-6 text-gray-900">Public Event</label>
        <input
            type="checkbox"
            id="isPublic"
            v-model="event.isPublic"
            class="mt-1"
=======
        <label
          for="isPublic"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Public Event</label
        >
        <input
          type="checkbox"
          id="isPublic"
          v-model="event.isPublic"
          class="mt-1"
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        />
      </div>

      <button
<<<<<<< HEAD
          type="submit"
          class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
=======
        type="submit"
        class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      >
        Update Event
      </button>
    </form>
  </div>
</template>
