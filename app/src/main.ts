import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from "./App.vue";
import router from "./router";
import './assets/main.scss';
import { useUserStore } from './store/usersStore';
import { loadGoogleMapsApi } from '@/utils/loadGoogleMapsApi';

const googleMapsApiKey = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

const userStore = useUserStore();

async function initializeApp() {
  try {
    await loadGoogleMapsApi(googleMapsApiKey);
    console.log("Google Maps API loaded");

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
