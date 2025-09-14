<script setup lang="ts">
import Button from 'primevue/button';

interface Props {
  content: string | null | undefined;
  emptyMessage?: string;
  canEdit?: boolean;
  editLabel?: string;
}

interface Emits {
  (e: 'edit'): void;
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'Aucun contenu disponible.',
  canEdit: false,
  editLabel: 'Modifier le contenu',
});

defineEmits<Emits>();
</script>

<template>
  <div class="content-display">
    <div class="flex justify-between items-start mb-4">
      <slot name="header">
        <h3 class="text-xl font-semibold">Contenu</h3>
      </slot>
      
      <Button
        v-if="canEdit"
        @click="$emit('edit')"
        :label="editLabel"
        severity="primary"
        size="small"
        icon="pi pi-pencil"
      />
    </div>
    
    <div class="content-body">
      <slot name="description"></slot>
      
      <div v-if="content" class="prose max-w-none mt-4 border-t pt-4">
        <div v-html="content"></div>
      </div>
      
      <div v-else class="text-gray-500 italic mt-4">
        {{ emptyMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-display {
  @apply bg-white rounded-lg shadow p-4;
}

.content-body {
  @apply text-gray-700;
}

/* Styles pour le contenu HTML affiché */
:deep(.prose) {
  @apply text-gray-700;
}

:deep(.prose h1) {
  @apply text-2xl font-bold mb-4 text-gray-900;
}

:deep(.prose h2) {
  @apply text-xl font-semibold mb-3 text-gray-900;
}

:deep(.prose h3) {
  @apply text-lg font-medium mb-2 text-gray-900;
}

:deep(.prose p) {
  @apply mb-3 leading-relaxed;
}

:deep(.prose ul) {
  @apply list-disc list-inside mb-3;
}

:deep(.prose ol) {
  @apply list-decimal list-inside mb-3;
}

:deep(.prose blockquote) {
  @apply border-l-4 border-primary pl-4 italic mb-3;
}



:deep(.prose img) {
  @apply max-w-full h-auto rounded-lg;
}
</style>
