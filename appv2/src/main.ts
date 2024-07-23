import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from "@/router";

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


const app = createApp(App)

app.use(pinia)
app.use(router);

app.mount('#app')