<script setup lang="ts">
import Calendar from "@/components/Calendar.vue";
import EventList from "@/components/EventsList.vue";
import { useCalendar } from "@/composables/useCalendar";
import eventService from "@/services/eventService";
import { defineAsyncComponent, onMounted, ref, shallowRef, unref } from "vue";

const components = {
  Calendar: defineAsyncComponent(() => import("../components/Calendar.vue")),
  Map: defineAsyncComponent(() => import("../components/Map.vue")) as any,
  CreateEvent: defineAsyncComponent(
    () => import("../components/Create/CreateEvent.vue")
  ),
} as const;

const currentView = shallowRef<keyof typeof components>("Calendar");
const pastEvents = ref([]);
const todayEvents = ref([]);
const upcomingEvents = ref([]);

const fetchCalendarEvents = async (
  year: number,
  month: number,
  page: number
) => {
  calendar.setLoading(true);
  try {
    const response = await eventService.getEventsByMonth(
      year,
      month,
      page,
      10,
      true
    );
    calendar.updateEvents(response.data, response.total);
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
  } finally {
    calendar.setLoading(false);
  }
};

const calendar = useCalendar({
  pageSize: 10,
  onMonthChange: fetchCalendarEvents,
});

onMounted(() => {
  const today = new Date();
  fetchCalendarEvents(today.getFullYear(), today.getMonth() + 1, 1);
  const todayStr = today.toISOString().split("T")[0];
  fetchEventsByDate(todayStr, 5);
});

const fetchEventsByDate = async (date: string, limit: number) => {
  try {
    const events = await eventService.getEventsByDate(date, limit);
    pastEvents.value = events.pastEvents;
    todayEvents.value = events.todayEvents;
    upcomingEvents.value = events.upcomingEvents;
    console.log("eventByDate", events);
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};
</script>

<template>
  <div class="association-manager-interface">
    <nav>
      <button @click="currentView = 'Calendar'">Calendar</button> |
      <button @click="currentView = 'Map'">Map</button> |
      <button @click="currentView = 'CreateEvent'">Submit Event</button>
    </nav>

    <template v-if="currentView === 'Calendar'">
      <Calendar
        :events="unref(calendar.events)"
        :current-page="unref(calendar.currentPage)"
        :total-pages="unref(calendar.totalPages)"
        :is-loading="unref(calendar.isLoading)"
        @month-change="calendar.handleMonthChange"
        @page-change="calendar.handlePageChange"
      />
    </template>
    <component v-else :is="components[currentView]"></component>

    <EventList title="Today's Events" :events="todayEvents" />
    <EventList title="Past Events" :events="pastEvents" />
    <EventList title="Upcoming Events" :events="upcomingEvents" />
  </div>
</template>

<style scoped>
.association-manager-interface {
  padding: 20px;
}
</style>
