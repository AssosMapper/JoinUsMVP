<script setup lang="ts">
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import NotificationBanner from "@/components/Notification/NotificationBanner.vue";
import { useLayoutRefStore } from "@/store/layoutRefStore.ts";
// import { useNotificationStore } from "@/store/notificationStore.ts";

// const notificationStore = useNotificationStore();
const layoutRefStore = useLayoutRefStore();
</script>

<template>
  <div class="h-screen w-full flex">
    <Navbar />
    <main
      :ref="(el) => layoutRefStore.setMainRef(el as HTMLElement)"
      class="w-full grid overflow-x-hidden overflow-y-auto max-w-full max-h-full lg:pb-0 pb-14"
    >
      <NotificationBanner />
      <router-view />
      <Footer class="lg:block hidden" />
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
