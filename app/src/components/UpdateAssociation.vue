<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import associationService from '@/services/associationService';
import typeAssociationService from '@/services/typeAssociationService';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const isAdmin = store.getters['user/isAdmin'];
const isAssociationManager = store.getters['user/isAssociationManager'];

const association = ref({
  id: 0,
  name: '',
  address: '',
  code_postal: '',
  ville: '',
  description: '',
  image: '',
  user_id: store.state.user.id,
  typeIds: [] as number[],
  members: 0,
});

const selectedAssociationId = ref<number | null>(null);
const selectedTypeIds = ref<number[]>([]);
const availableAssociations = ref<{ id: number, name: string }[]>([]);
const availableTypes = ref<{ id: number, name: string }[]>([]);

const fetchTypes = async () => {
  try {
    const response = await typeAssociationService.getAllTypeAssociations();
    availableTypes.value = response.data;
  } catch (error) {
    console.error('Error fetching types:', error);
  }
};

const fetchAssociations = async () => {
  try {
    const response = await associationService.getAllAssociations();
    availableAssociations.value = response.data;
  } catch (error) {
    console.error('Error fetching associations:', error);
  }
};

const fetchAssociationDetails = async (id: number) => {
  try {
    const response = await associationService.getAssociationById(id);
    const data = response.data;
    association.value = {
      ...data,
      typeIds: data.types.map((type: any) => type.id),
      user_id: store.state.user.id
    };
    selectedTypeIds.value = data.types.map((type: any) => type.id);
  } catch (error) {
    console.error('Error fetching association details:', error);
  }
};

const handleSubmit = async () => {
  try {
    const token = store.state.user.access_token;
    const dataToSend = {
      ...association.value,
      typeIds: selectedTypeIds.value
    };
    delete dataToSend.types; 
    await associationService.updateAssociation(association.value.id, dataToSend, token);
    alert('Association updated successfully!');
    router.push('/');
  } catch (error) {
    console.error('Error updating association:', error);
    alert('There was an error updating the association.');
  }
};

onMounted(() => {
  fetchTypes();
  if (isAdmin) {
    fetchAssociations();
  } else if (isAssociationManager) {
    selectedAssociationId.value = store.state.user.associationId;
    fetchAssociationDetails(selectedAssociationId.value);
  }
});

watch(selectedAssociationId, (newId) => {
  if (newId !== null) {
    fetchAssociationDetails(newId);
  }
});
</script>

<template>
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Update Association</h2>

      <div v-if="isAdmin" class="mb-4">
        <label for="associationSelect" class="block text-sm font-medium leading-6 text-gray-900">Select Association</label>
        <select
          id="associationSelect"
          v-model="selectedAssociationId"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="" disabled>Select an association</option>
          <option v-for="assoc in availableAssociations" :key="assoc.id" :value="assoc.id">
            {{ assoc.name }}
          </option>
        </select>
      </div>

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
        <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
        <input
          type="text"
          id="address"
          v-model="association.address"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label for="code_postal" class="block text-sm font-medium leading-6 text-gray-900">Code Postal</label>
        <input
          type="text"
          id="code_postal"
          v-model="association.code_postal"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label for="ville" class="block text-sm font-medium leading-6 text-gray-900">Ville</label>
        <input
          type="text"
          id="ville"
          v-model="association.ville"
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
        Update
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
