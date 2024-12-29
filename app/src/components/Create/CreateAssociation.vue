<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import GoogleAutoCompleteComponent from '../GoogleAutoCompleteComponent.vue';
import {useNotificationStore} from "@/store/notificationStore";
import typeAssociationService from "@/services/typeAssociationService";
import {Association} from "@/types/association.types";
import associationService from "@/services/associationService";

const router = useRouter();
const notificationStore = useNotificationStore();
const loader = ref(false);

const association = ref<Association>({
  name: '',
  localisation: '',
  description: '',
  image: '',
  members: 0,
  typeIds: []
});

const selectedTypeIds = ref<string[]>([]);
const availableTypes = ref([]);

const handleSubmit = async () => {
  loader.value = true;
  try {
    association.value.typeIds = selectedTypeIds.value;
    await associationService.createAssociation(association.value);
    notificationStore.showNotification("L'association a été créée !", "success");
    await router.push('/');
  } catch (error) {
    console.error('Error creating association:', error);
    notificationStore.showNotification("Erreur lors de la création de l'association", "error");
  } finally {
    loader.value = false;
  }
};

const fetchTypes = async () => {
  loader.value = true;
  try {
    availableTypes.value = await typeAssociationService.getAllTypeAssociations();
  } catch (error) {
    console.error('Error fetching types:', error);
  } finally {
    loader.value = false;
  }
};

onMounted(fetchTypes);

</script>


<template>
  <div v-if="loader">Loading</div>
  <div v-else
       class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Create Association</h2>

      <div class="mb-4">
        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
        <input
            type="text"
            id="name"
            v-model="association.name"
            required
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label for="localisation" class="block text-sm font-medium leading-6 text-gray-900">Localisation</label>
        <GoogleAutoCompleteComponent
            type="text"
            id="localisation"
            v-model="association.localisation"
            required
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
        <textarea
            id="description"
            v-model="association.description"
            required
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        ></textarea>
      </div>

      <div class="mb-4">
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
            class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium leading-6 text-gray-900">Type Associations</label>
        <div v-for="type in availableTypes" :key="type.id" class="flex items-center">
          <input
              type="checkbox"
              :id="`type-${type.id}`"
              :value="type.id"
              v-model="selectedTypeIds"
              class="mr-2"
          />
          <label :for="`type-${type.id}`" class="text-sm font-medium leading-6 text-gray-900">{{ type.name }}</label>
        </div>
      </div>

      <button
          type="submit"
          class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      >
        Create
      </button>
    </form>
  </div>
</template>

<style scoped>
</style>
