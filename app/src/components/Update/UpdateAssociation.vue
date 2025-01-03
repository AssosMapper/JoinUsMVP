<script setup lang="ts">
<<<<<<< HEAD
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/store/usersStore';
import associationService from '@/services/associationService';
import typeAssociationService from '@/services/typeAssociationService';
import { useRouter } from 'vue-router';
import GoogleAutoCompleteComponent from '../GoogleAutoCompleteComponent.vue';
import { useNotificationStore } from "@/store/notificationStore.ts";

const userStore = useUserStore();
const router = useRouter();
const notificationStore = useNotificationStore();

const isLoading = ref(true);
const isAdmin = ref(userStore.isAdmin);
const isAssociationManager = ref(userStore.isAssociationManager);

const association = ref({
  id: '',
  createdAt: '',
  updatedAt: '',
  name: '',
  localisation: '',
  description: '',
  image: '',
  user_id: userStore.user.id,
  typeIds: [] as number[],
  members: 0,
  types: '',
  users: [] as any[] | undefined,
});

const selectedAssociationId = ref<string | null>(null);
const selectedTypeIds = ref<number[]>([]);
const availableAssociations = ref<{ id: number, name: string }[]>([]);
const availableTypes = ref<{ id: number, name: string }[]>([]);

const fetchTypes = async () => {
  try {
    availableTypes.value = await typeAssociationService.getAllTypeAssociations();
  } catch (error) {
    console.error('Error fetching types:', error);
=======
import associationService from "@/services/associationService";
import typeAssociationService from "@/services/typeAssociationService";
import { useNotificationStore } from "@/store/notificationStore.ts";
import { useUserStore } from "@/store/userStore";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import GoogleAutoCompleteComponent from "../GoogleAutoCompleteComponent.vue";

const userStore = useUserStore();
const router = useRouter();

const isAdmin = userStore.isAdmin;
const isAssociationManager = userStore.isAssociationManager;

const association = ref({
  id: "" as string,
  name: "",
  localisation: "",
  description: "",
  image: null as any,
  applicationQuestion: "",
  user_id: userStore.user?.id,
  typeIds: [] as string[],
});

const selectedAssociationId = ref<string | null>(null);
const selectedTypeIds = ref<string[]>([]);
const availableAssociations = ref<{ id: string; name: string }[]>([]);
const availableTypes = ref<{ id: string; name: string }[]>([]);

const fetchTypes = async () => {
  try {
    availableTypes.value =
      await typeAssociationService.getAllTypeAssociations();
  } catch (error) {
    console.error("Error fetching types:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const fetchAssociations = async () => {
  try {
    availableAssociations.value = await associationService.getAllAssociations();
  } catch (error) {
<<<<<<< HEAD
    console.error('Error fetching associations:', error);
=======
    console.error("Error fetching associations:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const fetchAssociationDetails = async (id: string) => {
  try {
    const assoData = await associationService.getAssociationById(id);
    association.value = {
      ...assoData,
      typeIds: assoData.types.map((type: any) => type.id),
<<<<<<< HEAD
    };
    selectedTypeIds.value = assoData.types.map((type: any) => type.id);
  } catch (error) {
    console.error('Error fetching association details:', error);
=======
      user_id: userStore.user?.id,
      image: assoData.image || null,
    };
    selectedTypeIds.value = assoData.types.map((type: any) => type.id);
  } catch (error) {
    console.error("Error fetching association details:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const handleSubmit = async () => {
  try {
<<<<<<< HEAD
    const { id, createdAt, updatedAt, types, ...rest } = association.value;

    const dataToSend = {
      ...rest,
      typeIds: selectedTypeIds.value,
      user_id: association.value.user_id,
    };

    if ('users' in dataToSend) {
      delete dataToSend.users;
    }

    console.log('Data to send:', JSON.stringify(dataToSend, null, 2));

    await associationService.updateAssociation(association.value.id, dataToSend);
    notificationStore.showNotification('Association mise à jour avec succès', 'success');
    await router.push('/');
  } catch (error) {
    console.error('Error updating association:', error);
=======
    const dataToSend = {
      name: association.value.name,
      description: association.value.description,
      localisation: association.value.localisation,
      typeIds: selectedTypeIds.value,
      image: association.value.image?.id || null,
      members: 0
    };

    await associationService.updateAssociation(
      selectedAssociationId.value || "",
      dataToSend
    );
    useNotificationStore().showNotification(
      "Association updated successfully",
      "success"
    );
    await router.push("/");
  } catch (error) {
    console.error("Error updating association:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

onMounted(async () => {
<<<<<<< HEAD
  console.log(userStore.user.association?.id);
  try {
    isLoading.value = true;
    await fetchTypes();

    // Assurez-vous que les données utilisateur sont bien chargées
    if (userStore.isAuth && userStore.user.association?.id) {
      selectedAssociationId.value = userStore.user.association.id;
      await fetchAssociationDetails(userStore.user.association.id);
    } else if (isAdmin.value) {
      await fetchAssociations();
    } else if (isAssociationManager.value) {
      if (userStore.user.association?.id !== null) {
        selectedAssociationId.value = userStore.user.association.id;
        await fetchAssociationDetails(userStore.user.association.id);
      }
    }
  } catch (error) {
    console.error('Error during initialization:', error);
  } finally {
    isLoading.value = false;
  }
});


=======
  fetchTypes();
  if (isAdmin) {
    fetchAssociations();
  } else if (isAssociationManager) {
    if (userStore.associationId !== null) {
      selectedAssociationId.value = userStore.associationId;
      fetchAssociationDetails(userStore.associationId);
    }
  }
});

>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
watch(selectedAssociationId, (newId) => {
  if (newId !== null) {
    fetchAssociationDetails(newId);
  }
});
</script>

<template>
<<<<<<< HEAD
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    <p>Loading...</p>
  </div>
  <div v-else class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Update Association</h2>

      <div v-if="isAdmin" class="mb-4">
        <label for="associationSelect" class="block text-sm font-medium leading-6 text-gray-900">Select Association</label>
=======
  <div
    class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg"
  >
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">
        Update Association
      </h2>

      <div v-if="isAdmin" class="mb-4">
        <label
          for="associationSelect"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Select Association</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <select
          id="associationSelect"
          v-model="selectedAssociationId"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="" disabled>Select an association</option>
<<<<<<< HEAD
          <option v-for="assoc in availableAssociations" :key="assoc.id" :value="assoc.id">
=======
          <option
            v-for="assoc in availableAssociations"
            :key="assoc.id"
            :value="assoc.id"
          >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
            {{ assoc.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
=======
        <label
          for="name"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Name</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <input
          type="text"
          id="name"
          v-model="association.name"
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
          type="text"
          id="localisation"
          v-model="association.localisation"
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
          v-model="association.description"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        ></textarea>
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label for="image" class="block text-sm font-medium leading-6 text-gray-900">Image</label>
        <input
          type="text"
          id="image"
          v-model="association.image"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label for="members" class="block text-sm font-medium leading-6 text-gray-900">Members</label>
        <input
          type="number"
          id="members"
          v-model="association.members"
=======
        <label
          for="applicationQuestion"
          class="block text-sm font-medium leading-6 text-gray-900"
        >Question d'adhésion</label>
        <textarea
          id="applicationQuestion"
          v-model="association.applicationQuestion"
          placeholder="Question posée aux membres souhaitant rejoindre l'association"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        ></textarea>
      </div>

      <div class="mb-4">
        <label
          for="image"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Image</label
        >
        <input
          type="text"
          id="image"
          v-model="association.image"
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
<<<<<<< HEAD
        <label class="block text-sm font-medium leading-6 text-gray-900">Type Associations</label>
        <div v-for="type in availableTypes" :key="type.id" class="flex items-center">
=======
        <label class="block text-sm font-medium leading-6 text-gray-900"
          >Type Associations</label
        >
        <div
          v-for="type in availableTypes"
          :key="type.id"
          class="flex items-center"
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
          <input
            type="checkbox"
            :id="`type-${type.id}`"
            :value="type.id"
            v-model="selectedTypeIds"
            class="mr-2"
          />
<<<<<<< HEAD
          <label :for="`type-${type.id}`" class="text-sm font-medium leading-6 text-gray-900">{{ type.name }}</label>
=======
          <label
            :for="`type-${type.id}`"
            class="text-sm font-medium leading-6 text-gray-900"
            >{{ type.name }}</label
          >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        </div>
      </div>

      <button
        type="submit"
<<<<<<< HEAD
        :disabled="selectedTypeIds.length === 0"
=======
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      >
        Update
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
