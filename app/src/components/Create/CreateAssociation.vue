<script setup lang="ts">
import "reflect-metadata";
import JnsField from "@/components/ui/JnsField.vue";
import UploadImage from "@/components/ui/UploadImage.vue";
import GoogleAutoCompleteComponent from "@/components/GoogleAutoCompleteComponent.vue";
import associationService from "@/services/associationService";
import typeAssociationService from "@/services/typeAssociationService";
import { useNotificationStore } from "@/store/notificationStore";
import { CreateAssociationDto } from "@shared/dto/associations.dto";
import { CreateLocalisationDto } from "@shared/dto/localisation.dto";
import { PublicMediaDto } from "@shared/dto/media.dto";
import { TypeAssociationsDto } from "@shared/dto/type-associations.dto";
import { createAssociationSchema } from "@shared/validations/associations.validation";
import Button from "primevue/button";
import Card from "primevue/card";
import Divider from "primevue/divider";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import RadioButton from "primevue/radiobutton";
import Textarea from "primevue/textarea";
import { useForm } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { plainToInstance } from "class-transformer";

const notificationStore = useNotificationStore();
const router = useRouter();

// État du formulaire
const isSubmitting = ref(false);
const isLoading = ref(true);
const associationImage = ref<PublicMediaDto | null>(null);
const selectedImageFile = ref<File | null>(null);
const typeAssociations = ref<TypeAssociationsDto[]>([]);

// État séparé pour la localisation
const localisation = ref<CreateLocalisationDto>({
  street_number: "",
  street_name: "",
  zip: "",
  city: "",
  country: "France",
});

// Configuration VeeValidate
const { handleSubmit, errors, defineField, values } =
  useForm<CreateAssociationDto>({
    validationSchema: createAssociationSchema,
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
  } finally {
    isLoading.value = false;
  }
};

// Soumission du formulaire
const onSubmit = handleSubmit(async (formValues: CreateAssociationDto) => {
  isSubmitting.value = true;
  try {
    const createdAssociation = await associationService.createAssociation(
      formValues,
      localisation.value.street_name ? localisation.value : undefined,
      selectedImageFile.value || undefined
    );

    notificationStore.showNotification(
      "Association créée avec succès",
      "success"
    );

    // Rediriger vers la page de l'association créée
    router.push(`/associations/${createdAssociation.id}`);
  } catch (error: any) {
    notificationStore.showNotification(
      error.message || "Erreur lors de la création de l'association",
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
  newLocalisation: CreateLocalisationDto | null
) => {
  if (newLocalisation) {
    localisation.value = plainToInstance(
      CreateLocalisationDto,
      newLocalisation,
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
};

// Gestion de l'annulation
const handleCancel = () => {
  router.back();
};

onMounted(() => {
  loadTypeAssociations();
});
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <Card>
      <template #title>
        <div class="flex items-center gap-3">
          <i class="pi pi-users text-2xl text-primary"></i>
          <span>Créer une Association</span>
        </div>
      </template>

      <template #content>
        <div v-if="isLoading" class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
          <p class="mt-2">Chargement...</p>
        </div>

        <form v-else @submit.prevent="onSubmit" class="space-y-6">
          <!-- Image de l'association -->
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-4">Image de l'association</h3>
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
              label="Créer l'association"
              severity="primary"
              class="bg-primary text-white"
              :loading="isSubmitting"
              icon="pi pi-save"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
