<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useNotificationStore} from '@/store/notificationStore.ts';
import {useUserStore} from "@/store";
import {useForm} from 'vee-validate';
import {credentialSchema} from "@/types/security.types.ts";

const router = useRouter();
const notificationStore = useNotificationStore();


const {errors, defineField} = useForm<{email: string; password: string}>({
  validationSchema: credentialSchema,
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const handleLogin = async () => {
  const credentials = {
    email: email.value,
    password: password.value,
  };
  const userStore = useUserStore()
  try {
    await userStore.login(credentials);
    await router.push('/');
    notificationStore.showNotification("Connexion réussie !", "success");
  } catch (error) {
    console.error(error);
    notificationStore.showNotification("Email ou mot de passe incorrect. Veuillez réessayer", "error");
  }
};
</script>

<template>
  <div
      class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleLogin">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Login</h2>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
        <input
            type="email"
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            required
            :class="errors.email ? 'border-red-500' : 'border-gray-300'"
            class="mt-1 block w-full border rounded-md shadow-sm sm:text-sm p-2"
        />

        <span v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</span>
      </div>

      <div class="mb-6">
        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
        <input
            type="password"
            id="password"
            v-model="password"
            v-bind="passwordAttrs"
            required
            :class="errors.password ? 'border-red-500' : 'border-gray-300'"
            class="mt-1 block w-full border rounded-md  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
        <span v-if="errors.password" class="text-red-500 text-xs">{{ errors.password }}</span>
      </div>
      <div class="flex items-center justify-between">
        <button
            :disabled="useUserStore().loader"
            type="submit"
            class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        >
          Connexion
        </button>
      </div>
    </form>
  </div>
</template>
