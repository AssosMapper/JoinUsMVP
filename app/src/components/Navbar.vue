<script setup lang="ts">
import {computed} from 'vue'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const first_name = computed(() => userStore.first_name)

const isAuthenticated = computed(() => userStore.isAuthenticated)
const isAdmin = computed(() => userStore.isAdmin)
const isAssociationManager = computed(() => userStore.isAssociationManager)
const isEventsManager = computed(() => userStore.isEventsManager)

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav>
    <RouterLink to="/" class="cursor-pointer">Home</RouterLink>
    |
    <router-link to="/displayEvents" class="cursor-pointer">Display Events</router-link>
    |
    <router-link to="/displayAssociations" class="cursor-pointer">Display Association</router-link>
    |
    <router-link v-if="isAdmin && isAuthenticated" to="/adminInterface" class="cursor-pointer">Admin Interface |
    </router-link>
    <router-link v-if="(isAdmin || isAssociationManager) && isAuthenticated" to="/associationManagerInterface"
                 class="cursor-pointer">Association Interface |
    </router-link>
    <router-link v-if="(isAdmin || isEventsManager) && isAuthenticated" to="/eventsManagerInterface"
                 class="cursor-pointer">Events Interface |
    </router-link>
    <template v-if="isAuthenticated">
      <span @click.prevent="logout" class="cursor-pointer">Logout</span> |
      <router-link to="/updateProfile" class="cursor-pointer">{{ first_name }}</router-link>
    </template>
    <template v-else>
      <router-link to="/register">Register</router-link>
      |
      <router-link to="/login">Login</router-link>
    </template>
  </nav>
</template>

<style scoped>
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
  