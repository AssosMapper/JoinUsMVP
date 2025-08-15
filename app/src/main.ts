import "reflect-metadata";
import "@/assets/styles/variables.css";
import router from "@/router";
import "@shared/validations/config";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import { fr } from "primelocale/js/fr.js";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(PrimeVue, {
  theme: "none",
  locale: fr
});

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
}

app.use(ToastService);
app.use(ConfirmationService);
app.use(router);
app.use(pinia);

app.mount("#app");
