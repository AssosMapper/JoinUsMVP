<script setup lang="ts">
import Button from "primevue/button";
import { computed } from "vue";

interface Props {
  currentDate: Date;
  dateFormat?: "month-year" | "full-date" | "year";
}

const props = withDefaults(defineProps<Props>(), {
  dateFormat: "month-year",
});

const emit = defineEmits<{
  (e: "previous"): void;
  (e: "next"): void;
}>();

const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
  };

  switch (props.dateFormat) {
    case "month-year":
      return props.currentDate.toLocaleDateString("fr-FR", options);
    case "full-date":
      return props.currentDate.toLocaleDateString("fr-FR", {
        ...options,
        day: "numeric",
      });
    case "year":
      return props.currentDate.getFullYear().toString();
    default:
      return props.currentDate.toLocaleDateString("fr-FR", options);
  }
});
</script>

<template>
  <div class="flex items-center justify-center py-4">
    <Button
      icon="pi pi-chevron-left"
      rounded
      text
      severity="secondary"
      aria-label="Date précédente"
      @click="emit('previous')"
    />
    <span class="text-lg font-semibold min-w-[200px] text-center">
      {{ formattedDate }}
    </span>
    <Button
      icon="pi pi-chevron-right"
      rounded
      text
      severity="secondary"
      aria-label="Date suivante"
      @click="emit('next')"
    />
  </div>
</template>
