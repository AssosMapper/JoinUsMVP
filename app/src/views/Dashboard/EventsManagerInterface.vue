<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import eventService from "../../services/eventService.ts";

const router = useRouter();
const events = ref([]); 
const currentDate = ref(new Date()); 
// const selectedDate = ref(new Date()); 
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

        const response = await eventService.getEventsByMonth(year, month, isValid);

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

// const selectedDateEvents = computed(() => {
//     return events.value.filter(event => {
//         const eventDate = new Date(event.date);
//         return eventDate.toDateString() === selectedDate.value.toDateString();
//     });
// });

const goToEventDetails = (id: number) => {
    router.push({ name: 'EventDetails', params: { id } });
};

const toggleEventValidation = async (event: { id: string; isValid: boolean }) => {
    const confirmationMessage = event.isValid
        ? 'Voulez-vous vraiment invalider cet événement ?'
        : 'Voulez-vous vraiment valider cet événement ?';
    
    if (confirm(confirmationMessage)) {
        try {
            const updatedEvent = { isValid: !event.isValid };  
            await eventService.updateEvent(event.id, updatedEvent);
            alert('L\'événement a été mis à jour avec succès.');
            fetchEvents(selectedTab.value === 'valid' ? true : selectedTab.value === 'declined' ? false : undefined);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'événement :', error);
            alert('Une erreur est survenue lors de la mise à jour.');
        }
    }
};


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
  <div class="p-5">
    <h1 class="text-2xl font-bold mb-5">Interface Events Manager</h1>
    
    <nav class="mb-4">
      <button @click="changeTab('all')" :class="{'font-bold text-blue-600': selectedTab === 'all'}" class="mr-2">Tous les événements</button> |
      <button @click="changeTab('valid')" :class="{'font-bold text-blue-600': selectedTab === 'valid'}" class="mx-2">Événements validés</button> |
      <button @click="changeTab('declined')" :class="{'font-bold text-blue-600': selectedTab === 'declined'}" class="ml-2">Événements déclinés</button>
    </nav>

    <div class="flex items-center justify-between mb-4">
      <button @click="previousMonth" class="text-gray-600 hover:text-gray-800">Mois précédent</button>
      <span class="text-lg font-semibold">{{ currentMonthYear }}</span>
      <button @click="nextMonth" class="text-gray-600 hover:text-gray-800">Mois suivant</button>
    </div>

    <div v-if="loader" class="text-center text-lg">Chargement...</div>

    <div v-else class="events-list">
      <div v-if="events.length === 0" class="text-center text-gray-500">Aucun événement trouvé pour ce mois.</div>
      <ul v-else>
        <li v-for="event in events" :key="event.id" class="cursor-pointer p-4 border-b border-gray-200 hover:bg-gray-50 flex justify-between items-center">
          <div @click="goToEventDetails(event.id)" class="flex-1">
            <h3 class="text-xl font-semibold">{{ event.titre }}</h3>
            <p class="text-sm text-gray-600">{{ new Date(event.date).toLocaleDateString() }}</p>
            <p class="text-base">{{ event.description }}</p>
            <p class="text-sm text-gray-500">Localisation: {{ event.localisation }}</p>
            <p class="text-sm text-gray-500">Association: {{ event.association?.name }}</p>
          </div>
          <button
            @click="toggleEventValidation(event)"
            :class="event.isValid ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'"
            class="text-white font-semibold py-2 px-4 rounded">
            {{ event.isValid ? 'Invalider' : 'Valider' }}
          </button>
        </li>
      </ul>
    </div>

    <div class="flex justify-center items-center mt-4" v-if="totalPages > 1">
      <button @click="previousPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Précédent</button>
      <span class="mx-4">Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Suivant</button>
    </div>
  </div>
</template>
