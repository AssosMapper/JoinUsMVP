<script setup lang="ts">
import NotificationBanner from "@/components/Notification/NotificationBanner.vue";
import { useLayoutRefStore } from "@/store/layoutRefStore.ts";
import Navbar from "./components/Navbar.vue";

const layoutRefStore = useLayoutRefStore();
</script>

<template>
  <div class="h-screen w-full flex">
    <Navbar />
    <main
      :ref="(el) => layoutRefStore.setMainRef(el as HTMLElement)"
      class="w-full grid overflow-x-hidden overflow-y-auto max-w-full h-full lg:pb-0"
    >
      <NotificationBanner />
      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* Custom Scrollbar with primary color*/
::-webkit-scrollbar {
  @apply w-2;
}

::-webkit-scrollbar-track {
  @apply bg-primary/10 rounded-full;
}

::-webkit-scrollbar-thumb {
  @apply bg-primary rounded-full;
}
</style>
