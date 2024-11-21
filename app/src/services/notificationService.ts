import { useApi } from "@/composables/useApi";
import { useApiStore } from "@/store/apiUrls.store";
import { Notification } from "@shared/types";
import { PaginationQuery } from "@shared/types/pagination-query";

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

  markAsRead: async (id: string) => {
    const apiStore = useApiStore();
    const { data, error } = await useApi(
      apiStore.resolveUrl(apiStore.notifications.markAsRead, { id })
    ).patch();

    if (error.value) throw error.value;
    return data.value;
  },
};

export default notificationService;
