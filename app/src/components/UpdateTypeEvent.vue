<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import typeEventService from '@/services/typeEventService';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const typeEvent = ref({
  id: 0,
  name: '',
  description: '',
});

const selectedTypeEventId = ref<number | null>(null);
const availableTypeEvents = ref<{ id: number, name: string }[]>([]);

const fetchTypeEvents = async () => {
  try {
    const response = await typeEventService.getAllTypeEvents();
    availableTypeEvents.value = response.data;
  } catch (error) {
    console.error('Error fetching type events:', error);
  }
};

const fetchTypeEventDetails = async (id: number) => {
  try {
    const response = await typeEventService.getTypeEventById(id);
    typeEvent.value = response.data;
  } catch (error) {
    console.error('Error fetching type event details:', error);
  }
};

const handleSubmit = async () => {
  try {
    const token = store.state.user.access_token;
    await typeEventService.updateTypeEvent(typeEvent.value.id, typeEvent.value, token);
    alert('Type Event updated successfully!');
    router.push('/');
  } catch (error) {
    console.error('Error updating type event:', error);
    alert('There was an error updating the type event.');
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
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Update Type Event</h2>

      <div class="mb-4">
        <label for="typeEventSelect" class="block text-sm font-medium leading-6 text-gray-900">Select Type Event</label>
        <select
          id="typeEventSelect"
          v-model="selectedTypeEventId"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="" disabled>Select a type event</option>
          <option v-for="typeEvent in availableTypeEvents" :key="typeEvent.id" :value="typeEvent.id">
            {{ typeEvent.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
        <input
          type="text"
          id="name"
          v-model="typeEvent.name"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
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

<style scoped>
</style>
