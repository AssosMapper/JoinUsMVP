<script setup lang="ts">
import typeAssociationService from "@/services/typeAssociationService";
import { useUserStore } from "@/store/userStore";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const typeAssociation = ref({
  id: 0,
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
  }
};

const fetchTypeAssociationDetails = async (id: number) => {
  try {
    typeAssociation.value = await typeAssociationService.getTypeAssociationById(
      id
    );
  } catch (error) {
    console.error("Error fetching type association details:", error);
  }
};

const handleSubmit = async () => {
  try {
    const token = userStore.access_token;
    const { name, description } = typeAssociation.value;
    await typeAssociationService.updateTypeAssociation(
      typeAssociation.value.id,
      { name, description }
    );
    await router.push("/");
  } catch (error) {
    console.error("Error updating type association:", error);
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
        <select
          id="typeAssociationSelect"
          v-model="selectedTypeAssociationId"
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        >
          <option value="" disabled>Select a type association</option>
          <option
            v-for="typeAssoc in availableTypeAssociations"
            :key="typeAssoc.id"
            :value="typeAssoc.id"
          >
            {{ typeAssoc.name }}
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
          v-model="typeAssociation.name"
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

<style scoped></style>
