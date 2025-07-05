<script setup lang="ts">
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/store/notificationStore.ts";
import { useUserStore } from "@/store";
import { useForm } from "vee-validate";
import { registerSchema, IRegister } from "@/types/security.types.ts";

const router = useRouter();
const notificationStore = useNotificationStore();

const { errors, defineField } = useForm<IRegister>({
  validationSchema: registerSchema,
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword");
const [firstName, firstNameAttrs] = defineField("firstName");
const [lastName, lastNameAttrs] = defineField("lastName");

const handleRegister = async () => {
  const credentials: IRegister = {
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    firstName: firstName.value,
    lastName: lastName.value,
  };
  const userStore = useUserStore();
  try {
    await userStore.register(credentials);
    await router.push("/");
    notificationStore.showNotification("Inscription réussie !", "success");
  } catch (error) {
    console.error(error);
    notificationStore.showNotification(
      "Une erreur est survenue lors de l'inscription",
      "error"
    );
  }
};
</script>

<template>
  <div>
    <!-- Header -->
    <div
      class="title-container shadow-[0_4px_6px_-2px_rgba(0,0,0,0.1)] relative z-10 flex justify-center items-center"
    >
      <div class="px-10">
        <h1 class="text-3xl font-bold text-primary italic">Inscription</h1>
      </div>
    </div>

    <!-- Formulaire -->
    <div class="container mx-auto px-4 py-8">
      <div
        class="bg-white rounded-xl border-primary shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)] p-6 max-w-2xl mx-auto"
      >
        <form @submit.prevent="handleRegister">
          <div class="space-y-4">
            <!-- Prénom et Nom sur la même ligne -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-gray-700 font-medium mb-2 text-left"
                  for="firstName"
                  >Prénom</label
                >
                <input
                  type="text"
                  placeholder="Prénom"
                  v-model="firstName"
                  v-bind="firstNameAttrs"
                  required
                  class="w-full px-4 py-2 bg-primary-hover border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span v-if="errors.firstName" class="text-red-500 text-sm">{{
                  errors.firstName
                }}</span>
              </div>

              <div>
                <label
                  class="block text-gray-700 font-medium mb-2 text-left"
                  for="lastName"
                  >Nom</label
                >
                <input
                  type="text"
                  placeholder="Nom"
                  v-model="lastName"
                  v-bind="lastNameAttrs"
                  required
                  class="w-full px-4 py-2 bg-primary-hover border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span v-if="errors.lastName" class="text-red-500 text-sm">{{
                  errors.lastName
                }}</span>
              </div>
            </div>

            <div>
              <label
                class="block text-gray-700 font-medium mb-2 text-left"
                for="email"
                >Email</label
              >
              <input
                type="text"
                placeholder="Email"
                v-model="email"
                v-bind="emailAttrs"
                required
                class="w-full px-4 py-2 bg-primary-hover border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span v-if="errors.email" class="text-red-500 text-sm">{{
                errors.email
              }}</span>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2 text-left"
                >Mot de passe</label
              >
              <input
                type="password"
                placeholder="Mot de passe"
                v-model="password"
                v-bind="passwordAttrs"
                required
                class="w-full px-4 py-2 bg-primary-hover border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span v-if="errors.password" class="text-red-500 text-sm">{{
                errors.password
              }}</span>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2 text-left"
                >Confirmer le mot de passe</label
              >
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                v-model="confirmPassword"
                v-bind="confirmPasswordAttrs"
                required
                class="w-full px-4 py-2 bg-primary-hover border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span
                v-if="errors.confirmPassword"
                class="text-red-500 text-sm"
                >{{ errors.confirmPassword }}</span
              >
            </div>

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

            <div class="flex flex-col space-y-4">
              <button
                type="submit"
                class="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                :disabled="useUserStore().loader"
              >
                {{ useUserStore().loader ? "Inscription..." : "S'inscrire" }}
              </button>

              <!-- Lien retour connexion -->
              <div class="flex flex-col items-center space-y-2 pt-4 border-t">
                <div class="text-gray-600">
                  Déjà un compte ?
                  <router-link to="/login">
                    <Button
                      class="text-primary"
                      type="button"
                      severity="primary"
                      variant="outlined"
                      data-pc-name="button"
                      data-pc-section="root"
                    >
                      Se connecter
                    </Button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-container {
  height: 4.5rem;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px var(--primary-hover) inset;
  -webkit-text-fill-color: inherit;
  transition: background-color 5000s ease-in-out 0s;
}

.container {
  height: 900px;
}
</style>
