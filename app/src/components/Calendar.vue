<script setup lang="ts">
import { Event } from "@shared/types/event";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import JnsImage from "./ui/JnsImage.vue";
import { formatFullAddress } from "@shared/utils/address.util";

interface Props {
  events: Event[];
  currentDate: Date;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const router = useRouter();
const selectedDate = ref(new Date());
const isMobile = ref(window.innerWidth < 768);

// const currentMonthYear = computed(() => {
//   return props.currentDate.toLocaleString("default", {
//     month: "long",
//     year: "numeric",
//   });
// });

const calendarDays = computed(() => {
  const year = props.currentDate.getFullYear();
  const month = props.currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  const week = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    week.push(new Date(year, month, -i));
  }
  week.reverse();

  for (let i = 1; i <= lastDay.getDate(); i++) {
    week.push(new Date(year, month, i));
    if (week.length === 7) {
      days.push(week.slice());
      week.length = 0;
    }
  }

  if (week.length > 0) {
    for (let i = 1; week.length < 7; i++) {
      week.push(new Date(year, month + 1, i));
    }
    days.push(week);
  }

  return days;
});

// Fonction utilitaire pour normaliser les dates
const normalizeDate = (date: Date | string) => {
  const d = new Date(date);
  const normalized = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  ).getTime();

  return normalized;
};

// Ajoutons un watcher pour voir les événements reçus
watch(
  () => props.events,
  (newEvents) => {
    console.log("Calendar received events:", newEvents);
  },
  { immediate: true }
);

const selectedDateEvents = computed(() => {
  const eventsArray = Array.isArray(props.events) ? props.events : [];
  return eventsArray.filter((event) => {
    const normalizedEventDate = normalizeDate(event.date);
    const normalizedSelectedDate = normalizeDate(selectedDate.value);

    return normalizedEventDate === normalizedSelectedDate;
  });
});

const getEventCountForDate = (date: Date) => {
  const eventsArray = Array.isArray(props.events) ? props.events : [];
  return eventsArray.filter((event) => {
    return normalizeDate(event.date) === normalizeDate(date);
  }).length;
};

const eventsByDate = computed(() => {
  const eventsMap: { [key: string]: Event[] } = {};
  const eventsArray = Array.isArray(props.events) ? props.events : [];

  if (eventsArray.length > 0) {
    eventsArray.forEach((event) => {
      const dateKey = normalizeDate(event.date).toString();
      if (!eventsMap[dateKey]) {
        eventsMap[dateKey] = [];
      }
      eventsMap[dateKey].push(event);
    });
  }
  return eventsMap;
});

const getEventsForDate = (date: Date) => {
  return eventsByDate.value[normalizeDate(date).toString()] || [];
};

const getImageSrc = (associationName: string) => {
  if (!associationName) return "/assets/associations-images/default.png";
  const sanitizedAssociationName = associationName
    .replace(/\s+/g, "")
    .toLowerCase();
  return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

const selectDate = (date: Date) => {
  selectedDate.value = date;
};

const isSelectedDate = (date: Date) => {
  return date.toDateString() === selectedDate.value.toDateString();
};

const formatTime = (dateString: string | Date) => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const goToAssociationDetails = (id: string) => {
  router.push({ name: "AssociationDetails", params: { id } });
};

const goToEventDetails = (id: string) => {
  router.push({ name: "EventDetails", params: { id } });
};

const emit = defineEmits<{
  "month-change": [{ year: number; month: number }];
}>();
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-full shadow-lg">
      <div class="px-8 md:py-0 md:px-4 dark:bg-gray-800 bg-white rounded-t">
        <div class="flex items-center justify-between overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="h-10">
                <th
                  v-for="day in ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']"
                  :key="day"
                >
                  <div class="w-full flex justify-center">
                    <p
                      class="text-base font-medium text-center text-gray-800 dark:text-gray-100"
                    >
                      {{ day }}
                    </p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="week in calendarDays" :key="week[0].toISOString()">
                <td
                  v-for="day in week"
                  :key="day.toISOString()"
                  class="relative"
                >
                  <div
                    @click="selectDate(day)"
                    class="px-1 md:px-2 py-3 cursor-pointer flex w-full justify-between items-center border border-gray-200 dark:border-gray-600 h-12"
                    :class="{ 'bg-indigo-700 rounded-lg': isSelectedDate(day) }"
                  >
                    <p
                      class="text-sm md:text-base font-medium"
                      :class="{
                        'text-gray-500 dark:text-gray-100':
                          day.getMonth() === currentDate.getMonth(),
                        'text-gray-300':
                          day.getMonth() !== currentDate.getMonth(),
                        'text-white': isSelectedDate(day),
                      }"
                    >
                      {{ day.getDate() }}
                    </p>
                    <div
                      v-if="getEventCountForDate(day) > 0"
                      class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-medium"
                    >
                      {{ getEventCountForDate(day) }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="flex justify-start py-2 md:px-16 px-5 dark:bg-gray-700 bg-gray-50 rounded-b"
      >
        <div class="px-4 flex w-full">
          <div v-if="selectedDateEvents.length > 0" class="w-full">
            <div
              v-for="event in selectedDateEvents"
              :key="event.id"
              class="justify-center w-full border-b pb-2 border-gray-400 border-dashed flex"
            >
              <div class="flex justify-center items-center">
                <JnsImage
                  :name="event.association?.name || ''"
                  :src="getImageSrc(event.association?.name || '')"
                  @click="goToAssociationDetails(event.association?.id)"
                  :alt="event.association?.name || 'Association'"
                  class="w-12 h-12 mr-4 clickable"
                  size="sm"
                />
              </div>
              <div
                class="descriptionEventContainer clickable max-w-full md:max-w-1/2"
                @click="goToEventDetails(event.id)"
              >
                <a
                  tabindex="0"
                  class="focus:outline-none text-lg font-medium leading-5 text-gray-800 dark:text-gray-100 mt-2"
                  >{{ event.titre }}</a
                >
                <p
                  class="text-xs pt-1 leading-4 leading-none text-gray-600 dark:text-gray-300"
                >
                  {{ formatFullAddress(event.localisation) }} |
                  {{ formatTime(event.date) }}
                </p>
                <p
                  class="text-sm pt-2 leading-4 leading-none text-gray-600 dark:text-gray-300"
                >
                  {{ event.description }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 dark:text-gray-300">
            Pas d'événements pour cette date.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
