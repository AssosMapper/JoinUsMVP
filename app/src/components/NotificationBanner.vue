<script setup lang="ts">
<<<<<<< HEAD
import { computed } from 'vue';
import { useNotificationStore } from '@/store/notificationStore';

const notificationStore = useNotificationStore();
const visible = computed(() => notificationStore.visible);
const message = computed(() => notificationStore.message);
const type = computed(() => notificationStore.type);

const hideBanner = () => {
notificationStore.visible = false;
};
</script>

<template>
    <div v-if="visible" :class="['notification-banner', type]" @click="hideBanner">
      {{ message }}
    </div>
</template>

<style scoped>
.notification-banner {
    position: fixed;
    top: 60px; 
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    z-index: 1000;
    width: 80%;
    max-width: 500px;
    text-align: center;
}

.notification-banner.success {
    background-color: #38a169;
}

.notification-banner.error {
    background-color: #e53e3e;
}
</style>
=======
import { watch } from 'vue';
import { useNotificationStore } from '@/store/notificationStore';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';

const toast = useToast();
const notificationStore = useNotificationStore();

watch(() => notificationStore.visible, () => {
  if(notificationStore.visible){
    toast.add({
      severity: notificationStore.type as 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' | undefined,
      summary: notificationStore.notificationTitle,
      detail: notificationStore.message,
      life: 3000
    });
    notificationStore.visible = false;
  }
});

</script>

<template>
  <Toast position="top-right"/>
</template>
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
