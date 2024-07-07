<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const first_name = computed(() => store.state.user.first_name)


const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])
const isAdmin = computed(() => store.getters['user/isAdmin'])
const isAssociationManager = computed(() => store.getters['user/isAssociationManager'])

const logout = () => {
  store.dispatch('user/logoutUser')
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
      <router-link to="/profile">{{ first_name }}</router-link>
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