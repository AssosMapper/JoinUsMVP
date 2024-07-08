<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'

const components = {
  'CreateAssociation': defineAsyncComponent(() => import('../components/CreateAssociation.vue')),
  'CreateEvent': defineAsyncComponent(() => import('../components/CreateEvent.vue'))
}

const currentView = shallowRef('CreateAssociation')
</script>

<template>
  <div class="admin-interface">
    <h1>Interface d'administration</h1>
    
    <nav>
      <button @click="currentView = 'CreateAssociation'">Create Association  </button> |
      <button @click="currentView = 'CreateEvent'"> Create Event</button>
    </nav>

    <component :is="components[currentView]"></component>
  </div>
</template>