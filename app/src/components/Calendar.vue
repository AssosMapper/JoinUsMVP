<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import eventService from "../services/eventService.ts";

const router = useRouter();
const events = ref([]);
const currentDate = ref(new Date());
const selectedDate = ref(new Date());
const isMobile = ref(window.innerWidth < 768);
const loader = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);

const fetchEvents = async (isValid: boolean = true) => {
    loader.value = true;
    try {
        const year = currentDate.value.getFullYear();
        const month = currentDate.value.getMonth() + 1;

        const response = await eventService.getEventsByMonth(year, month, currentPage.value, pageSize.value, isValid);

        if (Array.isArray(response)) {
            events.value = response;
            totalPages.value = 1;
        } else if (response && response.data) {
            events.value = response.data;
            totalPages.value = Math.ceil(response.total / pageSize.value);
        } else {
            events.value = [];
            totalPages.value = 1;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des événements :', error);
    } finally {
        loader.value = false;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchEvents();
    }
};

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchEvents();
    }
};

onMounted(() => {
    fetchEvents(true);
    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth < 768;
    });
});

const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
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

const selectedDateEvents = computed(() => {
    return events.value.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.value.toDateString();
    });
});

const getEventCountForDate = (date: Date) => {
    return events.value.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
    }).length;
};

const eventsByDate = computed(() => {
    const eventsMap: { [key: string]: Event[] } = {};
    if (events.value.length > 0) {
        events.value.forEach(event => {
            const eventDate = new Date(event.date).toDateString();
            if (!eventsMap[eventDate]) {
                eventsMap[eventDate] = [];
            }
            eventsMap[eventDate].push(event);
        });
    }
    return eventsMap;
});

const getEventsForDate = (date: Date) => {
    return eventsByDate.value[date.toDateString()] || [];
};

const getImageSrc = (associationName: string) => {
    if (!associationName) return '/assets/associations-images/default.png';
    const sanitizedAssociationName = associationName.replace(/\s+/g, '').toLowerCase();
    return `/assets/associations-images/${sanitizedAssociationName}.png`;
};

const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
    currentPage.value = 1;
    fetchEvents(true);
};

const previousMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
    currentPage.value = 1;
    fetchEvents(true);
};

const selectDate = (date: Date) => {
    selectedDate.value = date;
};

const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.value.toDateString();
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const goToAssociationDetails = (id: number) => {
    router.push({ name: 'AssociationDetails', params: { id } });
};

const goToEventDetails = (id: number) => {
    router.push({ name: 'EventDetails', params: { id } });
};
</script>

<template>
  <div class="flex items-center justify-center py-6">
    <div class="w-full shadow-lg">
      <div class="md:p-8 pt-2 dark:bg-gray-800 bg-white rounded-t">
        <div class="px-4 flex items-center justify-between">
          <span tabindex="0" class="focus:outline-none text-base font-bold dark:text-gray-100 text-gray-800">
            {{ currentMonthYear }}
          </span>
          <div class="flex items-center">
            <button @click="previousMonth" aria-label="calendar backward"
                    class="focus:text-gray-400 hover:text-gray-400 text-gray-800 dark:text-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-left" width="24"
                   height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                   stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <polyline points="15 6 9 12 15 18"/>
              </svg>
            </button>
            <button @click="nextMonth" aria-label="calendar forward"
                    class="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800 dark:text-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="24"
                   height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                   stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <polyline points="9 6 15 12 9 18"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between pt-4 md:pt-6 overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="h-10">
                <th v-for="day in ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']" :key="day">
                  <div class="w-full flex justify-center">
                    <p class="text-base font-medium text-center text-gray-800 dark:text-gray-100">{{ day }}</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="week in calendarDays" :key="week[0].toISOString()">
                <td v-for="day in week" :key="day.toISOString()" class="relative">
                  <div
                      @click="selectDate(day)"
                      class="px-1 md:px-2 py-3 cursor-pointer flex w-full justify-between items-center border border-gray-200 dark:border-gray-600 h-12"
                      :class="{'bg-indigo-700 rounded-lg': isSelectedDate(day)}"
                  >
                    <p
                        class="text-sm md:text-base font-medium"
                        :class="{
                          'text-gray-500 dark:text-gray-100': day.getMonth() === currentDate.getMonth(),
                          'text-gray-300': day.getMonth() !== currentDate.getMonth(),
                          'text-white': isSelectedDate(day)
                        }"
                    >
                      {{ day.getDate() }}
                    </p>
                    <div v-if="isMobile && getEventCountForDate(day) > 0"
                         class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                      {{ getEventCountForDate(day) }}
                    </div>
                    <div v-else-if="!isMobile" class="flex overflow-hidden h-4 max-w-[80%] absolute right-2">
                      <img v-for="event in getEventsForDate(day)"
                           :key="event.id"
                           :src="getImageSrc(event.association?.name || '')"
                           :alt="event.association?.name || 'Association'"
                           class="w-4 h-4 mr-1"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex justify-start py-2 md:px-16 px-5 dark:bg-gray-700 bg-gray-50 rounded-b">
        <div class="px-4 flex w-full">
          <div v-if="selectedDateEvents.length > 0" class="w-full">
            <div v-for="event in selectedDateEvents" :key="event.id"
                 class="justify-center w-full border-b pb-2 border-gray-400 border-dashed flex">
              <div class="flex justify-center items-center">
                <img :src="getImageSrc(event.association?.name || '')"
                     @click="goToAssociationDetails(event.association?.id)"
                     :alt="event.association?.name || 'Association'"
                     class="w-12 h-12 mr-4 clickable"
                />
              </div>
              <div class="descriptionEventContainer clickable max-w-full md:max-w-1/2"
                   @click="goToEventDetails(event.id)">
                <a tabindex="0"
                   class="focus:outline-none text-lg font-medium leading-5 text-gray-800 dark:text-gray-100 mt-2">{{
                    event.titre
                  }}</a>
                <p class="text-xs pt-1 leading-4 leading-none text-gray-600 dark:text-gray-300">{{ event.localisation }}
                  | {{ formatTime(event.date) }}</p>
                <p class="text-sm pt-2 leading-4 leading-none text-gray-600 dark:text-gray-300">{{
                    event.description
                  }}</p>
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

<style scoped>
</style>
