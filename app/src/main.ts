import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from "@/router";
import PrimeVue from 'primevue/config';

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


const app = createApp(App)
app.use(PrimeVue, {
    theme: 'none'
});

app.use(router);
app.use(pinia)

app.mount('#app')

