<<<<<<< HEAD
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
=======
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const message = ref("");
  const type = ref("success");
  const visible = ref(false);
  const notificationTitle = ref("");

  const defaultText = computed(() => {
    if (type.value === "success") return "Succès";
    if (type.value === "info") return "Information";
    if (type.value === "warn") return "Attention";
    if (type.value === "error") return "Erreur";
    return "";
  });

  const showNotification = (
    msg: string,
    notifType: string,
    notifTitle?: string
  ) => {
    message.value = msg;
    type.value = notifType;
    notificationTitle.value = notifTitle ?? defaultText.value;
    visible.value = true;
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  };

  return {
    message,
    type,
    visible,
<<<<<<< HEAD
=======
    notificationTitle,
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    showNotification,
  };
});
