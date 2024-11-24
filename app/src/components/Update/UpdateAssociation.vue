<script setup lang="ts">
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
  id: 0,
  name: "",
  localisation: "",
  description: "",
  image: "",
  user_id: userStore.id,
  typeIds: [] as number[],
  members: 0,
});

const selectedAssociationId = ref<number | null>(null);
const selectedTypeIds = ref<number[]>([]);
const availableAssociations = ref<{ id: number; name: string }[]>([]);
const availableTypes = ref<{ id: number; name: string }[]>([]);

const fetchTypes = async () => {
  try {
    availableTypes.value =
      await typeAssociationService.getAllTypeAssociations();
  } catch (error) {
    console.error("Error fetching types:", error);
  }
};

const fetchAssociations = async () => {
  try {
    availableAssociations.value = await associationService.getAllAssociations();
  } catch (error) {
    console.error("Error fetching associations:", error);
  }
};

const fetchAssociationDetails = async (id: number) => {
  try {
    const assoData = await associationService.getAssociationById(id);
    association.value = {
      ...assoData,
      typeIds: assoData.types.map((type: any) => type.id),
      user_id: userStore.id,
    };
    selectedTypeIds.value = assoData.types.map((type: any) => type.id);
  } catch (error) {
    console.error("Error fetching association details:", error);
  }
};

const handleSubmit = async () => {
  try {
    const { id, createdAt, updatedAt, types, ...rest } = association.value;

    const dataToSend = {
      ...rest,
      typeIds: selectedTypeIds.value,
      user_id: association.value.user_id,
    };

    delete dataToSend.users;

    console.log("Data to send:", JSON.stringify(dataToSend, null, 2));

    await associationService.updateAssociation(
      association.value.id,
      dataToSend
    );
    useNotificationStore().showNotification(
      "Association updated successfully",
      "success"
    );
    await router.push("/");
  } catch (error) {
    console.error("Error updating association:", error);
  }
};

onMounted(async () => {
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

watch(selectedAssociationId, (newId) => {
  if (newId !== null) {
    fetchAssociationDetails(newId);
  }
});
</script>

<template>
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
        <select
          id="associationSelect"
          v-model="selectedAssociationId"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="" disabled>Select an association</option>
          <option
            v-for="assoc in availableAssociations"
            :key="assoc.id"
            :value="assoc.id"
          >
            {{ assoc.name }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label
          for="name"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Name</label
        >
        <input
          type="text"
          id="name"
          v-model="association.name"
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
          type="text"
          id="localisation"
          v-model="association.localisation"
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
          v-model="association.description"
          required
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
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label
          for="members"
          class="block text-sm font-medium leading-6 text-gray-900"
          >Members</label
        >
        <input
          type="number"
          id="members"
          v-model="association.members"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium leading-6 text-gray-900"
          >Type Associations</label
        >
        <div
          v-for="type in availableTypes"
          :key="type.id"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :id="`type-${type.id}`"
            :value="type.id"
            v-model="selectedTypeIds"
            class="mr-2"
          />
          <label
            :for="`type-${type.id}`"
            class="text-sm font-medium leading-6 text-gray-900"
            >{{ type.name }}</label
          >
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

<style scoped></style>
