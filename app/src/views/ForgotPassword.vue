<script setup lang="ts">
import JnsField from "@/components/ui/JnsField.vue";
import usersService from "@/services/usersService";
import { useNotificationStore } from "@/store/notificationStore";
import { ForgotPasswordDto } from "@shared/dto/auth.dto";
import { forgotPasswordSchema } from "@shared/validations/auth.validation";
import Button from "primevue/button";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";

const notificationStore = useNotificationStore();
const router = useRouter();

// État du formulaire
const isSubmitting = ref(false);
const isEmailSent = ref(false);

// Configuration VeeValidate
const { handleSubmit, errors, defineField } = useForm<ForgotPasswordDto>({
  validationSchema: forgotPasswordSchema,
});

const [email, emailAttrs] = defineField("email");

// Soumission du formulaire
const onSubmit = handleSubmit(async (formValues: ForgotPasswordDto) => {
  isSubmitting.value = true;
  try {
    const response = await usersService.forgotPassword(formValues);
    isEmailSent.value = true;
    notificationStore.showNotification(
      response.message || "Email envoyé avec succès",
      "success"
    );
  } catch (error: any) {
    notificationStore.showNotification(
      error.message || "Erreur lors de l'envoi de l'email",
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
        <template #title>
          <div class="text-center">
            <i class="pi pi-lock text-4xl text-primary mb-4"></i>
            <h2 class="text-2xl font-bold text-gray-900">
              Mot de passe oublié
            </h2>
          </div>
        </template>

        <template #content>
          <div v-if="!isEmailSent">
            <p class="text-sm text-gray-600 text-center mb-6">
              Entrez votre adresse email et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </p>

            <form @submit="onSubmit" class="space-y-6">
              <JnsField :errorMessage="errors.email">
                <InputText
                  id="email"
                  v-model="email"
                  v-bind="emailAttrs"
                  type="email"
                  class="w-full"
                  :class="{ 'p-invalid': errors.email }"
                  placeholder="votre@email.com"
                />
              </JnsField>

              <div class="flex flex-col gap-3">
                <Button
                  type="submit"
                  label="Envoyer le lien de réinitialisation"
                  :loading="isSubmitting"
                  icon="pi pi-send"
                  class="w-full bg-primary text-white"
                />

                <Button
                  type="button"
                  label="Retour à la connexion"
                  severity="secondary"
                  text
                  icon="pi pi-arrow-left"
                  class="w-full"
                  @click="goToLogin"
                />
              </div>
            </form>
          </div>

          <div v-else class="text-center">
            <i class="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Email envoyé !
            </h3>
            <p class="text-sm text-gray-600 mb-6">
              Si un compte existe avec cette adresse email, vous recevrez un
              lien pour réinitialiser votre mot de passe.
            </p>
            <p class="text-xs text-gray-500 mb-6">
              Vérifiez également votre dossier spam.
            </p>

            <Button
              type="button"
              label="Retour à la connexion"
              icon="pi pi-arrow-left"
              class="w-full"
              @click="goToLogin"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
