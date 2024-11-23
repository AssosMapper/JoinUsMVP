import { useApi } from "@/composables/useApi";
import { useUserStore } from "@/store";
import { useApiStore } from "@/store/apiUrls.store";
import { Notification } from "@shared/types";
import { PaginationQuery } from "@shared/types/pagination-query";
import { EventSourcePolyfill } from "event-source-polyfill";

const notificationService = {
  getNotifications: async (params: PaginationQuery) => {
    const apiStore = useApiStore();
    const { data, error } = await useApi(
      apiStore.resolveUrl(apiStore.notifications.list, {
        skip: params.skip ? params.skip.toString() : undefined,
        take: params.take ? params.take.toString() : undefined,
      })
    ).json<[Notification[], number]>();

    if (error.value) throw error.value;
    return data.value;
  },

  deleteNotification: async (id: string) => {
    const apiStore = useApiStore();
    const { error } = await useApi(
      apiStore.resolveUrl(apiStore.notifications.delete, { id })
    ).delete();

    if (error.value) throw error.value;
  },

  markAsRead: async (ids: string[]) => {
    const apiStore = useApiStore();
    const { data, error } = await useApi(
      apiStore.notifications.markAsRead
    ).patch({ ids });

    if (error.value) throw error.value;
    return data.value;
  },
  notificationStream: async (): Promise<EventSourcePolyfill> => {
    const apiStore = useApiStore();
    const userStore = useUserStore();
    return new EventSourcePolyfill(
      apiStore.resolveWithBaseUrl(apiStore.notifications.notificationStream),
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    );
  },
};

export default notificationService;
