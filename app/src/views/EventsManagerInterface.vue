<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'

const components = {
  'UpdateEvent': defineAsyncComponent(() => import('../components/Update/UpdateEvent.vue')),
}

const currentView = shallowRef('CreateEvent')
</script>

<template>
  <div class="association-manager-interface">
    <h1>Interface association manager</h1>
    
    <nav>
      <button :class="{ 'font-bold': currentView === 'UpdateEvent' }" @click="currentView = 'UpdateEvent'">Update Event</button> |
    </nav>

    <component :is="components[currentView]"></component>
  </div>
</template>