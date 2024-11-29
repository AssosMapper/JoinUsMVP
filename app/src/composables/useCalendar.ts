import { Event } from "@shared/types/event";
import { computed, ref } from "vue";

interface UseCalendarOptions {
  pageSize?: number;
  onMonthChange?: (year: number, month: number, page: number) => Promise<void>;
}

export function useCalendar(options: UseCalendarOptions = {}) {
  const { pageSize = 10, onMonthChange = async () => {} } = options;

  const events = ref<Event[]>([]);
  const currentPage = ref(1);
  const totalItems = ref(0);
  const isLoading = ref(false);

  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / pageSize);
  });

  const handleMonthChange = async ({
    year,
    month,
  }: {
    year: number;
    month: number;
  }) => {
    currentPage.value = 1;
    await onMonthChange(year, month, currentPage.value);
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages.value) {
      currentPage.value = newPage;
      const today = new Date();
      await onMonthChange(today.getFullYear(), today.getMonth() + 1, newPage);
    }
  };

  const updateEvents = (newEvents: Event[] = [], total: number = 0) => {
    events.value = Array.isArray(newEvents) ? newEvents : [];
    totalItems.value = total;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  return {
    events,
    currentPage,
    totalPages,
    isLoading,
    handleMonthChange,
    handlePageChange,
    updateEvents,
    setLoading,
  };
}
