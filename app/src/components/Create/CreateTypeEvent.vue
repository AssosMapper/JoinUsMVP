<script setup lang="ts">
<<<<<<< HEAD
import { ref } from 'vue';
import { useUserStore } from '@/store/usersStore';
import typeEventService from '@/services/typeEventService';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/store/notificationStore.ts';

const userStore = useUserStore();
=======
import typeEventService from "@/services/typeEventService";
import { useNotificationStore } from "@/store/notificationStore.ts";
import { ref } from "vue";
import { useRouter } from "vue-router";

>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
const router = useRouter();
const notificationStore = useNotificationStore();

const typeEvent = ref({
<<<<<<< HEAD
  name: '',
  description: '',
=======
  name: "",
  description: "",
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
});

const handleSubmit = async () => {
  try {
    await typeEventService.createTypeEvent(typeEvent.value);
<<<<<<< HEAD
    notificationStore.showNotification("Type d'évènement créé avec succès !", "success");
    await router.push('/');
  } catch (error) {
    console.error('Error creating type event:', error);
    notificationStore.showNotification("Erreur lors de la création d'un type d'évènement !", "error");
=======
    notificationStore.showNotification(
      "Type d'évènement créé avec succès !",
      "success"
    );
    await router.push("/");
  } catch (error) {
    console.error("Error creating type event:", error);
    notificationStore.showNotification(
      "Erreur lors de la création d'un type d'évènement !",
      "error"
    );
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
};
</script>

<template>
<<<<<<< HEAD
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Create Type Event</h2>
      
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
=======
  <div
    class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg"
  >
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">
        Create Type Event
      </h2>

      <div class="mb-4">
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
<<<<<<< HEAD
      
      <div class="mb-4">
        <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
=======

      <div class="mb-4">
        <label
          for="description"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Description</label
        >
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        <textarea
          id="description"
          v-model="typeEvent.description"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        ></textarea>
      </div>
<<<<<<< HEAD
      
=======

>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      <button
        type="submit"
        class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      >
        Create Type Event
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
