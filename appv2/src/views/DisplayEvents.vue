<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'

const components = {
  'Calendar': defineAsyncComponent(() => import('../components/Calendar.vue')),
  'Map': defineAsyncComponent(() => import('../components/Map.vue')),
}

const currentView = shallowRef('CreateEvent')
</script>

<template>
  <div class="association-manager-interface">    
    <nav>
    <button @click="currentView = 'Calendar'">Calendar</button> |
      <button @click="currentView = 'Map'">Map</button> 
    </nav>
    <component :is="components[currentView]"></component>
  </div>
</template>