<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref, nextTick, computed } from "vue";
import { useGoogleMapsLoader } from "@/composables/useGoogleMapLoader.ts";
import { SaveLocalisationDto } from "@shared/dto/localisation.dto";

// Types Google Maps étendus pour éviter les 'any'
interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GooglePlaceResult extends google.maps.places.PlaceResult {
  address_components?: GoogleAddressComponent[];
  formatted_address?: string;
}

interface GoogleGeocoderResult extends google.maps.GeocoderResult {
  formatted_address: string;
  address_components: GoogleAddressComponent[];
}

interface Props {
  modelValue: SaveLocalisationDto | null;
  inputId?: string;
  inputClass?: string;
  placeholder?: string;
  options?: google.maps.places.AutocompleteOptions;
  debounceMs?: number;
}

const props = withDefaults(defineProps<Props>(), {
  inputId: "autocomplete",
  inputClass: "",
  placeholder: "Entrez une adresse",
  debounceMs: 300,
  options: () => ({
    types: ["address"],
    componentRestrictions: { country: "fr" },
  }),
});

const emit = defineEmits<{
  "update:modelValue": [value: SaveLocalisationDto | null];
  placechanged: [place: GooglePlaceResult];
  error: [error: string];
}>();

// État du composant
const displayAddress = ref<string>("");
const isLoadingAddress = ref<boolean>(false);
const isInitialized = ref<boolean>(false);

// Instances Google Maps
let autocomplete: google.maps.places.Autocomplete | null = null;
let geocoder: google.maps.Geocoder | null = null;
let debounceTimer: number | null = null;

// Computed pour l'état de l'input
const inputState = computed(() => ({
  disabled: isLoadingAddress.value,
  placeholder: isLoadingAddress.value
    ? "Chargement de l'adresse..."
    : props.placeholder,
}));

// État de Google Maps
const { isLoaded } = useGoogleMapsLoader();

/**
 * Initialisation du composant
 */
onMounted(async () => {
  await initializeComponent();
});

/**
 * Surveillance du chargement de Google Maps
 */
watch(isLoaded, async (loaded: boolean) => {
  if (loaded && !isInitialized.value) {
    await initializeComponent();
  }
});

/**
 * Surveillance des changements de modelValue avec debouncing
 */
watch(
  () => props.modelValue,
  (newValue: SaveLocalisationDto | null) => {
    handleModelValueChange(newValue);
  },
  { immediate: true }
);

/**
 * Initialise tous les composants Google Maps
 */
async function initializeComponent(): Promise<void> {
  if (!isLoaded.value) return;

  try {
    initializeGeocoder();
    await nextTick();
    initializeAutocomplete();
    isInitialized.value = true;

    // Charger l'adresse existante si présente
    if (props.modelValue) {
      await loadExistingAddressWithDebounce(props.modelValue);
    }
  } catch (error) {
    handleError(
      "Erreur lors de l'initialisation des services Google Maps",
      error
    );
  }
}

/**
 * Initialise le service de géocodage
 */
function initializeGeocoder(): void {
  if (!window.google?.maps?.Geocoder) {
    throw new Error("Google Geocoder service not available");
  }
  geocoder = new google.maps.Geocoder();
}

/**
 * Initialise l'autocomplétion
 */
function initializeAutocomplete(): void {
  const input = getInputElement();
  if (!input) return;

  autocomplete = new google.maps.places.Autocomplete(input, props.options);

  autocomplete.addListener("place_changed", handlePlaceChanged);
}

/**
 * Récupère l'élément input de manière sécurisée
 */
function getInputElement(): HTMLInputElement | null {
  const element = document.getElementById(props.inputId);
  return element instanceof HTMLInputElement ? element : null;
}

/**
 * Gère les changements de lieu sélectionné
 */
function handlePlaceChanged(): void {
  if (!autocomplete) return;

  const place = autocomplete.getPlace() as GooglePlaceResult;
  emit("placechanged", place);

  if (isValidPlaceResult(place)) {
    displayAddress.value = place.formatted_address!;
    const localisationData = parseGooglePlaceResult(place);
    emit("update:modelValue", localisationData);
  }
}

/**
 * Vérifie si le résultat de place est valide
 */
function isValidPlaceResult(place: GooglePlaceResult): boolean {
  return !!(place.address_components && place.formatted_address);
}

/**
 * Gère les changements de modelValue avec debouncing
 */
function handleModelValueChange(newValue: SaveLocalisationDto | null): void {
  clearDebounceTimer();

  if (!newValue) {
    resetAddressDisplay();
    return;
  }

  if (isInitialized.value) {
    debounceTimer = window.setTimeout(() => {
      loadExistingAddressWithDebounce(newValue);
    }, props.debounceMs);
  }
}

/**
 * Remet à zéro l'affichage de l'adresse
 */
function resetAddressDisplay(): void {
  displayAddress.value = "";
  isLoadingAddress.value = false;
  updateInputValue("");
}

/**
 * Charge une adresse existante avec gestion d'erreur
 */
async function loadExistingAddressWithDebounce(
  localisation: SaveLocalisationDto
): Promise<void> {
  if (!geocoder || !isLoaded.value) return;

  const addressString = buildAddressString(localisation);
  if (!addressString) return;

  isLoadingAddress.value = true;

  try {
    const results = await geocodeAddress(addressString);

    if (results.length > 0) {
      const formattedAddress = results[0].formatted_address;
      displayAddress.value = formattedAddress;
      updateInputValue(formattedAddress);
    } else {
      // Fallback vers l'adresse construite
      displayAddress.value = addressString;
      updateInputValue(addressString);
    }
  } catch (error) {
    handleError("Erreur lors du géocodage", error);
    // Fallback vers l'adresse construite
    displayAddress.value = addressString;
    updateInputValue(addressString);
  } finally {
    isLoadingAddress.value = false;
  }
}

/**
 * Met à jour la valeur de l'input de manière sécurisée
 */
function updateInputValue(value: string): void {
  const input = getInputElement();
  if (input) {
    input.value = value;
  }
}

/**
 * Construit une chaîne d'adresse lisible
 */
function buildAddressString(localisation: SaveLocalisationDto): string {
  const parts: string[] = [];

  if (localisation.street_number?.trim()) {
    parts.push(localisation.street_number.trim());
  }

  if (localisation.street_name?.trim()) {
    parts.push(localisation.street_name.trim());
  }

  if (localisation.zip?.trim() && localisation.city?.trim()) {
    parts.push(`${localisation.zip.trim()} ${localisation.city.trim()}`);
  } else if (localisation.city?.trim()) {
    parts.push(localisation.city.trim());
  }

  if (localisation.country?.trim()) {
    parts.push(localisation.country.trim());
  }

  return parts.join(", ");
}

/**
 * Effectue un géocodage avec promesse
 */
function geocodeAddress(address: string): Promise<GoogleGeocoderResult[]> {
  return new Promise((resolve, reject) => {
    if (!geocoder) {
      reject(new Error("Geocoder not initialized"));
      return;
    }

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results) {
        resolve(results as GoogleGeocoderResult[]);
      } else {
        reject(new Error(`Geocoding failed with status: ${status}`));
      }
    });
  });
}

/**
 * Parse le résultat de Google Places en SaveLocalisationDto
 */
function parseGooglePlaceResult(place: GooglePlaceResult): SaveLocalisationDto {
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
    id: props.modelValue?.id,
    street_number: getComponent("street_number"),
    street_name: getComponent("route"),
    zip: getComponent("postal_code"),
    city:
      getComponent("locality") || getComponent("administrative_area_level_2"),
    country: getShortComponent("country"),
  };
}

/**
 * Gère la saisie manuelle dans l'input
 */
function handleInputChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  if (!value.trim()) {
    displayAddress.value = "";
    emit("update:modelValue", null);
  }
}

/**
 * Gère les erreurs de manière centralisée
 */
function handleError(message: string, error: unknown): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.warn(`${message}: ${errorMessage}`);
  emit("error", `${message}: ${errorMessage}`);
}

/**
 * Nettoie le timer de debounce
 */
function clearDebounceTimer(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

/**
 * Nettoyage au démontage
 */
onUnmounted(() => {
  clearDebounceTimer();

  // Nettoyage des listeners Google Maps
  if (autocomplete && window.google?.maps) {
    try {
      (window.google.maps as any).event?.clearInstanceListeners(autocomplete);
    } catch (error) {
      console.warn(
        "Erreur lors du nettoyage des listeners Google Maps:",
        error
      );
    }
  }
});
</script>

<template>
  <div class="relative">
    <input
      :id="inputId"
      :value="displayAddress"
      :class="inputClass"
      :placeholder="inputState.placeholder"
      :disabled="inputState.disabled"
      autocomplete="off"
      class="w-full"
      @input="handleInputChange"
    />

    <!-- Indicateur de chargement -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoadingAddress"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
        aria-label="Chargement en cours"
      >
        <i class="pi pi-spin pi-spinner text-primary" aria-hidden="true"></i>
      </div>
    </Transition>

    <!-- Champs cachés pour les données structurées -->
    <template v-if="modelValue">
      <input
        type="hidden"
        name="street_number"
        :value="modelValue.street_number || ''"
      />
      <input
        type="hidden"
        name="street_name"
        :value="modelValue.street_name || ''"
      />
      <input type="hidden" name="zip" :value="modelValue.zip || ''" />
      <input type="hidden" name="city" :value="modelValue.city || ''" />
      <input type="hidden" name="country" :value="modelValue.country || ''" />
    </template>
  </div>
</template>
