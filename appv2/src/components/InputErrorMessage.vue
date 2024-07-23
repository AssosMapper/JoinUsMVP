<script setup lang="ts">
defineProps({
  error: String
});
</script>

<template>
  <span v-if="error" class="text-red-500 text-xs">
    {{ error }}
  </span>
</template>