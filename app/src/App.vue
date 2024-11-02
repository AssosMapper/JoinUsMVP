<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import NotificationBanner from '@/components/NotificationBanner.vue'
import {useNotificationStore} from '@/store/notificationStore.ts';
const notificationStore = useNotificationStore();
</script>

<template>
  <Navbar/>
  <NotificationBanner/>
  <router-view/>
  <Footer/>

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
