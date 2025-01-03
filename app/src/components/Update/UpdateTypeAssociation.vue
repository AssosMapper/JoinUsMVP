<script setup lang="ts">
<<<<<<< HEAD
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/store/usersStore';
import typeAssociationService from '@/services/typeAssociationService';
import { useRouter } from 'vue-router';
=======
import typeAssociationService from "@/services/typeAssociationService";
import { useUserStore } from "@/store/userStore";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

const userStore = useUserStore();
const router = useRouter();

const typeAssociation = ref({
  id: 0,
<<<<<<< HEAD
  name: '',
  description: '',
});

const selectedTypeAssociationId = ref<number | null>(null);
const availableTypeAssociations = ref<{ id: number, name: string }[]>([]);

const fetchTypeAssociations = async () => {
  try {
    availableTypeAssociations.value  = await typeAssociationService.getAllTypeAssociations();
  } catch (error) {
    console.error('Error fetching type associations:', error);
=======
  name: "",
  description: "",
});

const selectedTypeAssociationId = ref<number | null>(null);
const availableTypeAssociations = ref<{ id: number; name: string }[]>([]);

const fetchTypeAssociations = async () => {
  try {
    availableTypeAssociations.value =
      await typeAssociationService.getAllTypeAssociations();
  } catch (error) {
    console.error("Error fetching type associations:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const fetchTypeAssociationDetails = async (id: number) => {
  try {
<<<<<<< HEAD
    typeAssociation.value= await typeAssociationService.getTypeAssociationById(id);
  } catch (error) {
    console.error('Error fetching type association details:', error);
=======
    typeAssociation.value = await typeAssociationService.getTypeAssociationById(
      id
    );
  } catch (error) {
    console.error("Error fetching type association details:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const handleSubmit = async () => {
  try {
    const token = userStore.access_token;
    const { name, description } = typeAssociation.value;
<<<<<<< HEAD
    await typeAssociationService.updateTypeAssociation(typeAssociation.value.id, { name, description });
    await router.push('/');
  } catch (error) {
    console.error('Error updating type association:', error);
=======
    await typeAssociationService.updateTypeAssociation(
      typeAssociation.value.id,
      { name, description }
    );
    await router.push("/");
  } catch (error) {
    console.error("Error updating type association:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

onMounted(() => {
  fetchTypeAssociations();
});

watch(selectedTypeAssociationId, (newId) => {
  if (newId !== null) {
    fetchTypeAssociationDetails(newId);
  }
});
</script>

<template>
<<<<<<< HEAD
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Update Type Association</h2>

      <div class="mb-4">
        <label for="typeAssociationSelect" class="block text-sm font-medium leading-6 text-gray-900">Select Type Association</label>
=======
  <div
    class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg"
  >
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">
        Update Type Association
      </h2>

      <div class="mb-4">
        <label
          for="typeAssociationSelect"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Select Type Association</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <select
          id="typeAssociationSelect"
          v-model="selectedTypeAssociationId"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="" disabled>Select a type association</option>
<<<<<<< HEAD
          <option v-for="typeAssoc in availableTypeAssociations" :key="typeAssoc.id" :value="typeAssoc.id">
=======
          <option
            v-for="typeAssoc in availableTypeAssociations"
            :key="typeAssoc.id"
            :value="typeAssoc.id"
          >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
            {{ typeAssoc.name }}
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
          v-model="typeAssociation.name"
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
        <input
          type="text"
          id="description"
          v-model="typeAssociation.description"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
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

<<<<<<< HEAD
<style scoped>
</style>
=======
<style scoped></style>
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
