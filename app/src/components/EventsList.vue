<script setup lang="ts">
import JnsImage from "@/components/ui/JnsImage.vue";
import { friendlyDate } from "@shared/utils/date";
import { useInfiniteScroll } from "@vueuse/core";
import Badge from "primevue/badge";
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
  events: any[];
  loading: boolean;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
}>();

const el = ref<HTMLElement | null>(null);

useInfiniteScroll(
  el,
  async () => {
    if (!props.loading && props.hasMore) {
      await props.fetchMore();
    }
  },
  { distance: 10 }
);

const truncateDescription = (description: string, maxLength: number = 255) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + "...";
};

const goToEventDetails = (id: number) => {
  router.push({ name: "EventDetails", params: { id } });
};
</script>

<template>
  <div
    ref="el"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
  >
    <Card
      v-for="event in events"
      :key="event.id"
      class="event-card cursor-pointer"
      @click="goToEventDetails(event.id)"
    >
      <template #header>
        <div class="relative">
          <JnsImage
            :name="event.titre"
            :src="event.image || '/default-event.jpg'"
            size="lg"
            :rounded="false"
            class="w-full h-48"
          />
          <div class="absolute top-2 right-2">
            <Badge
              :value="event.typeEvent.name"
              severity="info"
              class="bg-black/50 text-white border-none"
            />
          </div>
        </div>
      </template>
      <template #title>
        {{ event.titre }}
      </template>
      <template #subtitle>
        <div class="flex items-center gap-2">
          <i class="pi pi-calendar"></i>
          {{ friendlyDate(new Date(event.date)) }}
        </div>
      </template>
      <template #content>
        <p class="mb-3">{{ truncateDescription(event.description) }}</p>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <i class="pi pi-map-marker"></i>
            {{ event.localisation }}
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-users"></i>
            {{ event.association.name }}
          </div>
        </div>
      </template>
    </Card>
    <div v-if="loading" class="col-span-full flex justify-center p-4">
      <ProgressSpinner />
    </div>
  </div>
</template>

<style scoped>
.event-card {
  transition: transform 0.2s;
}

.event-card:hover {
  transform: translateY(-5px);
}

:deep(.p-card-header) {
  padding: 0;
}

:deep(.p-card-body) {
  padding: 1.25rem;
}
</style>
