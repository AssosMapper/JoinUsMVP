<script setup lang="ts">
import JnsField from "@/components/ui/JnsField.vue";
import usersService from "@/services/usersService";
import { useNotificationStore } from "@/store/notificationStore";
import { ResetPasswordDto } from "@shared/dto/auth.dto";
import { resetPasswordSchema } from "@shared/validations/auth.validation";
import Button from "primevue/button";
import Card from "primevue/card";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import { useForm } from "vee-validate";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const notificationStore = useNotificationStore();
const router = useRouter();
const route = useRoute();

// État du formulaire
const isSubmitting = ref(false);
const isPasswordReset = ref(false);

// Configuration VeeValidate
const { handleSubmit, errors, defineField, setFieldValue } =
  useForm<ResetPasswordDto>({
    validationSchema: resetPasswordSchema,
  });

const [email, emailAttrs] = defineField("email");
const [token, tokenAttrs] = defineField("token");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");

// Initialisation des valeurs depuis les paramètres de l'URL
onMounted(() => {
  const emailParam = route.query.email as string;
  const tokenParam = route.query.token as string;

  if (emailParam) {
    setFieldValue("email", emailParam);
  }
  if (tokenParam) {
    setFieldValue("token", tokenParam);
  }
});

// Soumission du formulaire
const onSubmit = handleSubmit(async (formValues: ResetPasswordDto) => {
  isSubmitting.value = true;
  try {
    const response = await usersService.resetPassword(formValues);
    isPasswordReset.value = true;
    notificationStore.showNotification(
      response.message || "Mot de passe réinitialisé avec succès",
      "success"
    );
  } catch (error: any) {
    notificationStore.showNotification(
      error.message || "Erreur lors de la réinitialisation du mot de passe",
      "error"
    );
  } finally {
    isSubmitting.value = false;
  }
});

const goToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <Card>
        <template v-if="!isPasswordReset" #title>
          <div class="text-center">
            <i class="pi pi-key text-4xl text-primary mb-4"></i>
            <h2 class="text-2xl font-bold text-gray-900">
              Réinitialiser le mot de passe
            </h2>
          </div>
        </template>

        <template #content>
          <div v-if="!isPasswordReset">
            <form @submit="onSubmit" class="space-y-6">
              <input
                type="hidden"
                id="email"
                v-model="email"
                v-bind="emailAttrs"
              />
              <input
                type="hidden"
                id="token"
                v-model="token"
                v-bind="tokenAttrs"
              />

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

              <div class="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <p class="font-medium mb-1">Le mot de passe doit contenir :</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>Au moins 8 caractères</li>
                  <li>Une lettre majuscule</li>
                  <li>Une lettre minuscule</li>
                  <li>Un chiffre</li>
                  <li>Un caractère spécial (@$!%*?&)</li>
                </ul>
              </div>

              <div class="flex flex-col gap-3">
                <Button
                  type="submit"
                  label="Réinitialiser le mot de passe"
                  :loading="isSubmitting"
                  severity="primary"
                  icon="pi pi-save"
                  class="w-full"
                />
              </div>
            </form>
          </div>

          <div v-else class="text-center">
            <i class="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Mot de passe réinitialisé !
            </h3>
            <p class="text-sm text-gray-600 mb-6">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez
              maintenant vous connecter avec votre nouveau mot de passe.
            </p>

            <Button
              type="button"
              label="Se connecter"
              icon="pi pi-sign-in"
              class="w-full bg-primary text-white"
              @click="goToLogin"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
