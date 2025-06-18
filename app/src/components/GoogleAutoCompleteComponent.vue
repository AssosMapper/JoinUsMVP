<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useGoogleMapsLoader } from "@/composables/useGoogleMapLoader.ts";
import { SaveLocalisationDto } from "@shared/dto/localisation.dto";

interface Props {
  modelValue: SaveLocalisationDto | null;
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
  (e: "update:modelValue", value: SaveLocalisationDto | null): void;
  (e: "placechanged", place: google.maps.places.PlaceResult): void;
}>();

const { isLoaded } = useGoogleMapsLoader();
const displayAddress = ref<string>("");
const isLoadingAddress = ref<boolean>(false);

let autocomplete: google.maps.places.Autocomplete | null = null;
let geocoder: google.maps.Geocoder | null = null;

onMounted(async () => {
  if (isLoaded.value) {
    initAutocomplete();
    initGeocoder();
    await loadExistingAddress();
  }
});

watch(isLoaded, async (loaded) => {
  if (loaded) {
    initAutocomplete();
    initGeocoder();
    await loadExistingAddress();
  }
});

watch(
  () => props.modelValue,
  async (newVal) => {
    if (!newVal) {
      displayAddress.value = "";
      isLoadingAddress.value = false;
      const input = document.getElementById(props.inputId) as HTMLInputElement;
      if (input) input.value = "";
    } else {
      await loadExistingAddress();
    }
  }
);

function initAutocomplete() {
  const input = document.getElementById(props.inputId) as HTMLInputElement;
  if (!input) return;

  autocomplete = new google.maps.places.Autocomplete(input, props.options);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete!.getPlace();
    emit("placechanged", place);

    if ((place as any).address_components && place.formatted_address) {
      displayAddress.value = place.formatted_address;
      const localisationData = parseGooglePlaceResult(place);
      emit("update:modelValue", localisationData);
    }
  });
}

function initGeocoder() {
  if (window.google?.maps?.Geocoder) {
    geocoder = new google.maps.Geocoder();
  }
}

async function loadExistingAddress() {
  if (!props.modelValue || !geocoder || !isLoaded.value) return;

  const address = buildAddressString(props.modelValue);
  if (!address) return;

  isLoadingAddress.value = true;

  try {
    const results = await geocodeAddress(address);
    if (results.length > 0) {
      displayAddress.value = (results[0] as any).formatted_address;

      // Mettre à jour l'input
      const input = document.getElementById(props.inputId) as HTMLInputElement;
      if (input) {
        input.value = (results[0] as any).formatted_address;
      }
    }
  } catch (error) {
    console.warn("Erreur lors du géocodage:", error);
    // Fallback : utiliser l'adresse construite manuellement
    displayAddress.value = address;
    const input = document.getElementById(props.inputId) as HTMLInputElement;
    if (input) {
      input.value = address;
    }
  } finally {
    isLoadingAddress.value = false;
  }
}

function buildAddressString(localisation: SaveLocalisationDto): string {
  const parts = [];

  if (localisation.street_number) parts.push(localisation.street_number);
  if (localisation.street_name) parts.push(localisation.street_name);
  if (localisation.zip && localisation.city) {
    parts.push(`${localisation.zip} ${localisation.city}`);
  } else if (localisation.city) {
    parts.push(localisation.city);
  }
  if (localisation.country) parts.push(localisation.country);

  return parts.join(", ");
}

function geocodeAddress(
  address: string
): Promise<google.maps.GeocoderResult[]> {
  return new Promise((resolve, reject) => {
    if (!geocoder) {
      reject(new Error("Geocoder not initialized"));
      return;
    }

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results) {
        resolve(results);
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}

function parseGooglePlaceResult(
  place: google.maps.places.PlaceResult
): SaveLocalisationDto {
  const components = (place as any).address_components || [];
  const getComponent = (type: string): string => {
    const component = components.find((comp: any) => comp.types.includes(type));
    return component?.long_name || "";
  };

  const getShortComponent = (type: string): string => {
    const component = components.find((comp: any) => comp.types.includes(type));
    return component?.short_name || "";
  };

  return {
    id: props.modelValue?.id,
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
  <div class="relative">
    <input
      :id="inputId"
      :value="displayAddress"
      @input="updateValue"
      :class="inputClass"
      :placeholder="
        isLoadingAddress ? 'Chargement de l\'adresse...' : placeholder
      "
      :disabled="isLoadingAddress"
      class="w-full"
    />

    <!-- Indicateur de chargement -->
    <div
      v-if="isLoadingAddress"
      class="absolute right-3 top-1/2 transform -translate-y-1/2"
    >
      <i class="pi pi-spin pi-spinner text-primary"></i>
    </div>

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
