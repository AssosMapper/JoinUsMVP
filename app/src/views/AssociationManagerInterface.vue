<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'

const components = {
  'CreateEvent': defineAsyncComponent(() => import('../components/CreateEvent.vue')),
  'UpdateEvent': defineAsyncComponent(() => import('../components/UpdateEvent.vue')),
  'UpdateAssociation': defineAsyncComponent(() => import('../components/UpdateAssociation.vue'))
}

const currentView = shallowRef('CreateEvent')
</script>

<template>
  <div class="association-manager-interface">
    <h1>Interface association manager</h1>
    
    <nav>
      <button @click="currentView = 'CreateEvent'">Create Event</button> |
      <button @click="currentView = 'UpdateEvent'">Update Event</button> |
      <button @click="currentView = 'UpdateAssociation'">Update Association</button> |
    </nav>

    <component :is="components[currentView]"></component>
  </div>
</template>