<script setup lang="ts">
<<<<<<< HEAD
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/usersStore';
import typeEventService from '@/services/typeEventService';
=======
import typeEventService from "@/services/typeEventService";
import { useUserStore } from "@/store/userStore";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

const userStore = useUserStore();
const router = useRouter();

const typeEvent = ref({
  id: 0,
<<<<<<< HEAD
  name: '',
  description: '',
});

const selectedTypeEventId = ref<number | null>(null);
const availableTypeEvents = ref<{ id: number, name: string }[]>([]);
=======
  name: "",
  description: "",
});

const selectedTypeEventId = ref<number | null>(null);
const availableTypeEvents = ref<{ id: number; name: string }[]>([]);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

const fetchTypeEvents = async () => {
  try {
    availableTypeEvents.value = await typeEventService.getAllTypeEvents();
  } catch (error) {
<<<<<<< HEAD
    console.error('Error fetching type events:', error);
=======
    console.error("Error fetching type events:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const fetchTypeEventDetails = async (id: number) => {
  try {
    typeEvent.value = await typeEventService.getTypeEventById(id);
<<<<<<< HEAD
    console.log('Type Event details:', typeEvent.value);
  } catch (error) {
    console.error('Error fetching type event details:', error);
=======
    console.log("Type Event details:", typeEvent.value);
  } catch (error) {
    console.error("Error fetching type event details:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

const handleSubmit = async () => {
  try {
    await typeEventService.updateTypeEvent(typeEvent.value.id, typeEvent.value);
<<<<<<< HEAD
    await router.push('/');
  } catch (error) {
    console.error('Error updating type event:', error);
=======
    await router.push("/");
  } catch (error) {
    console.error("Error updating type event:", error);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};

onMounted(() => {
  fetchTypeEvents();
});

watch(selectedTypeEventId, (newId) => {
  if (newId !== null) {
    fetchTypeEventDetails(newId);
  }
});
</script>

<template>
<<<<<<< HEAD
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Update Type Event</h2>

      <div class="mb-4">
        <label for="typeEventSelect" class="block text-sm font-medium leading-6 text-gray-900">Select Type Event</label>
=======
  <div
    class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg"
  >
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">
        Update Type Event
      </h2>

      <div class="mb-4">
        <label
          for="typeEventSelect"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Select Type Event</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <select
          id="typeEventSelect"
          v-model="selectedTypeEventId"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="" disabled>Select a type event</option>
<<<<<<< HEAD
          <option v-for="typeEvent in availableTypeEvents" :key="typeEvent.id" :value="typeEvent.id">
=======
          <option
            v-for="typeEvent in availableTypeEvents"
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
          v-model="typeEvent.name"
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
          v-model="typeEvent.description"
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
