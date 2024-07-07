<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "HomeView",
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);
    const user = computed(() => store.state.user);

    const logout = () => {
      store.dispatch('user/logoutUser');
      router.push('/login');
    };

    return {
      isAuthenticated,
      user,
      logout,
    };
  },
});
</script>

<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/register">Register</router-link> |
    <template v-if="isAuthenticated">
      <router-link to="/1312" @click.prevent="logout">Logout</router-link> | 
      <router-link to="/1312">{{ user.first_name }}</router-link>
    </template>
    <router-link v-else to="/login">Login</router-link>
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
