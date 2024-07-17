<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import eventService from '@/services/eventService';
import type { Event } from '@/interfaces/event';

const events = ref<Event[]>([]);
const currentDate = ref(new Date());
const selectedDate = ref(new Date());

const fetchEvents = async () => {
  try {
    const response = await eventService.getAllEvents();
    events.value = response;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

onMounted(fetchEvents);

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

  // Add days from previous month
  for (let i = 0; i < firstDay.getDay(); i++) {
    week.push(new Date(year, month, -i));
  }
  week.reverse();

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    week.push(new Date(year, month, i));
    if (week.length === 7) {
      days.push(week.slice());
      week.length = 0;
    }
  }

  // Add days from next month
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

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
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
</script>

<template>
    <div class="flex items-center justify-center py-8 px-4">
      <div class="w-full shadow-lg">
        <div class="md:p-8 p-5 dark:bg-gray-800 bg-white rounded-t">
          <div class="px-4 flex items-center justify-between">
            <span tabindex="0" class="focus:outline-none text-base font-bold dark:text-gray-100 text-gray-800">
              {{ currentMonthYear }}
            </span>
            <div class="flex items-center">
              <button @click="previousMonth" aria-label="calendar backward" class="focus:text-gray-400 hover:text-gray-400 text-gray-800 dark:text-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="15 6 9 12 15 18" />
                </svg>
              </button>
              <button @click="nextMonth" aria-label="calendar forward" class="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800 dark:text-gray-100"> 
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between pt-12 overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr>
                  <th v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="day">
                    <div class="w-full flex justify-center">
                      <p class="text-base font-medium text-center text-gray-800 dark:text-gray-100">{{ day }}</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="week in calendarDays" :key="week[0].toISOString()">
                  <td v-for="day in week" :key="day.toISOString()" class="pt-6">
                    <div 
                      @click="selectDate(day)"
                      class="px-2 py-2 cursor-pointer flex w-full justify-center"
                      :class="{'bg-indigo-700 rounded-full': isSelectedDate(day)}"
                    >
                      <p 
                        class="text-base font-medium"
                        :class="{
                          'text-gray-500 dark:text-gray-100': day.getMonth() === currentDate.getMonth(),
                          'text-gray-300': day.getMonth() !== currentDate.getMonth(),
                          'text-white': isSelectedDate(day)
                        }"
                      >
                        {{ day.getDate() }}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="md:py-8 py-5 md:px-16 px-5 dark:bg-gray-700 bg-gray-50 rounded-b">
          <div class="px-4">
            <div v-if="selectedDateEvents.length > 0">
              <div v-for="event in selectedDateEvents" :key="event.id" class="border-b pb-4 border-gray-400 border-dashed">
                <p class="text-xs font-light leading-3 text-gray-500 dark:text-gray-300">{{ formatTime(event.date) }}</p>
                <a tabindex="0" class="focus:outline-none text-lg font-medium leading-5 text-gray-800 dark:text-gray-100 mt-2">{{ event.titre }}</a>
                <p class="text-sm pt-2 leading-4 leading-none text-gray-600 dark:text-gray-300">{{ event.description }}</p>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 dark:text-gray-300">
              No events for this date.
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

