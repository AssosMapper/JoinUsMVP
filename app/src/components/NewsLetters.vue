

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');

const handleSubscribe = async () => {
  const subscriber = {
    email: email.value,
  };

  try {
    console.log("Subscribed email:", subscriber.email);
    alert("Subscription successful!");
  } catch (error) {
    console.error("Error subscribing:", error);
    alert("There was an error subscribing.");
  }
};
</script>

<template>
  <form class="newsletter-form" @submit.prevent="handleSubscribe">
    <input
      type="email"
      v-model="email"
      required
      placeholder="Votre email"
      class="mt-1 w-60 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
    />
    <button
      type="submit"
      class="bg-indigo-600 text-white font-semibold md:py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 text-sm"
    >
      S'inscrire à la NewsLetters
    </button>
  </form>
</template>
  
<style scoped>
  .newsletter-form {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  </style>
  