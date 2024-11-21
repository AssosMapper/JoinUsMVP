<script setup lang="ts">
import notificationService from "@/services/notificationService";
import { useUserStore } from "@/store";
import { useNotificationStore } from "@/store/notificationStore";
import { Notification } from "@shared/types/notification";
import { useInfiniteScroll } from "@vueuse/core";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import { computed, onMounted, ref } from "vue";
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const notificationsPanel = ref();
const notifications = ref<Notification[]>([]);
const page = ref(0);
const hasMore = ref(true);
const unreadCount = ref(0);
const containerRef = ref<HTMLElement | null>(null);
const loading = ref(false);
const isInitialLoad = ref(true);

const isAuthenticated = computed(() => userStore.isAuthenticated);

useInfiniteScroll(
  containerRef,
  async () => {
    if (
      hasMore.value &&
      !loading.value &&
      notifications.value.length > 0 &&
      !isInitialLoad.value
    ) {
      await loadNotifications();
    }
  },
  { distance: 10 }
);

const loadNotifications = async (reset = false) => {
  if (!isAuthenticated.value || loading.value) return;

  try {
    loading.value = true;
    isInitialLoad.value = reset;

    if (reset) {
      page.value = 0;
      notifications.value = [];
    }

    const [newNotifications, total] =
      await notificationService.getNotifications({
        skip: page.value * 10,
        take: 10,
      });

    notifications.value = reset
      ? (newNotifications as Notification[])
      : [...notifications.value, ...(newNotifications as Notification[])];

    hasMore.value = notifications.value.length < total;
    unreadCount.value = notifications.value.filter((n) => !n.isRead).length;

    page.value++;
  } catch (error) {
    notificationStore.showNotification(
      "Impossible de charger les notifications",
      "error"
    );
  } finally {
    loading.value = false;
    if (reset) isInitialLoad.value = false;
  }
};

const toggleNotifications = (event: Event) => {
  notificationsPanel.value.toggle(event);
  loadNotifications(true);
};

const deleteNotification = async (id: string) => {
  try {
    await notificationService.deleteNotification(id);
    notifications.value = notifications.value.filter((n) => n.id !== id);
    unreadCount.value = notifications.value.filter((n) => !n.isRead).length;
    notificationStore.showNotification("Notification supprimée", "success");
  } catch (error) {
    notificationStore.showNotification(
      "Impossible de supprimer la notification",
      "error"
    );
  }
};

onMounted(() => {
  if (isAuthenticated.value) {
    loadNotifications(true);
  }
});
</script>

<template>
  <div v-if="isAuthenticated" class="relative">
    <Button
      class="p-button-rounded overflow-visible p-button-text relative"
      @click="toggleNotifications"
    >
      <i class="pi pi-bell text-xl"></i>
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0 -right-[0.9px] bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10"
      >
        {{ unreadCount }}
      </span>
    </Button>

    <OverlayPanel ref="notificationsPanel" :showCloseIcon="true" class="w-96">
      <div
        ref="containerRef"
        class="flex flex-col max-h-[70vh] overflow-y-auto"
      >
        <div
          v-if="notifications.length === 0"
          class="p-4 text-center text-gray-500"
        >
          Notifications non trouvées
        </div>
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="p-4 border-b hover:bg-gray-50 cursor-pointer"
          :class="{ 'bg-blue-50': !notification.isRead }"
        >
          <div class="flex justify-between items-start">
            <div>
              <h6 class="font-bold mb-1">{{ notification.title }}</h6>
              <p class="text-sm text-gray-600">{{ notification.message }}</p>
            </div>
            <Button
              icon="pi pi-times"
              class="p-button-rounded p-button-text p-button-sm"
              @click="deleteNotification(notification.id)"
            />
          </div>
        </div>
        <div v-if="loading" class="p-3 text-center text-gray-500">
          <i class="pi pi-spin pi-spinner"></i>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<style scoped>
:deep(.p-overlaypanel) {
  @apply max-w-[90vw];
}

:deep(.p-overlaypanel-content) {
  @apply p-0;
}
</style>
