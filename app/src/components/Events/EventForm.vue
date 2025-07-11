<script setup lang="ts">
import JnsField from "@/components/ui/JnsField.vue";
import UploadImage from "@/components/ui/UploadImage.vue";
import GoogleAutoCompleteComponent from "@/components/GoogleAutoCompleteComponent.vue";
import associationService from "@/services/associationService";
import typeEventService from "@/services/typeEventService";
import { useNotificationStore } from "@/store/notificationStore";
import { useUserStore } from "@/store/userStore";
import { CreateEventDto, UpdateEventDto, EventDto } from "@shared/dto/events.dto";
import { SaveLocalisationDto } from "@shared/dto/localisation.dto";
import { PublicMediaDto } from "@shared/dto/media.dto";
import { PublicAssociationDto } from "@shared/dto/associations.dto";
import { TypeEventsDto } from "@shared/dto/type-events.dto";
import { createEventSchema, updateEventSchema } from "@shared/validations/events.validation";
import Button from "primevue/button";
import Card from "primevue/card";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import RadioButton from "primevue/radiobutton";
import Textarea from "primevue/textarea";
import Calendar from "primevue/calendar";
import { useForm } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";
import { plainToInstance } from "class-transformer";

interface Props {
  event?: EventDto;
  onSubmit: (formData: CreateEventDto | UpdateEventDto, localisation?: SaveLocalisationDto, imageFile?: File) => Promise<void>;
}

const props = defineProps<Props>();

const userStore = useUserStore();
const notificationStore = useNotificationStore();


// État du formulaire
const isSubmitting = ref(false);
const isLoading = ref(true);
const availableAssociations = ref<PublicAssociationDto[]>([]);
const selectedAssociationId = ref<string | null>(null);
const eventImage = ref<PublicMediaDto | null>(null);
const selectedImageFile = ref<File | null>(null);
const typeEvents = ref<TypeEventsDto[]>([]);

// État séparé pour la localisation
const localisation = ref<SaveLocalisationDto>({
  street_number: "",
  street_name: "",
  zip: "",
  city: "",
  country: "France",
});

// Déterminer si c'est un update ou un create
const isUpdate = computed(() => !!props.event?.id);

// Configuration VeeValidate
const { handleSubmit, errors, defineField, values, resetForm } = useForm<CreateEventDto | UpdateEventDto>({
  validationSchema: isUpdate.value ? updateEventSchema : createEventSchema,
  initialValues: isUpdate.value ? {
    id: props.event?.id,
    titre: props.event?.titre || "",
    description: props.event?.description || "",
    date: props.event?.date ? new Date(props.event.date) : new Date(),
    associationId: props.event?.association?.id,
    typeEventId: props.event?.typeEvent?.id || "",
    isPublic: props.event?.isPublic ?? true,
    isValid: props.event?.isValid ?? false,
  } : {
    titre: "",
    description: "",
    date: new Date(),
    associationId: userStore.user?.associationId,
    typeEventId: "",
    isPublic: true,
    isValid: false,
  }
});

const [titre, titreAttrs] = defineField("titre");
const [description, descriptionAttrs] = defineField("description");
const [date, dateAttrs] = defineField("date");
const [associationId, associationIdAttrs] = defineField("associationId");
const [typeEventId, typeEventIdAttrs] = defineField("typeEventId");
const [isPublic, isPublicAttrs] = defineField("isPublic");
const [isValid, isValidAttrs] = defineField("isValid");

// Charger les associations disponibles
const loadAvailableAssociations = async () => {
  
  try {
    if (userStore.isAdmin) 
      availableAssociations.value = await associationService.getAllAssociations();
    else 
      availableAssociations.value = await associationService.getMyAssociations();
  } catch (error: any) {
    notificationStore.showNotification(
      "Erreur lors du chargement des associations",
      "error"
    );
  }
};

// Chargement des types d'événements
const loadTypeEvents = async () => {
  try {
    typeEvents.value = await typeEventService.getAllTypeEvents() as TypeEventsDto[];
  } catch (error: any) {
    notificationStore.showNotification(
      "Erreur lors du chargement des types d'événements",
      "error"
    );
  }
};

// Soumission du formulaire
const onSubmit = handleSubmit(async (formValues: CreateEventDto | UpdateEventDto) => {
  isSubmitting.value = true;
  try {


    const finalFormData = {
      ...formValues,
    };

    await props.onSubmit(
      finalFormData,
      localisation.value.street_name ? localisation.value : undefined,
      selectedImageFile.value || undefined
    );
  } catch (error: any) {
    notificationStore.showNotification(
      error.message || "Erreur lors de la soumission",
      "error"
    );
  } finally {
    isSubmitting.value = false;
  }
});

// Gestion de la sélection d'image
const handleImageFileSelected = (file: File) => {
  selectedImageFile.value = file;
};

// Gestion de la suppression d'image
const handleImageRemove = () => {
  selectedImageFile.value = null;
  eventImage.value = null;
};

// Gestion de la localisation
const handleLocalisationChange = (newLocalisation: SaveLocalisationDto | null) => {
  if (newLocalisation) {
    const localisationId = localisation.value?.id;
    localisation.value = plainToInstance(SaveLocalisationDto, newLocalisation, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    if (localisationId) localisation.value.id = localisationId;
  } else {
    localisation.value = {
      street_number: "",
      street_name: "",
      zip: "",
      city: "",
      country: "France",
    };
  }
};

// Initialisation au montage
onMounted(async () => {
  try {
    await Promise.all([loadAvailableAssociations(), loadTypeEvents()]);

    // Si c'est un update, préparer les données existantes
    if (isUpdate.value && props.event) {
      // Préparer la localisation si elle existe
      if (props.event.localisation) {
        localisation.value = plainToInstance(SaveLocalisationDto, props.event.localisation, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      }

      // Préparer l'image si elle existe
      if (props.event.image) {
        eventImage.value = plainToInstance(PublicMediaDto, props.event.image, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      }

      selectedAssociationId.value = props.event.association?.id || null;
    }
  } catch (error: any) {
    notificationStore.showNotification("Erreur lors de l'initialisation", "error");
  } finally {
    isLoading.value = false;
  }
});

// Watcher pour synchroniser selectedAssociationId avec associationId
watch(selectedAssociationId, (newId) => {
  associationId.value = newId;
});

watch(associationId, (newId) => {
  selectedAssociationId.value = newId;
});
</script>

<template>
  <Card>
    <template #title>
      <div class="flex items-center gap-3">
        <i :class="isUpdate ? 'pi pi-edit' : 'pi pi-plus'" class="text-2xl text-primary"></i>
        <span>{{ isUpdate ? 'Modifier l\'événement' : 'Créer un événement' }}</span>
      </div>
    </template>

    <template #content>
      <div v-if="isLoading" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-2xl"></i>
        <p class="mt-2">Chargement...</p>
      </div>

      <form v-else @submit.prevent="onSubmit" class="space-y-6">
        <!-- Image de l'événement -->
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-4">Image de l'événement</h3>
          <UploadImage
            class="upload-event-image"            
          v-model="eventImage"
            :preview="true"
            @file-selected="handleImageFileSelected"
            @remove="handleImageRemove"

            />
        </div>

        <Divider />

        <!-- Informations de base -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Informations générales</h3>

          <JnsField :errorMessage="errors.titre">
            <FloatLabel variant="in" class="w-full">
              <InputText
                id="titre"
                v-model="titre"
                v-bind="titreAttrs"
                class="w-full"
                :class="{ 'p-invalid': errors.titre }"
              />
              <label for="titre">Titre de l'événement *</label>
            </FloatLabel>
          </JnsField>

          <JnsField :errorMessage="errors.description">
            <FloatLabel variant="in" class="w-full">
              <Textarea
                id="description"
                v-model="description"
                v-bind="descriptionAttrs"
                rows="4"
                class="w-full"
                :class="{ 'p-invalid': errors.description }"
                autoResize
              />
              <label for="description">Description *</label>
            </FloatLabel>
          </JnsField>

          <JnsField :errorMessage="errors.date">
            <FloatLabel variant="in" class="w-full">
              <Calendar
                id="date"
                v-model="date"
                v-bind="dateAttrs"
                showTime
                hourFormat="24"
                dateFormat="dd/mm/yy"
                class="w-full"
                :class="{ 'p-invalid': errors.date }"
              />
              <label for="date">Date et heure *</label>
            </FloatLabel>
          </JnsField>
        </div>

        <Divider />

        <!-- Association (pour admin et events manager) -->
        <div v-if="availableAssociations.length > 0">
          <h3 class="text-lg font-semibold mb-4">Association</h3>
          <JnsField :errorMessage="errors.associationId">
            <Dropdown
              v-model="selectedAssociationId"
              :options="availableAssociations"
              optionLabel="name"
              optionValue="id"
              placeholder="Choisir une association"
              class="w-full"
              :class="{ 'p-invalid': errors.associationId }"
            />
          </JnsField>
        </div>

        <!-- Type d'événement -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Type d'événement</h3>
          <JnsField :errorMessage="errors.typeEventId">
            <Dropdown
              v-model="typeEventId"
              v-bind="typeEventIdAttrs"
              :options="typeEvents"
              optionLabel="name"
              optionValue="id"
              placeholder="Sélectionnez le type d'événement"
              class="w-full"
              :class="{ 'p-invalid': errors.typeEventId }"
            />
          </JnsField>
        </div>

        <Divider />

        <!-- Type d'accès -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Visibilité</h3>
          <div class="flex flex-col gap-3">
            <div class="flex items-center">
              <RadioButton
                v-model="isPublic"
                v-bind="isPublicAttrs"
                inputId="public"
                :value="true"
              />
              <label for="public" class="ml-2">
                <strong>Événement public</strong> - Visible par tous
              </label>
            </div>
            <div class="flex items-center">
              <RadioButton
                v-model="isPublic"
                v-bind="isPublicAttrs"
                inputId="private"
                :value="false"
              />
              <label for="private" class="ml-2">
                <strong>Événement privé</strong> - Visible seulement par les membres de l'association
              </label>
            </div>
          </div>
        </div>

        <Divider />

        <!-- Localisation -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Localisation</h3>
          <JnsField>
            <GoogleAutoCompleteComponent
              :model-value="localisation"
              input-id="address"
              input-class="p-inputtext p-component w-full"
              placeholder="Entrez l'adresse de l'événement (optionnel)"
              @update:modelValue="handleLocalisationChange"
            />
          </JnsField>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            :label="isUpdate ? 'Modifier l\'événement' : 'Créer l\'événement'"
            severity="primary"
            class="bg-primary text-white"
            :loading="isSubmitting"
            :icon="isUpdate ? 'pi pi-check' : 'pi pi-plus'"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<style scoped>
.upload-event-image :deep(.img-container) {
  width: 23rem;
  height:auto;
  aspect-ratio: 16/9;
}

@media screen and (max-width: 768px) {
  .upload-event-image :deep(.img-container) {
    width: 100%;
  }
}
</style> 