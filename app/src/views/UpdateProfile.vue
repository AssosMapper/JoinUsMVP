<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/usersStore';
import userService from '@/services/usersService';
import { GoogleAutocomplete } from 'vue3-google-autocomplete';

const router = useRouter();
const userStore = useUserStore();

const firstName = ref(userStore.first_name);
const lastName = ref(userStore.last_name);
const email = ref(userStore.email);
const password = ref('');
const confirmPassword = ref('');
const roleId = ref(userStore.role?.id ?? null);
const phone = ref(userStore.phone);
const localisation = ref(userStore.address);
const image = ref(userStore.image);
const associationId = ref(userStore.associationId);

const googleMapsApiKey = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;

const validatePhone = (phone: string) => {
  const phoneRegex = /^0[1-9]\d{8}$/;
  return phoneRegex.test(phone);
};

const handleSubmit = async () => {
  if (!validatePhone(phone.value)) {
    alert("Invalid phone number format. The phone number must be 0+(de 1 a 9) + 8 chiffres.");
    return;
  }

  if (roleId.value === null) {
    alert("Role ID is required.");
    return;
  }
  
  const user = {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    roleId: roleId.value, 
    phone: phone.value,
    localisation: localisation.value,
    image: image.value,
    dateCreated: userStore.dateCreated,
    associationId: associationId.value
  };

  try {
    await userService.updateUser(userStore.id as number, user, userStore.access_token);
    await userStore.fetchUserDetails(); 
    alert("User updated successfully!");
    router.push('/');
  } catch (error) {
    console.error("Error updating user:", error);
    alert("There was an error updating the user.");
  }
};

const handlePlaceChanged = (place: any) => {
  localisation.value = place.formatted_address;
};
</script>

<template>
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-4xl" @submit.prevent="handleSubmit">
      <div class="space-y-12">
        <div class="border-b border-gray-900/10 pb-12">
          <h2 class="text-base font-semibold leading-7 text-gray-900">Update Profile</h2>

          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">First name</label>
              <input type="text" id="first-name" v-model="firstName" required class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-3">
              <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Last name</label>
              <input type="text" id="last-name" v-model="lastName" required class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-3">
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <input type="email" id="email" v-model="email" required class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-3">
              <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone</label>
              <input type="text" id="phone" v-model="phone" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-3">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <input type="password" id="password" v-model="password" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-3">
              <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
              <input type="password" id="confirm-password" v-model="confirmPassword" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-2">
              <label for="role-id" class="block text-sm font-medium leading-6 text-gray-900">Role ID</label>
              <input type="number" id="role-id" v-model="roleId" required class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>

            <div class="sm:col-span-2">
              <label for="address" class="block text-sm font-medium leading-6 text-gray-900">Localisation</label>
              <GoogleAutocomplete
                id="address"
                v-model="localisation"
                placeholder="Enter location"
                :apiKey="googleMapsApiKey"
                @placechanged="handlePlaceChanged"
                :options="{ types: ['geocode'] }"
                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>

            <div class="col-span-full">
              <label for="image" class="block text-sm font-medium leading-6 text-gray-900">Image URL</label>
              <input type="text" id="image" v-model="image" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
        <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
</style>
