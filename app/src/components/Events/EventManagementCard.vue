<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import { Event } from "@/types/event.types";
import { formatFullAddress } from "@shared/utils/address.util";
import { friendlyDate } from "@shared/utils/date";
import Button from "primevue/button";
import Card from "primevue/card";
import Tag from "primevue/tag";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getMediaUrl } from "@/utils/media.util";
import { Localisation } from "@shared/types/localisation";
import { useUserStore } from "@/store";

const router = useRouter();
const userStore = useUserStore();

const canManageEventStatus = computed(() => {
  return userStore.isAdmin || userStore.isEventsManager || userStore.isAssociationManager;
});

const props = defineProps<{
  event: Event;
}>();

const emit = defineEmits<{
  toggleValidation: [event: Event];
  editEvent: [eventId: string];
}>();

const isEventPast = computed(() => {
  return props.event.date < new Date();
});

const truncateDescription = (description: string, maxLength: number = 255) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + "...";
};

const goToEventDetails = () => {
  router.push({ name: "EventDetails", params: { id: props.event.id } });
};

const handleToggleValidation = (event: Event) => {
  emit('toggleValidation', event);
};

const handleEditEvent = (eventId: string) => {
  emit('editEvent', eventId);
};
</script>

<template>
  <Card
    class="flex flex-col bg-white rounded-xl border-primary shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)] transform transition-all duration-200 ease-in-out hover:shadow-[4px_4px_16px_-1px_rgba(0,0,0,0.15),8px_8px_20px_-4px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:bg-primary-hover/5"
  >
    <template #content>
      <div class="flex flex-col">
        <!-- Image pleine largeur -->
        <JnsImage
          :name="event.titre"
          :src="
            event.image
              ? getMediaUrl(event?.image?.filepath)
              : '/default-event.jpg'
          "
          size="lg"
          :rounded="false"
          class="w-full h-48 mb-4 event-card-image cursor-pointer"
          @click="goToEventDetails"
        />

        <!-- Header avec titre et visibilité -->
        <div class="flex justify-content-between align-items-start mb-3 px-4">
          <h3 class="text-lg font-semibold m-0 text-primary cursor-pointer" @click="goToEventDetails">
            {{ event.titre }}
          </h3>
          <div class="flex gap-1">
            <i v-if="event.isPublic" class="pi pi-eye text-green-500" title="Public"></i>
            <i v-else class="pi pi-eye-slash text-orange-500" title="Privé"></i>
          </div>
        </div>

        <!-- Association et type -->
        <div class="flex justify-content-between align-items-center mb-4 px-4">
          <div class="flex align-items-center gap-2">
            <i class="pi pi-users text-gray-500"></i>
            <span class="text-sm">
              <span v-if="event.association">{{ event.association.nom }}</span>
              <span v-else class="text-muted">Événement personnel</span>
            </span>
          </div>
          <Tag :value="event.typeEvent?.nom || 'Non défini'" />
        </div>

        <!-- Contenu principal -->
        <div class="flex flex-col p-4 border-t border-surface-300 dark:border-surface-700">
          <!-- Date et localisation -->
          <div class="flex flex-col gap-2 mb-4">
            <div class="flex items-center gap-2 text-gray-600">
              <i class="pi pi-calendar"></i>
              {{ friendlyDate(event.date) }}
            </div>
            <div v-if="event.localisation" class="flex items-center gap-2 text-gray-500">
              <i class="pi pi-map-marker"></i>
              {{ formatFullAddress(event.localisation as Localisation) }}
            </div>
          </div>

          <!-- Description -->
          <div class="flex flex-col justify-between flex-1 mb-4">
            <p class="text-gray-600 line-clamp-3">
              {{ truncateDescription(event.description) }}
            </p>
          </div>

          <!-- Statut de validation -->
          <div class="flex align-items-center gap-2 mb-4">
            <i class="pi pi-info-circle text-gray-500"></i>
            <Tag 
              :value="event.isValid ? 'Validé' : 'En attente'" 
              :severity="event.isValid ? 'success' : 'warning'"
            />
          </div>

          <!-- Actions de gestion -->
          <div class="flex flex-column gap-2">
            <Button
              label="Voir détails"
              icon="pi pi-eye"
              class="p-button-outlined"
              size="small"
              @click="goToEventDetails"
            />
            
            <div class="flex gap-2 justify-content-center">
              <!-- Bouton Valider/Annuler -->
              <Button  v-if="canManageEventStatus" 
                :icon="event.isValid ? 'pi pi-times' : 'pi pi-check'"
                :label="event.isValid ? 'Annuler' : 'Valider'"
                :class="event.isValid ? 'p-button-danger p-button-outlined' : 'p-button-success p-button-outlined'"
                size="small"
                @click="handleToggleValidation(event)"
              />
              
              <!-- Bouton Éditer -->
              <Button
                icon="pi pi-pencil"
                label="Éditer"
                class="p-button-info p-button-outlined"
                size="small"
                @click="handleEditEvent(event.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
:deep(.p-card-header) {
  padding: 0;
}

:deep(.p-card-body) {
  padding: 0;
}

.event-card-image :deep(.jns-placeholder),
.event-card-image :deep(img) {
  @apply rounded-t-lg;
}

.text-muted {
  color: #6c757d;
}
</style>