<script setup lang="ts">
import "reflect-metadata";
import JnsField from "@/components/ui/JnsField.vue";
import UploadImage from "@/components/ui/UploadImage.vue";
import GoogleAutoCompleteComponent from "@/components/GoogleAutoCompleteComponent.vue";
import associationService from "@/services/associationService";
import typeAssociationService from "@/services/typeAssociationService";
import { useNotificationStore } from "@/store/notificationStore";
import { useUserStore } from "@/store/userStore";
import {
  UpdateAssociationDto,
  PublicAssociationDto,
} from "@shared/dto/associations.dto";
import { SaveLocalisationDto } from "@shared/dto/localisation.dto";
import { PublicMediaDto } from "@shared/dto/media.dto";
import { TypeAssociationsDto } from "@shared/dto/type-associations.dto";
import { updateAssociationSchema } from "@shared/validations/associations.validation";
import Button from "primevue/button";
import Card from "primevue/card";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import RadioButton from "primevue/radiobutton";
import Textarea from "primevue/textarea";
import { useForm } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { plainToInstance } from "class-transformer";

// Props et emits
interface Props {
  associationId?: string;
}

interface Emits {
  (e: 'association-updated', association: PublicAssociationDto): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const isAdmin = userStore.isAdmin;

// État du formulaire
const isSubmitting = ref(false);
const isLoading = ref(true);
const isLoadingDetails = ref(false);
const selectedAssociationId = ref<string | null>(null);
const availableAssociations = ref<PublicAssociationDto[]>([]);
const currentAssociation = ref<PublicAssociationDto | null>(null);
const associationImage = ref<PublicMediaDto | null>(null);
const selectedImageFile = ref<File | null>(null);
const typeAssociations = ref<TypeAssociationsDto[]>([]);

// État séparé pour la localisation
const localisation = ref<SaveLocalisationDto>({
  street_number: "",
  street_name: "",
  zip: "",
  city: "",
  country: "France",
});

// Configuration VeeValidate
const { handleSubmit, errors, defineField, values, resetForm } =
  useForm<UpdateAssociationDto>({
    validationSchema: updateAssociationSchema,
    initialValues: {
      name: "",
      description: "",
      isPublic: true,
      applicationQuestion: "",
      typeIds: [],
    },
  });

const [name, nameAttrs] = defineField("name");
const [description, descriptionAttrs] = defineField("description");
const [isPublic, isPublicAttrs] = defineField("isPublic");
const [applicationQuestion, applicationQuestionAttrs] = defineField(
  "applicationQuestion"
);
const [typeIds, typeIdsAttrs] = defineField("typeIds");

// Computed pour afficher conditionnellement la question d'application
const showApplicationQuestion = computed(() => !values.isPublic);

// Computed pour déterminer si on est en mode "association spécifique"
const isSpecificAssociation = computed(() => !!props.associationId);

// Charger les associations disponibles
const loadAvailableAssociations = async () => {
  try {
    availableAssociations.value = await associationService.getMyAssociations();
  } catch (error: any) {
    notificationStore.showNotification(
      "Erreur lors du chargement des associations",
      "error"
    );
  }
};

// Chargement des types d'associations
const loadTypeAssociations = async () => {
  try {
    typeAssociations.value =
      await typeAssociationService.getAllTypeAssociations();
  } catch (error: any) {
    notificationStore.showNotification(
      "Erreur lors du chargement des types d'associations",
      "error"
    );
  }
};

// Charger les données d'une association spécifique
const loadAssociationData = async (associationId: string) => {
  try {
    isLoadingDetails.value = true;

    // Récupérer les détails de l'association
    const association = await associationService.getAssociationById(
      associationId
    );
    currentAssociation.value = association;

    resetForm({
      values: {
        name: association.name || "",
        description: association.description || "",
        isPublic: association.isPublic ?? true,
        applicationQuestion: association.applicationQuestion || "",
        typeIds: association.types.map((type) => type.id) || [],
      },
    });

    // Préparer la localisation si elle existe
    if (association.localisation) {
      localisation.value = plainToInstance(
        SaveLocalisationDto,
        association.localisation,
        {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }
      );
    } else {
      localisation.value = {
        street_number: "",
        street_name: "",
        zip: "",
        city: "",
        country: "France",
      };
    }

    // Préparer l'image si elle existe
    if (association.image) {
      associationImage.value = plainToInstance(
        PublicMediaDto,
        association.image,
        {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }
      );
    } else {
      associationImage.value = null;
    }

    // Réinitialiser le fichier image sélectionné
    selectedImageFile.value = null;
  } catch (error: any) {
    notificationStore.showNotification(
      "Erreur lors du chargement des détails de l'association",
      "error"
    );
  } finally {
    isLoadingDetails.value = false;
  }
};

// Soumission du formulaire
const onSubmit = handleSubmit(async (formValues: UpdateAssociationDto) => {
  if (!selectedAssociationId.value) return;

  isSubmitting.value = true;
  try {
    const updatedAssociation = await associationService.updateAssociation(
      selectedAssociationId.value,
      formValues,
      localisation.value.street_name ? localisation.value : undefined,
      selectedImageFile.value || undefined
    );

    notificationStore.showNotification(
      "Association mise à jour avec succès",
      "success"
    );

    if (isSpecificAssociation.value) {
      // Mode association spécifique - émettre l'événement
      emit('association-updated', updatedAssociation);
    } else {
      // Mode sélection - rediriger
      router.push(`/associations/${selectedAssociationId.value}`);
    }
  } catch (error: any) {
    notificationStore.showNotification(
      error.message || "Erreur lors de la mise à jour de l'association",
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
  associationImage.value = null;
};

// Gestion de la localisation
const handleLocalisationChange = (
  newLocalisation: SaveLocalisationDto | null
) => {
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

// Gestion de l'annulation
const handleCancel = () => {
  router.back();
};

// Initialisation au montage
onMounted(async () => {
  try {
    if (isSpecificAssociation.value) {
      // Mode association spécifique - charger directement l'association
      await loadTypeAssociations();
      selectedAssociationId.value = props.associationId!;
      await loadAssociationData(selectedAssociationId.value);
    } else {
      // Mode sélection - charger les associations disponibles
      await Promise.all([loadAvailableAssociations(), loadTypeAssociations()]);

      // Sélectionner automatiquement la première association si disponible
      if (availableAssociations.value.length > 0) {
        selectedAssociationId.value = availableAssociations.value[0].id;
        await loadAssociationData(selectedAssociationId.value);
      }
    }
  } catch (error: any) {
    notificationStore.showNotification(
      "Erreur lors de l'initialisation",
      "error"
    );
  } finally {
    isLoading.value = false;
  }
});

// Watcher pour les changements de sélection d'association
watch(selectedAssociationId, async (newId) => {
  if (newId && newId !== currentAssociation.value?.id) {
    await loadAssociationData(newId);
  }
});
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <Card>
      <template #title>
        <div class="flex items-center gap-3">
          <i class="pi pi-edit text-2xl text-primary"></i>
          <span>Modifier une Association</span>
        </div>
      </template>

      <template #content>
        <div v-if="isLoading" class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
          <p class="mt-2">Chargement...</p>
        </div>

        <div
          v-else-if="!isSpecificAssociation && availableAssociations.length === 0"
          class="text-center py-8"
        >
          <i class="pi pi-info-circle text-2xl text-gray-400"></i>
          <p class="mt-2 text-gray-500">
            Aucune association disponible pour modification
          </p>
        </div>

        <div v-else>
          <!-- Sélection d'association pour les admins (uniquement en mode sélection) -->
          <div v-if="isAdmin && !isSpecificAssociation" class="mb-6">
            <h3 class="text-lg font-semibold mb-4">
              Sélectionner une association
            </h3>
            <Dropdown
              v-model="selectedAssociationId"
              :options="availableAssociations"
              option-label="name"
              option-value="id"
              placeholder="Choisir une association à modifier"
              class="w-full"
            />
          </div>
          
          <!-- Input hidden pour l'association spécifique -->
          <input 
            v-if="isSpecificAssociation" 
            type="hidden" 
            v-model="selectedAssociationId"
          />

          <!-- Formulaire d'association -->
          <div v-if="selectedAssociationId && currentAssociation">
            <div v-if="isLoadingDetails" class="text-center py-8">
              <i class="pi pi-spin pi-spinner text-2xl"></i>
              <p class="mt-2">Chargement des détails...</p>
            </div>

            <form v-else @submit.prevent="onSubmit" class="space-y-6">
              <!-- Image de l'association -->
              <div class="text-center">
                <h3 class="text-lg font-semibold mb-4">
                  Image de l'association
                </h3>
                <UploadImage
                  v-model="associationImage"
                  :preview="true"
                  @file-selected="handleImageFileSelected"
                  @remove="handleImageRemove"
                />
              </div>

              <Divider />

              <!-- Informations de base -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Informations générales</h3>

                <JnsField :errorMessage="errors.name">
                  <FloatLabel variant="in" class="w-full">
                    <InputText
                      id="name"
                      v-model="name"
                      v-bind="nameAttrs"
                      class="w-full"
                      :class="{ 'p-invalid': errors.name }"
                    />
                    <label for="name">Nom de l'association *</label>
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
              </div>

              <Divider />

              <!-- Types d'association -->
              <div>
                <h3 class="text-lg font-semibold mb-4">Types d'association</h3>
                <JnsField :errorMessage="errors.typeIds">
                  <MultiSelect
                    v-model="typeIds"
                    v-bind="typeIdsAttrs"
                    :options="typeAssociations"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Sélectionnez les types d'association"
                    class="w-full"
                    :class="{ 'p-invalid': errors.typeIds }"
                    display="chip"
                  />
                </JnsField>
              </div>

              <Divider />

              <!-- Type d'accès -->
              <div>
                <h3 class="text-lg font-semibold mb-4">Type d'accès</h3>
                <div class="flex flex-col gap-3">
                  <div class="flex items-center">
                    <RadioButton
                      v-model="isPublic"
                      v-bind="isPublicAttrs"
                      inputId="public"
                      :value="true"
                    />
                    <label for="public" class="ml-2">
                      <strong>Association publique</strong> - Tout le monde peut
                      rejoindre
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
                      <strong>Association sur candidature</strong> - Les membres
                      doivent faire une demande
                    </label>
                  </div>
                </div>

                <!-- Question d'application (conditionnelle) -->
                <div v-if="showApplicationQuestion" class="mt-4">
                  <JnsField :errorMessage="errors.applicationQuestion">
                    <FloatLabel variant="in" class="w-full">
                      <Textarea
                        id="applicationQuestion"
                        v-model="applicationQuestion"
                        v-bind="applicationQuestionAttrs"
                        rows="3"
                        class="w-full"
                        :class="{ 'p-invalid': errors.applicationQuestion }"
                        autoResize
                      />
                      <label for="applicationQuestion"
                        >Question pour les candidats *</label
                      >
                    </FloatLabel>
                  </JnsField>
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
                    placeholder="Entrez l'adresse de l'association (optionnel)"
                    @update:modelValue="handleLocalisationChange"
                  />
                </JnsField>
              </div>

              <!-- Boutons d'action -->
              <div class="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  label="Annuler"
                  severity="secondary"
                  @click="handleCancel"
                />
                <Button
                  type="submit"
                  label="Modifier l'association"
                  severity="primary"
                  class="bg-primary text-white"
                  :loading="isSubmitting"
                  icon="pi pi-check"
                />
              </div>
            </form>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>
