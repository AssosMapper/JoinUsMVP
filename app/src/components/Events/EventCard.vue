<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import ParticipateEventButton from "@/components/Events/ParticipateEventButton.vue";
import { EventCard, EventParticipation } from "@/types/event.types";
import { formatFullAddress } from "@shared/utils/address.util";
import { friendlyDate } from "@shared/utils/date";
import Button from "primevue/button";
import Card from "primevue/card";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getMediaUrl } from "@/utils/media.util";
import { Localisation } from "@shared/types/localisation";

const router = useRouter();

const props = defineProps<{
  event: EventCard;
  participation?: EventParticipation | null;
  showAssociation?: boolean;
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
</script>

<template>
  <Card
    class="flex flex-col bg-white rounded-xl border-primary shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)] transform transition-all duration-200 ease-in-out hover:shadow-[4px_4px_16px_-1px_rgba(0,0,0,0.15),8px_8px_20px_-4px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:bg-primary-hover/5 cursor-pointer"
    @click="goToEventDetails"
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
          class="w-full h-48 mb-4 event-card-image"
        />

        <!-- Association info (conditionnelle) -->
        <div v-if="showAssociation" class="flex items-center gap-2 mb-4 px-2">
          <span class="text-lg font-semibold text-gray-700">
            {{ event.association?.name }}
          </span>
          <span
            class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm ml-auto"
          >
            {{ event.typeEvent?.name }}
          </span>
        </div>

        <!-- Type d'événement seul si pas d'association -->
        <div v-else class="flex justify-center mb-4">
          <span
            class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            {{ event.typeEvent?.name }}
          </span>
        </div>

        <!-- Contenu principal -->
        <div
          class="flex flex-col p-4 border-t border-surface-300 dark:border-surface-700"
        >
          <div class="flex flex-col mb-4">
            <span class="text-base font-semibold text-gray-700">{{
              event.titre
            }}</span>
          </div>

          <div class="flex flex-col gap-2 mb-4 items-center">
            <div class="flex items-center gap-2 text-gray-600">
              <i class="pi pi-calendar"></i>
              {{ friendlyDate(event.date) }}
            </div>
            <div v-if="event.localisation" class="flex items-center gap-2 text-gray-500">
              <i class="pi pi-map-marker"></i>
              {{ formatFullAddress(event.localisation as Localisation) }}
            </div>
          </div>

          <div class="flex flex-col justify-between flex-1">
            <p class="text-gray-600 line-clamp-3">
              {{ truncateDescription(event.description) }}
            </p>
          </div>

          <div class="mt-auto pt-3 flex justify-center gap-3">
            <ParticipateEventButton
              v-if="!isEventPast"
              :event-id="event.id"
              :participation="participation"
              @click.stop
            />
            <Button
              @click.stop="goToEventDetails"
              class="bg-primary text-white"
            >
              En savoir plus
            </Button>
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
</style>
