<<<<<<< HEAD
<template>
  <div>
    <input
        :id="inputId"
        :value="modelValue"
        @input="updateValue"
        :class="inputClass"
        :placeholder="placeholder"
        class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, toRef } from 'vue';
=======
<script setup lang="ts">
import { onMounted, watch, toRef } from 'vue';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
import {useGoogleMapsLoader} from "@/composables/useGoogleMapLoader.ts";

interface Props {
  modelValue: string;
  inputId?: string;
  inputClass?: string;
  placeholder?: string;
  options?: google.maps.places.AutocompleteOptions;
}

const props = withDefaults(defineProps<Props>(), {
  inputId: 'autocomplete',
  inputClass: '',
  placeholder: 'Enter address',
  options: () => ({
    types: ['address'],
    componentRestrictions: { country: 'fr' },
  }),
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'placechanged', place: google.maps.places.PlaceResult): void;
}>();

const inputValue = toRef(props, 'modelValue');
<<<<<<< HEAD
const { isLoaded, loadError } = useGoogleMapsLoader();
=======
const { isLoaded } = useGoogleMapsLoader();
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

let autocomplete: google.maps.places.Autocomplete | null = null;

onMounted(async () => {
  if (isLoaded.value) {
    initAutocomplete();
  }
});

watch(isLoaded, (loaded) => {
  if (loaded) {
    initAutocomplete();
  }
});

watch(inputValue, (newVal) => {
  if (autocomplete && newVal !== autocomplete.getPlace()?.formatted_address) {
    (document.getElementById(props.inputId) as HTMLInputElement).value = newVal;
  }
});

function initAutocomplete() {
  const input = document.getElementById(props.inputId) as HTMLInputElement;
  autocomplete = new google.maps.places.Autocomplete(input, props.options);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete!.getPlace();
    emit('placechanged', place);
    if (place.formatted_address) {
      emit('update:modelValue', place.formatted_address);
    }
  });
}

function updateValue(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
}
<<<<<<< HEAD
</script>
=======
</script>

<template>
  <div>
    <input
        :id="inputId"
        :value="modelValue"
        @input="updateValue"
        :class="inputClass"
        :placeholder="placeholder"
        class="w-full"
    />
  </div>
</template>
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
