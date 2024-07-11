<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../store/usersStore';
import typeEventService from '@/services/typeEventService';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const typeEvent = ref({
  name: '',
  description: '',
});

const handleSubmit = async () => {
  try {
    const token = userStore.access_token;
    await typeEventService.createTypeEvent(typeEvent.value, token);
    alert('Type Event created successfully!');
    router.push('/');
  } catch (error) {
    console.error('Error creating type event:', error);
    alert('There was an error creating the type event.');
  }
};
</script>

<template>
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Create Type Event</h2>
      
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
        <textarea
          id="description"
          v-model="typeEvent.description"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        ></textarea>
      </div>
      
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      >
        Create Type Event
      </button>
    </form>
  </div>
</template>

<style scoped>
</style>
