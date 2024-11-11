<script setup lang="ts">
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import { useNotificationStore } from "@/store/notificationStore.ts";

const notificationStore = useNotificationStore();
</script>

<template>
  <div class="h-screen w-full flex">
    <Navbar />
    <main
      class="w-full grid overflow-x-hidden overflow-y-auto max-w-full max-h-full"
    >
      <NotificationBanner />
      <router-view />
      <Footer />
    </main>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
