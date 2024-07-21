

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNotificationStore } from '../store/notificationStore.ts';

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
