<template>
    <div>
      <input
        :id="inputId"
        v-model="inputValue"
        :class="inputClass"
        :placeholder="placeholder"
        class="w-full"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Loader } from '@googlemaps/js-api-loader';
  
  const props = defineProps({
    apiKey: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    inputId: {
      type: String,
      default: 'autocomplete',
    },
    inputClass: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Enter address',
    },
    options: {
      type: Object,
      default: () => ({
        types: ['address'],
        componentRestrictions: { country: 'fr' },
      }),
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'placechanged']);
  const inputValue = ref(props.modelValue);
  let autocomplete: google.maps.places.Autocomplete;
  
  onMounted(async () => {
    const loader = new Loader({
      apiKey: props.apiKey,
      version: 'weekly',
      libraries: ['places'],
    });
  
    await loader.load();
  
    const input = document.getElementById(props.inputId) as HTMLInputElement;
    autocomplete = new google.maps.places.Autocomplete(input, props.options);
  
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      emit('placechanged', place);
      if (place.formatted_address) {
        emit('update:modelValue', place.formatted_address);
        inputValue.value = place.formatted_address;
      }
    });
  });
  </script>
  
  <style scoped>
  </style>
  