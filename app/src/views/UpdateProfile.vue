<script setup lang="ts">
import "reflect-metadata";
import GoogleAutoCompleteComponent from "@/components/GoogleAutoCompleteComponent.vue";
import JnsField from "@/components/ui/JnsField.vue";
import UploadImage from "@/components/ui/UploadImage.vue";
import usersService from "@/services/usersService";
import { useNotificationStore } from "@/store/notificationStore";
import { PublicMediaDto } from "@shared/dto/media.dto";
import { UpdateUserDto } from "@shared/dto/user.dto";
import { updateUserSchema } from "@shared/validations/user.validation";
import Button from "primevue/button";
import Card from "primevue/card";
import Divider from "primevue/divider";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import { useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import { plainToInstance } from "class-transformer";
import { SaveLocalisationDto } from "@shared/dto/localisation.dto";
import { useUserStore } from "@/store/userStore";

const notificationStore = useNotificationStore();

// État du formulaire
const isSubmitting = ref(false);
const isLoading = ref(true);
const profilePicture = ref<PublicMediaDto | null>(null);
const localisation = ref<SaveLocalisationDto | null>(null);
const userStore = useUserStore();

// Configuration VeeValidate
const { handleSubmit, resetForm, errors, defineField } = useForm<UpdateUserDto>(
  {
    validationSchema: updateUserSchema,
  }
);
const [firstName, firstNameAttrs] = defineField("first_name");
const [lastName, lastNameAttrs] = defineField("last_name");
const [email, emailAttrs] = defineField("email");
const [phone, phoneAttrs] = defineField("phone");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

const refreshProfilePicture = async () => {
  await loadDataForm();
};
const removeProfilePicture = async () => {
  try {
    await usersService.removeProfilePicture();
  } catch (error: any) {
    notificationStore.showNotification(
      "Erreur lors de la suppression de la photo de profil",
      "error"
    );
  }
};
const loadDataForm = async () => {
  await userStore.refetchUser();
  const userData = plainToInstance(UpdateUserDto, userStore.user, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });
  if (userStore.user.image) {
    profilePicture.value = plainToInstance(
      PublicMediaDto,
      userStore.user.image,
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }
    );
    userData.imageId = userStore.user.image.id;
  }
  if (userStore.user.localisation) {
    localisation.value = plainToInstance(
      SaveLocalisationDto,
      userStore.user.localisation,
      {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }
    );
  }
  resetForm({
    values: { ...userData, password: undefined, confirmPassword: undefined },
  });
};
onMounted(async () => {
  try {
    await loadDataForm();
  } catch (error: any) {
    notificationStore.showNotification(
      error.message || "Erreur lors du chargement du profil",
      "error"
    );
  } finally {
    isLoading.value = false;
  }
});

// Soumission du formulaire
const onSubmit = handleSubmit(async (formValues: UpdateUserDto) => {
  isSubmitting.value = true;
  try {
    await usersService.updateProfile(
      formValues,
      localisation.value || undefined
    );
    notificationStore.showNotification(
      "Profil mis à jour avec succès",
      "success"
    );
    await loadDataForm();
  } catch (error: any) {
    notificationStore.showNotification(
      error.message || "Erreur lors de la mise à jour",
      "error"
    );
  } finally {
    isSubmitting.value = false;
  }
});

// Gestion des événements
const handleImageUpload = async (file: File) => {
  await usersService.changeProfilePicture(file);
  notificationStore.showNotification(
    "Photo de profil mise à jour avec succès",
    "success"
  );
};

const handleLocalisationChange = (newLocalisation: any) => {
  const localisationId = localisation.value?.id;
  if (newLocalisation) {
    localisation.value = plainToInstance(SaveLocalisationDto, newLocalisation, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    localisation.value.id = localisationId;
  } else localisation.value = null;
};
</script>

<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <Card>
      <template #title>
        <div class="flex items-center gap-3">
          <i class="pi pi-user text-2xl text-primary"></i>
          <span>Mon Profil</span>
        </div>
      </template>

      <template #content>
        <div v-if="isLoading" class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
          <p class="mt-2">Chargement du profil...</p>
        </div>

        <form v-else @submit="onSubmit" class="space-y-6">
          <!-- Photo de profil -->
          <div class="text-center">
            <h3 class="text-lg font-semibold mb-4">Photo de profil</h3>
            <UploadImage
              v-model="profilePicture"
              :preview="true"
              @update:modelValue="refreshProfilePicture"
              @remove="removeProfilePicture"
              :handle-upload="handleImageUpload"
            />
          </div>

          <Divider />

          <!-- Informations personnelles -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JnsField :errorMessage="errors.first_name">
              <FloatLabel variant="in" class="w-full">
                <InputText
                  id="first_name"
                  v-model="firstName"
                  v-bind="firstNameAttrs"
                  class="w-full"
                  :class="{ 'p-invalid': errors.first_name }"
                />
                <label for="first_name">Prénom *</label>
              </FloatLabel>
            </JnsField>

            <JnsField :errorMessage="errors.last_name">
              <FloatLabel variant="in" class="w-full">
                <InputText
                  id="last_name"
                  v-model="lastName"
                  v-bind="lastNameAttrs"
                  class="w-full"
                  :class="{ 'p-invalid': errors.last_name }"
                />
                <label for="last_name">Nom *</label>
              </FloatLabel>
            </JnsField>

            <JnsField :errorMessage="errors.email">
              <FloatLabel variant="in" class="w-full">
                <InputText
                  id="email"
                  v-model="email"
                  v-bind="emailAttrs"
                  type="email"
                  class="w-full"
                  :class="{ 'p-invalid': errors.email }"
                />
                <label for="email">Email *</label>
              </FloatLabel>
            </JnsField>

            <JnsField :errorMessage="errors.phone">
              <FloatLabel variant="in" class="w-full">
                <InputText
                  id="phone"
                  v-model="phone"
                  v-bind="phoneAttrs"
                  type="tel"
                  class="w-full"
                  :class="{ 'p-invalid': errors.phone }"
                />
                <label for="phone">Téléphone</label>
              </FloatLabel>
            </JnsField>
          </div>

          <Divider />

          <!-- Localisation -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Localisation</h3>
            <GoogleAutoCompleteComponent
              :model-value="localisation"
              input-id="address"
              input-class="p-inputtext p-component w-full"
              placeholder="Entrez votre adresse"
              @update:modelValue="handleLocalisationChange"
            />
          </div>

          <Divider />

          <!-- Changer le mot de passe -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Changer le mot de passe</h3>
            <p class="text-sm text-gray-600 mb-4">
              Laissez vide si vous ne souhaitez pas changer votre mot de passe
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <JnsField :errorMessage="errors.password">
                <FloatLabel variant="in" class="w-full">
                  <InputText
                    id="password"
                    v-model="password"
                    v-bind="passwordAttrs"
                    type="password"
                    class="w-full"
                    :class="{ 'p-invalid': errors.password }"
                  />
                  <label for="password">Nouveau mot de passe</label>
                </FloatLabel>
              </JnsField>

              <JnsField :errorMessage="errors.confirmPassword">
                <FloatLabel variant="in" class="w-full">
                  <InputText
                    id="confirmPassword"
                    v-model="confirmPassword"
                    v-bind="confirmPasswordAttrs"
                    type="password"
                    class="w-full"
                    :class="{ 'p-invalid': errors.confirmPassword }"
                  />
                  <label for="confirmPassword">Confirmer le mot de passe</label>
                </FloatLabel>
              </JnsField>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end gap-3 pt-4">
            <Button
              type="submit"
              label="Sauvegarder"
              :loading="isSubmitting"
              icon="pi pi-save"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
