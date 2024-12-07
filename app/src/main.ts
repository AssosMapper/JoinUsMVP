import router from "@/router";
import "@shared/validations/config";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(PrimeVue, {
  theme: "none",
});

app.use(ToastService);
app.use(router);
app.use(pinia);

app.mount("#app");
