<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'

const components = {
  'CreateAssociation': defineAsyncComponent(() => import('../components/CreateAssociation.vue')),
  'UpdateAssociation': defineAsyncComponent(() => import('../components/UpdateAssociation.vue')),
  'CreateEvent': defineAsyncComponent(() => import('../components/CreateEvent.vue')),
  'CreateTypeEvent': defineAsyncComponent(() => import('../components/CreateTypeEvent.vue')),
  'UpdateTypeAssociation': defineAsyncComponent(() => import('../components/UpdateTypeAssociation.vue')),
  'CreateTypeAssociation': defineAsyncComponent(() => import('../components/CreateTypeAssociation.vue')),
}

const currentView = shallowRef('CreateAssociation')
</script>

<template>
  <div class="admin-interface">
    <h1>Interface d'administration</h1>
    
    <nav>
      <button :class="{ 'font-bold': currentView === 'CreateAssociation' }" @click="currentView = 'CreateAssociation'">Create Association</button> |
      <button :class="{ 'font-bold': currentView === 'UpdateAssociation' }" @click="currentView = 'UpdateAssociation'">Update Association</button> |
      <button :class="{ 'font-bold': currentView === 'CreateEvent' }" @click="currentView = 'CreateEvent'">Create Event</button> |
      <button :class="{ 'font-bold': currentView === 'UpdateEvent' }" @click="currentView = 'UpdateEvent'">Update Event</button> |
      <button :class="{ 'font-bold': currentView === 'CreateTypeAssociation' }" @click="currentView = 'CreateTypeAssociation'">Create TypeAssociation</button> |
      <button :class="{ 'font-bold': currentView === 'UpdateTypeAssociation' }" @click="currentView = 'UpdateTypeAssociation'">Update TypeAssociation</button> |
      <button :class="{ 'font-bold': currentView === 'CreateTypeEvent' }" @click="currentView = 'CreateTypeEvent'">Create TypeEvent</button> |
      <button :class="{ 'font-bold': currentView === 'UpdateTypeEvent' }" @click="currentView = 'UpdateTypeEvent'">Update TypeEvent</button> |
    </nav>

    <component :is="components[currentView]"></component>
  </div>
</template>

<style scoped>
.font-bold {
  font-weight: bold;
}
</style>
