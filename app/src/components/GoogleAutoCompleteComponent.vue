<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const props = defineProps({
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
let loader: Loader | null = null;

onMounted(async () => {
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY!, // Utilisez la clé API depuis le fichier .env
      version: 'weekly',
      libraries: ['places'],
    });

    await loader.load();
  }

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

watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal;
});
</script>

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

<style scoped>
</style>
