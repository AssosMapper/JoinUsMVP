
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useBreakpoints } from '@vueuse/core';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import { debounce } from 'lodash';
import eventService from '@/services/eventService';
import UpdateEvent from '@/components/Update/UpdateEvent.vue';
import EventManagementCard from '@/components/Events/EventManagementCard.vue';
import type { EventDto } from '@shared/dto/events.dto';
import type {
  Event,
  EventFilters,
  EventPagination,
  EventSorting,
  FilteredEventsResponse
} from '@/types/event.types';
import { useUserStore } from '@/store';

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const userStore = useUserStore();

const canManageEventStatus = computed(() => {
  return userStore.isAdmin || userStore.isEventsManager || userStore.isAssociationManager;
});

const events = ref<Event[]>([]);
const loading = ref(false);
const filters = ref<EventFilters>({});
const pagination = ref<EventPagination>({
  page: 1,
  limit: 10,
  total: 0
});

// Modal d'édition
const editModalVisible = ref(false);
const selectedEvent = ref<EventDto | null>(null);

// Tri
const sorting = ref<EventSorting>({});

const validityOptions = [
  { label: 'Tous', value: undefined },
  { label: 'Validés', value: true },
  { label: 'En attente', value: false }
];

const debouncedLoadEvents = debounce(loadEvents, 500);

// Breakpoints pour la responsivité
const breakpoints = useBreakpoints({
  tablet: 1024,
  laptop: 1280,
  desktop: 1536,
});

const isDesktop = breakpoints.greater('tablet');

async function loadEvents() {
  loading.value = true;
  try {
    const response: FilteredEventsResponse = await eventService.getFilteredEvents(
      filters.value,
      pagination.value.page,
      pagination.value.limit,
      sorting.value.field,
      sorting.value.order
    );
    
    events.value = response.events;
    pagination.value.total = response.total;
  } catch (error) {
    console.error('Erreur:', error);
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger les événements',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
}

function onPageChange(event: any) {
  pagination.value.page = event.page + 1;
  pagination.value.limit = event.rows;
  loadEvents();
}

function onSort(event: any) {
  sorting.value.field = event.sortField;
  sorting.value.order = event.sortOrder === 1 ? 'asc' : 'desc';
  pagination.value.page = 1; // Reset à la première page lors du tri
  loadEvents();
}

function resetFilters() {
  filters.value = {};
  pagination.value.page = 1;
  loadEvents();
}

async function toggleValidation(event: Event) {
  const action = event.isValid ? 'annuler' : 'valider';
  const message = `Êtes-vous sûr de vouloir ${action} cet événement ?`;
  
  confirm.require({
    message: message,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        const updatedEvent = await eventService.updateEventStatus(event.id);
        
        // Mettre à jour l'événement dans la liste locale
        const index = events.value.findIndex(e => e.id === event.id);
        if (index !== -1) {
          events.value[index] = updatedEvent as unknown as Event;
        }
        
        toast.add({
          severity: 'success',
          summary: 'Succès',
          detail: `Événement ${updatedEvent.isValid ? 'validé' : 'annulé'} avec succès`,
          life: 3000
        });
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Vous n\'avez pas les permissions pour modifier le statut de cet événement',
          life: 3000
        });
      }
    }
  });
}

async function editEvent(eventId: string) {
  try {
    const event = await eventService.getEventById(eventId);
    selectedEvent.value = event;
    editModalVisible.value = true;
  } catch (error) {
    console.error('Erreur:', error);
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger l\'événement',
      life: 3000
    });
  }
}

function onEventUpdated(updatedEvent: EventDto) {
  // Mettre à jour l'événement dans la liste
  const index = events.value.findIndex(e => e.id === updatedEvent.id);
  if (index !== -1) {
    events.value[index] = updatedEvent as unknown as Event;
  }
  editModalVisible.value = false;
  selectedEvent.value = null;
  

}

function onUpdateCancelled() {
  editModalVisible.value = false;
  selectedEvent.value = null;
}

function navigateToCreateEvent() {
  router.push('/create-event');
}

function formatDate(date: Date | string) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function goToEventDetails(eventId: string) {
  router.push({ name: 'EventDetails', params: { id: eventId } });
}

onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.events-management {
  padding: 1rem;
}

.filters .field {
  min-width: 200px;
}

.filters .field label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.p-datatable .p-datatable-tbody > tr > td {
  padding: 0.75rem 1rem;
}

.text-muted {
  color: #6c757d;
}

/* Styles pour les cards */
.events-cards {
  width: 100%;
}

.event-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.event-card :deep(.p-card-header) {
  padding-bottom: 0;
}

.event-card :deep(.p-card-content) {
  padding-top: 1rem;
}

.event-card :deep(.p-card-footer) {
  padding-top: 0;
}

/* Animation skeleton */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.h-3 {
  height: 0.75rem;
}

.h-4 {
  height: 1rem;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.bg-gray-300 {
  background-color: #d1d5db;
}

.rounded {
  border-radius: 0.25rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.w-3\/4 {
  width: 75%;
}
</style>
<template>
  <div class="events-management">
    <div class="card">
      <div class="grid mb-4">
        <h1 class="text-primary text-2xl font-bold text-center">Gestion des Événements</h1>
        <Button 
          label="Créer un événement" 
          icon="pi pi-plus"
          size="small"
          class="bg-primary text-white justify-self-start"
          @click="navigateToCreateEvent"
        />
      </div>
      
      <!-- Filtres -->
      <div class="filters mb-4">
        <div class="flex flex-wrap gap-3 align-items-end">
          <div class="field">
            <label for="minDate">Date minimum</label>
            <Calendar 
              id="minDate" 
              v-model="filters.minDate" 
              dateFormat="dd/mm/yy"
              showIcon 
              placeholder="Sélectionnez une date"
              @date-select="loadEvents"
            />
          </div>
          
          <div class="field">
            <label for="maxDate">Date maximum</label>
            <Calendar 
              id="maxDate" 
              v-model="filters.maxDate" 
              dateFormat="dd/mm/yy"
              showIcon 
              placeholder="Sélectionnez une date"
              @date-select="loadEvents"
            />
          </div>
          
          <div class="field">
            <label for="search">Recherche</label>
            <InputText 
              id="search" 
              v-model="filters.search" 
              placeholder="Rechercher par titre..."
              @input="debouncedLoadEvents"
            />
          </div>
          
          <div class="field">
            <label for="isValid">Statut</label>
            <Dropdown 
              id="isValid" 
              v-model="filters.isValid" 
              :options="validityOptions" 
              optionLabel="label"
              optionValue="value"
              placeholder="Tous les statuts"
              @change="loadEvents"
            />
          </div>
          
          <div class="field">
            <Button 
              label="Réinitialiser" 
              icon="pi pi-refresh" 
              class="p-button-outlined"
              @click="resetFilters"
            />
          </div>
        </div>
      </div>
      
      <!-- Affichage conditionnel : Tableau ou Cards -->
      <div v-if="isDesktop">
        <!-- Tableau pour desktop -->
        <DataTable 
          :value="events" 
          :paginator="true" 
          :rows="pagination.limit"
          :totalRecords="pagination.total"
          :lazy="true"
          @page="onPageChange"
          @sort="onSort"
          :loading="loading"
          dataKey="id"
          class="p-datatable-gridlines"
        >
          <Column field="titre" header="Titre" sortable>
            <template #body="{ data }">
              <span class="font-semibold">{{ data.titre }}</span>
            </template>
          </Column>
          
          <Column field="date" header="Date" sortable>
            <template #body="{ data }">
              {{ formatDate(data.date) }}
            </template>
          </Column>
          
          <Column field="association.nom" header="Association">
            <template #body="{ data }">
              <span v-if="data.association">{{ data.association.nom }}</span>
              <span v-else class="text-muted">Événement personnel</span>
            </template>
          </Column>
          
          <Column field="typeEvent.nom" header="Type">
            <template #body="{ data }">
              <Tag :value="data.typeEvent?.nom || 'Non défini'" />
            </template>
          </Column>
          
          <Column field="isPublic" header="Visibilité">
            <template #body="{ data }">
              <i v-if="data.isPublic" class="pi pi-eye text-green-500" title="Public"></i>
              <i v-else class="pi pi-eye-slash text-orange-500" title="Privé"></i>
            </template>
          </Column>
          
          <Column field="isValid" header="Statut">
            <template #body="{ data }">
              <Tag 
                :value="data.isValid ? 'Validé' : 'En attente'" 
                :severity="data.isValid ? 'success' : 'warning'"
              />
            </template>
          </Column>
          
          <Column  header="Actions" :exportable="false">
            <template #body="{ data }">
              <div class="flex gap-2">
                <!-- Bouton Valider/Révoquer -->
                <Button v-if="canManageEventStatus"
                  :icon="data.isValid ? 'pi pi-times' : 'pi pi-check'"
                  :label="data.isValid ? 'Révoquer' : 'Valider'"
                  :class="data.isValid ? 'p-button-danger p-button-outlined' : 'p-button-success p-button-outlined'"
                  size="small"
                  @click="toggleValidation(data)"
                />
                
                <!-- Bouton Voir -->
                <Button 
                label="Voir"
                  icon="pi pi-eye"
                  class="p-button-outlined"
                  size="small"
                  @click="goToEventDetails(data.id)"
                />
                
                <!-- Bouton Éditer -->
                <Button 
                  v-if="data.canUpdateEvent"
                  icon="pi pi-pencil"
                  label="Éditer"
                  class="p-button-info p-button-outlined"
                  size="small"
                  @click="editEvent(data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Affichage en cards pour mobile/tablet -->
      <div v-else class="events-cards">
        <!-- Loading skeleton pour cards -->
        <div v-if="loading" class="flex flex-column gap-3">
          <Card v-for="i in pagination.limit" :key="i" class="event-card">
            <template #content>
              <div class="animate-pulse">
                <div class="h-4 bg-gray-300 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded mb-1"></div>
                <div class="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Cards des événements avec le nouveau composant -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <EventManagementCard 
            v-for="event in events" 
            :key="event.id" 
            :event="event"
            @toggle-validation="toggleValidation"
            @edit-event="editEvent"
          />
        </div>

        <!-- Pagination pour les cards -->
        <div v-if="!loading && events.length > 0" class="flex justify-content-center mt-4">
          <Button 
            v-if="pagination.page > 1"
            icon="pi pi-chevron-left" 
            class="p-button-outlined mr-2"
            @click="onPageChange({ page: pagination.page - 2, rows: pagination.limit })"
          />
          <span class="flex align-items-center px-3">
            Page {{ pagination.page }} sur {{ Math.ceil(pagination.total / pagination.limit) }}
          </span>
          <Button 
            v-if="pagination.page < Math.ceil(pagination.total / pagination.limit)"
            icon="pi pi-chevron-right" 
            class="p-button-outlined ml-2"
            @click="onPageChange({ page: pagination.page, rows: pagination.limit })"
          />
        </div>
      </div>
    </div>
    
    <!-- Dialog de confirmation -->
    <ConfirmDialog class="text-black" />
    
    <!-- Modal d'édition -->
    <Dialog 
      v-model:visible="editModalVisible" 
      modal 
      class="text-primary"
      :header="`Modifier l'événement: ${selectedEvent?.titre || ''}`"
      :style="{ width: '90vw', maxWidth: '800px' }"
      :dismissableMask="true"
    >
      <UpdateEvent 
        v-if="selectedEvent"
        :event="selectedEvent"
        @event-updated="onEventUpdated"
        @update-cancelled="onUpdateCancelled"
      />
    </Dialog>
  </div>
</template>
