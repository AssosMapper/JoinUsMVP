<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useGoogleMapsLoader } from "@/composables/useGoogleMapLoader.ts";
import { LocalisationDto } from "@shared/dto/localisation.dto";

interface Props {
  modelValue: LocalisationDto | null;
  inputId?: string;
  inputClass?: string;
  placeholder?: string;
  options?: google.maps.places.AutocompleteOptions;
}

const props = withDefaults(defineProps<Props>(), {
  inputId: "autocomplete",
  inputClass: "",
  placeholder: "Entrez une adresse",
  options: () => ({
    types: ["address"],
    componentRestrictions: { country: "fr" },
  }),
});

const emit = defineEmits<{
  (e: "update:modelValue", value: LocalisationDto | null): void;
  (e: "placechanged", place: google.maps.places.PlaceResult): void;
}>();

const { isLoaded } = useGoogleMapsLoader();
const displayAddress = ref<string>("");

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

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      displayAddress.value = "";
      const input = document.getElementById(props.inputId) as HTMLInputElement;
      if (input) input.value = "";
    }
  }
);

function initAutocomplete() {
  const input = document.getElementById(props.inputId) as HTMLInputElement;
  autocomplete = new google.maps.places.Autocomplete(input, props.options);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete!.getPlace();
    emit("placechanged", place);

    if (place.address_components && place.formatted_address) {
      displayAddress.value = place.formatted_address;
      const localisationData = parseGooglePlaceResult(place);
      emit("update:modelValue", localisationData);
    }
  });
}

function parseGooglePlaceResult(
  place: google.maps.places.PlaceResult
): LocalisationDto {
  const components = place.address_components || [];
  const getComponent = (type: string): string => {
    const component = components.find((comp) => comp.types.includes(type));
    return component?.long_name || "";
  };

  const getShortComponent = (type: string): string => {
    const component = components.find((comp) => comp.types.includes(type));
    return component?.short_name || "";
  };

  return {
    street_number: getComponent("street_number"),
    street_name: getComponent("route"),
    zip: getComponent("postal_code"),
    city:
      getComponent("locality") || getComponent("administrative_area_level_2"),
    country: getShortComponent("country"),
  };
}

function updateValue(event: Event) {
  const value = (event.target as HTMLInputElement).value;

  if (!value.trim()) {
    displayAddress.value = "";
    emit("update:modelValue", null);
  }
}
</script>

<template>
  <div>
    <input
      :id="inputId"
      :value="displayAddress"
      @input="updateValue"
      :class="inputClass"
      :placeholder="placeholder"
      class="w-full"
    />

    <!-- Champs cachés pour les données structurées -->
    <input
      type="hidden"
      name="street_number"
      :value="modelValue?.street_number || ''"
    />
    <input
      type="hidden"
      name="street_name"
      :value="modelValue?.street_name || ''"
    />
    <input type="hidden" name="zip" :value="modelValue?.zip || ''" />
    <input type="hidden" name="city" :value="modelValue?.city || ''" />
    <input type="hidden" name="country" :value="modelValue?.country || ''" />
  </div>
</template>
