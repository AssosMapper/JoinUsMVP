
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import { debounce } from 'lodash';
import eventService from '@/services/eventService';
import UpdateEvent from '@/components/Update/UpdateEvent.vue';
import type { EventDto } from '@shared/dto/events.dto';
import type { 
  Event, 
  EventFilters, 
  EventPagination,
  EventSorting,
  FilteredEventsResponse 
} from '@/types/event.types';

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

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

function toggleValidation(event: Event) {
  const action = event.isValid ? 'révoquer' : 'valider';
  const message = `Êtes-vous sûr de vouloir ${action} cet événement ?`;
  
  confirm.require({
    message: message,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      toast.add({
        severity: 'info',
        summary: 'Action en attente',
        detail: `La fonctionnalité ${action} sera implémentée prochainement`,
        life: 3000
      });
    }
  });
}

async function editEvent(eventId: string) {
  try {
    loading.value = true;
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
  } finally {
    loading.value = false;
  }
}

function onEventUpdated(updatedEvent: EventDto) {
  // Mettre à jour l'événement dans la liste
  const index = events.value.findIndex(e => e.id === updatedEvent.id);
  if (index !== -1) {
    events.value[index] = updatedEvent as Event;
  }
  editModalVisible.value = false;
  selectedEvent.value = null;
  
  toast.add({
    severity: 'success',
    summary: 'Succès',
    detail: 'Événement mis à jour avec succès',
    life: 3000
  });
}

function onUpdateCancelled() {
  editModalVisible.value = false;
  selectedEvent.value = null;
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
</style>
<template>
  <div class="events-management">
    <div class="card">
      <h2>Gestion des Événements</h2>
      
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
      
      <!-- Tableau -->
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
        
        <Column header="Actions" :exportable="false">
          <template #body="{ data }">
            <div class="flex gap-2">
              <!-- Bouton Valider/Révoquer -->
              <Button
                :icon="data.isValid ? 'pi pi-times' : 'pi pi-check'"
                :label="data.isValid ? 'Révoquer' : 'Valider'"
                :class="data.isValid ? 'p-button-danger p-button-outlined' : 'p-button-success p-button-outlined'"
                size="small"
                @click="toggleValidation(data)"
              />
              
              <!-- Bouton Éditer -->
              <Button
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
    
    <!-- Dialog de confirmation -->
    <ConfirmDialog />
    
    <!-- Modal d'édition -->
    <Dialog 
      v-model:visible="editModalVisible" 
      modal 
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
