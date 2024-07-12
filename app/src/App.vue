<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from './store/usersStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const first_name = computed(() => userStore.first_name)

const isAuthenticated = computed(() => userStore.isAuthenticated)
const isAdmin = computed(() => userStore.isAdmin)
const isAssociationManager = computed(() => userStore.isAssociationManager)

const logout = () => {
  userStore.logoutUser()
  router.push('/login')
}
</script>

<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link v-if="isAdmin && isAuthenticated" to="/adminInterface">Admin Interface | </router-link> 
    <router-link v-if="(isAdmin || isAssociationManager) && isAuthenticated" to="/associationManagerInterface">Association Interface | </router-link> 
    <template v-if="isAuthenticated">
      <router-link to="/logout" @click.prevent="logout">Logout</router-link> | 
      <router-link to="/updateProfile">{{ first_name }}</router-link>
    </template>
    <template v-else>
      <router-link to="/register">Register</router-link> |
      <router-link to="/login">Login</router-link>
    </template>
  </nav>
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

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>