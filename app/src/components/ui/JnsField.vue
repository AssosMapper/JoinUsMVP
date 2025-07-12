<script setup lang="ts">
defineProps<{
  errorMessage?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <slot></slot>
    <small v-if="errorMessage" class="text-danger">{{ errorMessage }}</small>
  </div>
</template> 