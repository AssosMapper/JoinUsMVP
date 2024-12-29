<script setup lang="ts">
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

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const isAdmin = userStore.isAdmin;
const isAssociationManager = userStore.isAssociationManager;
const isUser = userStore.isUser;

const event = ref({
  titre: "",
  description: "",
  image: "",
  date: "",
  localisation: "",
  associationId: null as string | null,
  typeEventId: null as string | null,
  isPublic: true,
  isValid: false,
});

const associations = reactive<{ id: number; name: string }[]>([{ id: 0, name: '' }]);
const typeAssociations = reactive<{ id: number; name: string }[]>([{ id: 0, name: '' }]);
const typeEvents = reactive<{ id: number; name: string }[]>([{ id: 0, name: '' }]);
const selectedTypeAssociation = ref<string | null>(null);

const fetchAssociationByType = async () => {
  if (selectedTypeAssociation.value) {
    try {
      const associationName = `join-us-${selectedTypeAssociation.value.toLowerCase()}`;
      const association = await associationService.getAssociationByName(
        associationName
      );
      if (association) {
        event.value.associationId = association.id.toString();
      } else {
        event.value.associationId = null;
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
    }
  }
};

const handleSubmit = async () => {
  try {
    event.value.isValid = isAdmin || isAssociationManager;

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
  }
};

const fetchAssociations = async () => {
  try {
    Object.assign(associations, await associationService.getAllAssociations());
  } catch (error) {
    console.error("Error fetching associations:", error);
  }
};

const fetchTypeEvents = async () => {
  try {
    Object.assign(typeEvents, await typeEventService.getAllTypeEvents());
  } catch (error) {
    console.error("Error fetching type events:", error);
  }
};

const fetchTypeAssociations = async () => {
  try {
    Object.assign(typeAssociations, await typeAssociationService.getAllTypeAssociations());
  } catch (error) {
    console.error("Error fetching type associations:", error);
  }
};

// Watcher pour suivre la sélection du type d'association
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
        <select
          id="type_association_id"
          v-model="selectedTypeAssociation"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option
            v-for="typeAssociation in typeAssociations"
            :key="typeAssociation.id"
            :value="typeAssociation.name"
          >
            {{ typeAssociation.name }}
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
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4" v-if="isAdmin">
        <label
          for="association_id"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Association</label
        >
        <select
          id="association_id"
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

      <button
        type="submit"
        class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      >
        Create Event
      </button>
    </form>
  </div>
</template>

<style scoped></style>
