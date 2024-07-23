import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const message = ref('');
  const type = ref('success');
  const visible = ref(false);

  const showNotification = (msg: string, notifType: string) => {
    message.value = msg;
    type.value = notifType;
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, 3000); 
  };

  return {
    message,
    type,
    visible,
    showNotification,
  };
});
