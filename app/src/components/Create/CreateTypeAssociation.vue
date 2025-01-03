<script setup lang="ts">
<<<<<<< HEAD
import { ref } from 'vue';
import { useUserStore } from '@/store/usersStore';
import typeAssociationService from '@/services/typeAssociationService';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/store/notificationStore.ts';
=======
import typeAssociationService from "@/services/typeAssociationService";
import { useNotificationStore } from "@/store/notificationStore.ts";
import { useUserStore } from "@/store/userStore";
import { ref } from "vue";
import { useRouter } from "vue-router";
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

const userStore = useUserStore();
const router = useRouter();
const notificationStore = useNotificationStore();

const typeAssociation = ref({
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
    await typeAssociationService.createTypeAssociation(typeAssociation.value);
<<<<<<< HEAD
    notificationStore.showNotification("Type d'association créé avec succès !", "success");
    await router.push('/');
  } catch (error) {
    notificationStore.showNotification("Erreur lors de la création d'un type d'association", "error");
=======
    notificationStore.showNotification(
      "Type d'association créé avec succès !",
      "success"
    );
    await router.push("/");
  } catch (error) {
    notificationStore.showNotification(
      "Erreur lors de la création d'un type d'association",
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
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Create Type Association</h2>
      
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
=======
  <div
    class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg"
  >
    <form class="w-full max-w-md" @submit.prevent="handleSubmit">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">
        Create Type Association
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
          v-model="typeAssociation.name"
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
          v-model="typeAssociation.description"
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
        Create Type Association
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
