<script setup lang="ts">
import associationService from "@/services/associationService";
import eventService from "@/services/eventService";
import typeEventService from "@/services/typeEventService";
import { useUserStore } from "@/store/userStore";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import GoogleAutoCompleteComponent from "../GoogleAutoCompleteComponent.vue";

const userStore = useUserStore();
const router = useRouter();

const isAdmin = userStore.isAdmin;
const isAssociationManager = userStore.isAssociationManager;

const event = ref({
  titre: "",
  description: "",
  image: "",
  date: "",
  localisation: "",
  associationId: null as string | null,
  typeEventId: null as string | null,
  isPublic: true,
  association: null as any,
});

const selectedEventId = ref<number | null>(null);
const associations = ref<{ id: number; name: string }[]>([]);
const typeEvents = ref<{ id: number; name: string }[]>([]);
const events = ref<{ id: number; titre: string }[]>([]);

const fetchEventDetails = async (id: number) => {
  try {
    const eventData = await eventService.getEventById(id);
    console.log(eventData);
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
    console.log(event.value.association);
  } catch (error) {
    console.error("Error fetching event details:", error);
  }
};

const handleSubmit = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { association, id, ...dataToSend } = {
      ...event.value,
      associationId: event.value.associationId,
      typeEventId: event.value.typeEventId,
    };

    await eventService.updateEvent(selectedEventId.value, dataToSend);
    await router.push("/");
  } catch (error) {
    console.error("Error updating event:", error);
  }
};

const fetchAssociations = async () => {
  try {
    associations.value = await associationService.getAllAssociations();
  } catch (error) {
    console.error("Error fetching associations:", error);
  }
};

const fetchTypeEvents = async () => {
  try {
    typeEvents.value = await typeEventService.getAllTypeEvents();
  } catch (error) {
    console.error("Error fetching type events:", error);
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
    console.error("Error fetching events:", error);
  }
};

const handlePlaceChanged = (place: any) => {
  event.value.localisation = place.formatted_address;
};

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const formattedDate = new Date(date.getTime() - offset * 60 * 1000);
  return formattedDate.toISOString().slice(0, 16);
};

onMounted(() => {
  fetchAssociations();
  fetchTypeEvents();
  fetchEvents();
});

watch(selectedEventId, (newId) => {
  if (newId !== null) {
    fetchEventDetails(newId);
  }
});
</script>

<template>
  <div
    class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg"
  >
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">
        Update Event
      </h2>

      <div v-if="isAdmin" class="mb-4">
        <label
          for="event-select"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Select Event</label
        >
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
        <label
          for="event-select"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Select Event</label
        >
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
        />
      </div>

      <div class="mb-4">
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
        ></textarea>
      </div>

      <div class="mb-4">
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
        />
      </div>

      <div class="mb-4">
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
        />
      </div>

      <div class="mb-4">
        <label
          for="localisation"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Localisation</label
        >
        <GoogleAutoCompleteComponent
          id="localisation"
          v-model="event.localisation"
          :value="event.localisation"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div v-if="isAdmin" class="mb-4">
        <label
          for="association"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Association</label
        >
        <div
          id="association"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-gray-100"
        >
          {{ event.association?.name }}
        </div>
      </div>

      <div class="mb-4" v-if="isAdmin">
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
            {{ association.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
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
            {{ typeEvent.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
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
        />
      </div>

      <button
        type="submit"
        class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      >
        Update Event
      </button>
    </form>
  </div>
</template>
