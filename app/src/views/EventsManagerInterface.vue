<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'

const components = {
  'ManageEvents': defineAsyncComponent(() => import('../components/Update/UpdateAssociation.vue'))
}

const currentView = shallowRef('ManageEvents')
</script>

<template>
  <div class="events-manager-interface">
    <h1>Interface events manager</h1>
    
    <nav>
      <button @click="currentView = 'ManageEvents'">Manage Events</button> |
    </nav>

    <component :is="components[currentView]"></component>
  </div>
</template>