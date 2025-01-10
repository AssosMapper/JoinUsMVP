<script setup lang="ts">
import notificationService from "@/services/notificationService";
import { useUserStore } from "@/store";
import { useNotificationStore } from "@/store/notificationStore";
import { Notification } from "@shared/types/notification";
import { useInfiniteScroll } from "@vueuse/core";
import { EventSourcePolyfill } from "event-source-polyfill";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

// Stores
const userStore = useUserStore();
const notificationStore = useNotificationStore();

// Refs
const notificationsPanel = ref();
const notifications = ref<Notification[]>([]);
const containerRef = ref<HTMLElement | null>(null);
const eventSource = ref<EventSourcePolyfill | null>(null);

// État de la pagination et du chargement
const page = ref(0);
const hasMore = ref(true);
const loading = ref(false);
const isInitialLoad = ref(true);

// État des notifications
const unreadCount = ref(0);
const isAuthenticated = computed(() => userStore.isAuthenticated);

// Configuration du défilement infini
useInfiniteScroll(
  containerRef,
  async () => {
    const shouldLoadMore =
      hasMore.value &&
      !loading.value &&
      notifications.value.length > 0 &&
      !isInitialLoad.value;

    if (shouldLoadMore) {
      await loadNotifications();
    }
  },
  { distance: 10 }
);

type MessageEventHandler = (event: MessageEvent) => void;

/**
 * Charge les notifications avec pagination
 * @param reset - Si true, réinitialise la pagination
 */
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

    // Mise à jour des notifications
    notifications.value = reset
      ? (newNotifications as Notification[])
      : [...notifications.value, ...(newNotifications as Notification[])];

    // Mise à jour de l'état
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

/**
 * Marque toutes les notifications non lues comme lues
 */
const markUnreadNotificationsAsRead = async () => {
  const unreadNotifications = notifications.value.filter((n) => !n.isRead);
  if (unreadNotifications.length === 0) return;

  try {
    const unreadIds = unreadNotifications.map((n) => n.id);
    await notificationService.markAsRead(unreadIds);

    // Mise à jour locale des notifications
    notifications.value = notifications.value.map((notification) => ({
      ...notification,
      isRead: unreadIds.includes(notification.id) ? true : notification.isRead,
    }));

    unreadCount.value = 0;
  } catch (error) {
    notificationStore.showNotification(
      "Impossible de marquer les notifications comme lues",
      "error"
    );
  }
};

/**
 * Gère la réception d'une nouvelle notification via SSE
 */
const handleNewNotification: MessageEventHandler = (event) => {
  try {
    const { notification, unreadCount: newUnreadCount } = JSON.parse(event.data);
    notifications.value.unshift(notification);
    unreadCount.value = newUnreadCount;
    notificationStore.showNotification("Nouvelle notification reçue", "info");
  } catch (error) {
    console.error("Erreur lors du parsing de la notification:", error);
  }
};

/**
 * Bascule l'affichage du panneau de notifications
 */
const toggleNotifications = async (event: Event) => {
  notificationsPanel.value.toggle(event);
  if (!notificationsPanel.value.visible) {
    await loadNotifications(true);
  }
};

/**
 * Supprime une notification
 */
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

// Surveille la fermeture du panel pour marquer les notifications comme lues
watch(
  () => notificationsPanel.value?.visible,
  async (newValue) => {
    if (!newValue) await markUnreadNotificationsAsRead();
  }
);

// Cycle de vie du composant
onMounted(async () => {
  await loadNotifications(true);
  eventSource.value = await notificationService.notificationStream();
  eventSource.value.addEventListener('message', handleNewNotification as EventListener);
});

onUnmounted(() => {
  if (eventSource.value) {
    eventSource.value.close();
    eventSource.value = null;
  }
});
</script>

<template>
  <div v-if="isAuthenticated" class="relative">
    <!-- Bouton de notification avec compteur -->
    <Button
      class="p-button-rounded overflow-visible text-gray-500 p-button-text relative"
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

    <!-- Panneau des notifications -->
    <OverlayPanel ref="notificationsPanel" :showCloseIcon="true" class="w-96">
      <div
        ref="containerRef"
        class="flex flex-col max-h-[70vh] overflow-y-auto"
      >
        <!-- Message si aucune notification -->
        <div
          v-if="notifications.length === 0"
          class="p-4 text-center text-gray-500"
        >
          Notifications non trouvées
        </div>

        <!-- Liste des notifications -->
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="p-4 border-b hover:bg-gray-50 cursor-pointer"
          :class="{ 'bg-blue-100/50': !notification.isRead }"
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

        <!-- Indicateur de chargement -->
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
