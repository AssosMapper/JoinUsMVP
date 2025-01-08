<script setup lang="ts">
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
