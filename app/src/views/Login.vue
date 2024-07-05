<script>
import { useRouter } from 'vue-router';
import authService from '@/services/authService';

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      const credentials = {
        email: this.email,
        password: this.password,
      };
      
      try {
        await authService.login(credentials);
        alert("Login successful!");
        this.router.push('/');
      } catch (error) {
        console.error("Error logging in:", error);
        alert("There was an error logging in.");
      }
    },
  },
};
</script>

<template>
  <div class="form-container w-4/5 flex justify-center text-center mx-auto my-10 py-8 border border-gray-300 rounded-lg">
    <form class="w-full max-w-md" @submit.prevent="handleLogin">
      <h2 class="text-2xl font-semibold leading-7 text-gray-900 mb-6">Login</h2>
      
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>
      
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="mt-1 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
        />
      </div>
      
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        >
          Connexion
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
</style>
