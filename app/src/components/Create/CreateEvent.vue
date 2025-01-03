<script setup lang="ts">
<<<<<<< HEAD
import { ref, onMounted, nextTick, watch } from 'vue';
import { useUserStore } from '@/store/usersStore';
import eventService from '@/services/eventService';
import associationService from '@/services/associationService';
import typeAssociationService from '@/services/typeAssociationService';
import typeEventService from '@/services/typeEventService';
import { useRouter } from 'vue-router';
import GoogleAutoCompleteComponent from '../GoogleAutoCompleteComponent.vue';
import { useNotificationStore } from '@/store/notificationStore.ts';
=======
import associationService from "@/services/associationService";
import eventService from "@/services/eventService";
import typeAssociationService from "@/services/typeAssociationService";
import typeEventService from "@/services/typeEventService";
import { useNotificationStore } from "@/store/notificationStore.ts";
import { useUserStore } from "@/store/userStore";
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import GoogleAutoCompleteComponent from "../GoogleAutoCompleteComponent.vue";
import { IEvent } from "@/types/event.types.ts";
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const isAdmin = userStore.isAdmin;
const isAssociationManager = userStore.isAssociationManager;
const isUser = userStore.isUser;

const event = ref({
<<<<<<< HEAD
  titre: '',
  description: '',
  image: '',
  date: '',
  localisation: '',
  associationId: null as string | null,
  typeEventId: null as string | null, 
=======
  titre: "",
  description: "",
  image: "",
  date: "",
  localisation: "",
  associationId: null as string | null,
  typeEventId: null as string | null,
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  isPublic: true,
  isValid: false,
});

<<<<<<< HEAD
const associations = ref<{ id: number, name: string }[]>([]);
const typeAssociations = ref<{ id: number, name: string }[]>([]);
const typeEvents = ref<{ id: number, name: string }[]>([]);
=======
const associations = reactive<{ id: number; name: string }[]>([{ id: 0, name: '' }]);
const typeAssociations = reactive<{ id: number; name: string }[]>([{ id: 0, name: '' }]);
const typeEvents = reactive<{ id: number; name: string }[]>([{ id: 0, name: '' }]);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
const selectedTypeAssociation = ref<string | null>(null);

const fetchAssociationByType = async () => {
  if (selectedTypeAssociation.value) {
    try {
      const associationName = `join-us-${selectedTypeAssociation.value.toLowerCase()}`;
<<<<<<< HEAD
      const association = await associationService.getAssociationByName(associationName);
=======
      const association = await associationService.getAssociationByName(
        associationName
      );
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      if (association) {
        event.value.associationId = association.id.toString();
      } else {
        event.value.associationId = null;
<<<<<<< HEAD
        notificationStore.showNotification("Aucune association trouvée pour ce type", "warning");
      }
    } catch (error) {
      console.error('Error fetching association by type:', error);
      notificationStore.showNotification("Erreur lors de la récupération de l'association", "error");
=======
        notificationStore.showNotification(
          "Aucune association trouvée pour ce type",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error fetching association by type:", error);
      notificationStore.showNotification(
        "Erreur lors de la récupération de l'association",
        "error"
      );
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    }
  }
};

const handleSubmit = async () => {
  try {
    event.value.isValid = isAdmin || isAssociationManager;

<<<<<<< HEAD
    const dataToSend = {
      ...event.value,
      associationId: userStore.user?.association?.id || null, 
      typeEventId: event.value.typeEventId, 
    };
    if (!userStore.user?.association) {
      dataToSend.associationId = null;
    }
    console.log(dataToSend);
    await eventService.createEvent(dataToSend);
    notificationStore.showNotification("Evenement créé avec succès !", "success");
    await router.push('/');
  } catch (error) {
    console.error('Error creating event:', error);
    notificationStore.showNotification("Erreur lors de la création de l'évènement", "error");
=======
    const dataToSend: Omit<IEvent, 'id'> = {
      ...event.value,
      associationId: userStore.user?.associationId ?? event.value.associationId,
      typeEventId: event.value.typeEventId,
    };
    console.log(dataToSend);
    await eventService.createEvent(dataToSend);
    notificationStore.showNotification(
      "Evenement créé avec succès !",
      "success"
    );
    await router.push("/");
  } catch (error) {
    console.error("Error creating event:", error);
    notificationStore.showNotification(
      "Erreur lors de la création de l'évènement",
      "error"
    );
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const fetchAssociations = async () => {
  try {
<<<<<<< HEAD
    associations.value = await associationService.getAllAssociations();
  } catch (error) {
    console.error('Error fetching associations:', error);
=======
    Object.assign(associations, await associationService.getAllAssociations());
  } catch (error) {
    console.error("Error fetching associations:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const fetchTypeEvents = async () => {
  try {
<<<<<<< HEAD
    const response: { id: number; name: string }[] = await typeEventService.getAllTypeEvents();
    typeEvents.value = response;
  } catch (error) {
    console.error('Error fetching type events:', error);
=======
    Object.assign(typeEvents, await typeEventService.getAllTypeEvents());
  } catch (error) {
    console.error("Error fetching type events:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const fetchTypeAssociations = async () => {
  try {
<<<<<<< HEAD
    typeAssociations.value = await typeAssociationService.getAllTypeAssociations();
  } catch (error) {
    console.error('Error fetching type associations:', error);
  }
};

=======
    Object.assign(typeAssociations, await typeAssociationService.getAllTypeAssociations());
  } catch (error) {
    console.error("Error fetching type associations:", error);
  }
};

// Watcher pour suivre la sélection du type d'association
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
watch(selectedTypeAssociation, async () => {
  await fetchAssociationByType();
});

onMounted(async () => {
  if (isAdmin) {
    await fetchAssociations();
  }
  await fetchTypeAssociations();
  await fetchTypeEvents();
  await nextTick();
});
</script>

<template>
<<<<<<< HEAD
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Create Event</h2>

      <div class="mb-4" v-if="isUser">
        <label for="type_association_id" class="block text-sm font-medium leading-6 text-gray-900">Type d'Association</label>
=======
  <div
    class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg"
  >
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">
        Create Event
      </h2>

      <div class="mb-4" v-if="isUser">
        <label
          for="type_association_id"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Type d'Association</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <select
          id="type_association_id"
          v-model="selectedTypeAssociation"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
<<<<<<< HEAD
          <option v-for="typeAssociation in typeAssociations" :key="typeAssociation.id" :value="typeAssociation.name">
=======
          <option
            v-for="typeAssociation in typeAssociations"
            :key="typeAssociation.id"
            :value="typeAssociation.name"
          >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
            {{ typeAssociation.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="titre" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
=======
        <label
          for="titre"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Title</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <input
          type="text"
          id="titre"
          v-model="event.titre"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
=======
        <label
          for="description"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Description</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <textarea
          id="description"
          v-model="event.description"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        ></textarea>
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="image" class="block text-sm font-medium leading-6 text-gray-900">Image URL</label>
=======
        <label
          for="image"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Image URL</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <input
          type="text"
          id="image"
          v-model="event.image"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="date" class="block text-sm font-medium leading-6 text-gray-900">Date</label>
=======
        <label
          for="date"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Date</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <input
          type="datetime-local"
          id="date"
          v-model="event.date"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="localisation" class="block text-sm font-medium leading-6 text-gray-900">Localisation</label>
=======
        <label
          for="localisation"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Localisation</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <GoogleAutoCompleteComponent
          id="localisation"
          v-model="event.localisation"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4" v-if="isAdmin">
<<<<<<< HEAD
        <label for="association_id" class="block text-sm font-medium leading-6 text-gray-900">Association</label>
=======
        <label
          for="association_id"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Association</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <select
          id="association_id"
          v-model="event.associationId"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
<<<<<<< HEAD
          <option v-for="association in associations" :key="association.id" :value="association.id">
=======
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
=======
        <label
          for="type_event_id"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Event Type</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <select
          id="type_event_id"
          v-model="event.typeEventId"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
<<<<<<< HEAD
          <option v-for="typeEvent in typeEvents" :key="typeEvent.id" :value="typeEvent.id">
=======
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

      <button
        type="submit"
        class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      >
        Create Event
      </button>
    </form>
  </div>
</template>

<<<<<<< HEAD
<style scoped>
</style>
=======
<style scoped></style>
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
