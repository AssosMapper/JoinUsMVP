<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'

const components = {
  'CreateEvent': defineAsyncComponent(() => import('../components/CreateEvent.vue'))
}

const currentView = shallowRef('CreateEvent')
</script>

<template>
  <div class="association-manager-interface">
    <h1>Interface association manager</h1>
    
    <nav>
      <button @click="currentView = 'CreateEvent'"> Create Event</button>
    </nav>

    <component :is="components[currentView]"></component>
  </div>
</template>