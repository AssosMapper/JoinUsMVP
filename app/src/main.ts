import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from "./App.vue";
import router from "./router";
import './assets/main.scss';
import { useUserStore } from './store/usersStore';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

const userStore = useUserStore();

async function initializeApp() {
  try {
    router.push('/');
    await userStore.checkTokenValidity();
    console.log("Token validity check completed");
    
  } catch (error) {
    console.error("Error during initialization:", error);
  }

  window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = '';
    return;
  });

  app.mount("#app");
}

initializeApp();
