<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import userService from '@/services/usersService';
import {useNotificationStore} from '@/store/notificationStore.ts';
import GoogleAutoCompleteComponent from "@/components/GoogleAutoCompleteComponent.vue";
import {useForm} from "vee-validate";
import {registerSchema} from "@/types/security.types.ts";
import InputErrorMessage from "@/components/InputErrorMessage.vue";
import {useUserStore} from "@/store";

const router = useRouter();
const notificationStore = useNotificationStore();

// const firstName = ref("");
// const lastName = ref("");
// const email = ref("");
// const password = ref("");
// const confirmPassword = ref("");
// const phone = ref("");
const localisation = ref("");
// const image = ref("");

const {values, errors, defineField} = useForm({
  validationSchema: registerSchema,
});

const [firstName, firstNameAttrs] = defineField('firstName');
const [lastName, lastNameAttrs] = defineField('lastName');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');
const [phone, phoneAttrs] = defineField('phone');
// const [localisation, localisationAttrs] = defineField('localisation');
const [image, imageAttrs] = defineField('image');



const handleSubmit = async () => {

  const user = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    phone: phone.value,
    localisation: localisation.value,
    image: image.value
  };

  try {
    await useUserStore().register(user);
    await router.push('/login');
    notificationStore.showNotification("Profil créé avec succès !", "success");
  } catch (error) {
    notificationStore.showNotification("Erreur lors de la création du profil", "danger");
  }
};
</script>

<template>
  <div
      class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-4xl" @submit.prevent="handleSubmit">
      <div class="space-y-12">
        <div class="border-b border-gray-900/10 pb-12">
          <h2 class="text-base font-semibold leading-7 text-gray-900">Create User</h2>

          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="first-name" class="block text-sm font-medium leading-6 text-gray-900">First name</label>
              <input type="text" id="first-name" v-model="firstName" v-bind="firstNameAttrs" required
                     class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"/>
              <InputErrorMessage :error="errors.firstName" />
            </div>

            <div class="sm:col-span-3">
              <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Last name</label>
              <input type="text" id="last-name" v-model="lastName" v-bind="lastNameAttrs" required
                     class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"/>
              <InputErrorMessage :error="errors.lastName" />

            </div>

            <div class="sm:col-span-3">
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <input type="email" id="email" v-model="email" v-bind="emailAttrs" required
                     class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"/>
              <InputErrorMessage :error="errors.email" />
            </div>

            <div class="sm:col-span-3">
              <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone</label>
              <input type="text" id="phone" v-model="phone" v-bind="phoneAttrs"
                     class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"/>
              <InputErrorMessage :error="errors.phone" />
            </div>

            <div class="sm:col-span-3">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <input type="password" id="password" v-model="password" v-bind="passwordAttrs" required
                     class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"/>
              <InputErrorMessage :error="errors.password" />
            </div>

            <div class="sm:col-span-3">
              <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-900">Confirm
                Password</label>
              <input type="password" id="confirm-password" v-model="confirmPassword" v-bind="confirmPasswordAttrs" required
                     class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"/>
              <InputErrorMessage :error="errors.confirmPassword" />
            </div>

            <div class="col-span-full">
              <label for="address" class="block text-sm font-medium leading-6 text-gray-900">localisation</label>
              <GoogleAutoCompleteComponent
                  id="address"
                  v-model="localisation"
                  placeholder="Enter location"
                  required
                  class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"/>
            </div>

            <div class="col-span-full">
              <label for="image" class="block text-sm font-medium leading-6 text-gray-900">Image URL</label>
              <input type="text" id="image" v-model="image" v-bind="imageAttrs"
                     class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"/>
              <InputErrorMessage :error="errors.image" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="submit"
                :disabled="useUserStore().loader"
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          S'inscrire
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
</style>
