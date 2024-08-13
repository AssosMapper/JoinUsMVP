<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import eventService from "../services/eventService.ts";

const events = ref([]); 
const currentDate = ref(new Date()); 
const selectedDate = ref(new Date()); 
const isMobile = ref(window.innerWidth < 768); 
const loader = ref(false); 
const currentPage = ref(1); 
const totalPages = ref(1); 
const pageSize = ref(20); 
const selectedTab = ref('all'); 

const fetchEvents = async (isValid: boolean | undefined = undefined) => {
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


const changeTab = (tab: string) => {
    selectedTab.value = tab;
    currentPage.value = 1; 
    let isValid: boolean | undefined;

    if (tab === 'valid') {
        isValid = true;
    } else if (tab === 'declined') {
        isValid = false;
    } else {
        isValid = undefined;
    }

    fetchEvents(isValid);
};

const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
    currentPage.value = 1;
    fetchEvents();
};

const previousMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
    currentPage.value = 1;
    fetchEvents();
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

const selectedDateEvents = computed(() => {
    const filteredEvents = events.value.filter(event => {
        const eventDate = new Date(event.date);
        console.log(`Comparing selectedDate (${selectedDate.value.toDateString()}) with eventDate (${eventDate.toDateString()})`);
        return eventDate.toDateString() === selectedDate.value.toDateString();
    });
    console.log('Selected Date Events:', filteredEvents);
    return filteredEvents;
});

onMounted(() => {
    fetchEvents(); 
    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth < 768; 
    });
});

const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});
</script>

<template>
  <div class="events-manager-interface">
    <h1>Interface Events Manager</h1>
    
    <nav>
      <button @click="changeTab('all')" :class="{ active: selectedTab === 'all' }">Tous les événements</button> |
      <button @click="changeTab('valid')" :class="{ active: selectedTab === 'valid' }">Événements validés</button> |
      <button @click="changeTab('declined')" :class="{ active: selectedTab === 'declined' }">Événements déclinés</button>
    </nav>

    <div class="month-navigation">
      <button @click="previousMonth">Mois précédent</button>
      <span>{{ currentMonthYear }}</span>
      <button @click="nextMonth">Mois suivant</button>
    </div>

    <div v-if="loader" class="loader">Chargement...</div>

    <div v-else class="events-list">
      <div v-if="events.length === 0" class="no-events">Aucun événement trouvé pour ce mois.</div>
      <ul v-else>
        <li v-for="event in events" :key="event.id">
          <h3>{{ event.titre }}</h3>
          <p>{{ event.date }}</p>
          <p>{{ event.description }}</p>
          <p>Localisation: {{ event.localisation }}</p>
          <p>Association: {{ event.association?.name }}</p>
        </li>
      </ul>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="previousPage" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
    </div>
  </div>
</template>

<style scoped>
.events-manager-interface {
  padding: 20px;
}

nav {
  margin-bottom: 20px;
}

button {
  padding: 10px;
  margin: 5px;
  cursor: pointer;
}

button.active {
  font-weight: bold;
  color: blue;
}

.month-navigation {
  margin-bottom: 20px;
}

.loader {
  text-align: center;
  font-size: 18px;
}

.events-list ul {
  list-style-type: none;
  padding: 0;
}

.events-list li {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  padding: 5px 10px;
}

.pagination span {
  margin: 0 10px;
}

.no-events {
  text-align: center;
  color: #999;
  font-size: 16px;
}
</style>
