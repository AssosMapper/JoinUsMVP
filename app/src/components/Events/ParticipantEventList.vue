<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import mediaService from "@/services/mediaService";
import { EventParticipantResponseDto } from "@shared/dto/event-participation.dto";
import ProgressSpinner from "primevue/progressspinner";
import { computed } from "vue";

const props = defineProps<{
  participants: EventParticipantResponseDto[];
  loading?: boolean;
}>();

const participants = computed(() => {
  console.log(props.participants);
  return props.participants;
});
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center p-4">
      <ProgressSpinner />
    </div>

    <div
      v-else-if="participants.length === 0"
      class="text-center p-8 text-gray-500"
    >
      <i class="pi pi-users text-4xl mb-4 block"></i>
      <p class="text-lg">Aucun participant pour le moment</p>
      <p class="text-sm">Soyez le premier à participer à cet événement !</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="participant in participants"
        :key="participant.id"
        class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
      >
        <JnsImage
          :name="`${participant.user.first_name} ${participant.user.last_name}`"
          :src="mediaService.getMediaUrl(participant.user?.image)"
          size="md"
          class="flex-shrink-0"
        />

        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 truncate">
            {{ participant.user.first_name }} {{ participant.user.last_name }}
          </p>
          <p class="text-sm text-gray-500">
            Inscrit le
            {{ new Date(participant.registrationDate).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="participants.length > 0"
      class="text-center text-sm text-gray-500 mt-4"
    >
      {{ participants.length }} participant{{
        participants.length > 1 ? "s" : ""
      }}
    </div>
  </div>
</template>
