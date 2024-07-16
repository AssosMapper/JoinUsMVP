<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />
  <router-view />
  <footer>
    <router-link to="/contactUs">Nous contacter</router-link> |
    <router-link to="/aboutUs">About us</router-link>
  </footer>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

footer{
  /* bottom: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem; */
}
</style>
