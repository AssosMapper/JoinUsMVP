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
      class="w-full relative grid overflow-x-hidden overflow-y-auto max-w-full max-h-full lg:pb-0 pb-14"
    >
      <NotificationBanner />
      <router-view />
      <Footer class="footer absolute lg:bottom-0 bottom-14 
                     shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.1)]
                     z-10" />
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

.footer {
  left: 0;
  right: 0;
  bottom: 4.5rem;
}
</style>
