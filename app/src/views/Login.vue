<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useNotificationStore} from '@/store/notificationStore.ts';
import {useUserStore} from "@/store";
import {useForm} from 'vee-validate';
import {credentialSchema} from "@/types/security.types.ts";

const router = useRouter();
const notificationStore = useNotificationStore();


const {errors, defineField} = useForm<{email: string; password: string}>({
  validationSchema: credentialSchema,
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const handleLogin = async () => {
  const credentials = {
    email: email.value,
    password: password.value,
  };
  const userStore = useUserStore()
  try {
    await userStore.login(credentials);
    await router.push('/');
    notificationStore.showNotification("Connexion réussie !", "success");
  } catch (error) {
    console.error(error);
    notificationStore.showNotification("Email ou mot de passe incorrect. Veuillez réessayer", "error");
  }
};
</script>

<template>
  <div>
      <!-- Header -->
    <div class="title-container 
                shadow-[0_4px_6px_-2px_rgba(0,0,0,0.1)]
                relative z-10 flex justify-center items-center">
      <div class="px-10">
        <h1 class="text-3xl font-bold text-primary italic">
          Connexion
        </h1>
      </div>
    </div>

      <!-- Formulaire -->
      <div class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-xl border-primary shadow-[2px_2px_8px_-1px_rgba(0,0,0,0.1),4px_4px_12px_-2px_rgba(0,0,0,0.15)] p-6 max-w-2xl mx-auto">
          <form @submit.prevent="handleLogin">
            <div class="space-y-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2 text-left" for="email">Email</label>
                <input
                  type="text"
                  placeholder="Email"
                  v-model="email"
                  v-bind="emailAttrs"
                  required
                  class="w-full px-4 py-2  bg-primary-hover border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
              </div>
              <div class="mt-4">
                <label class="block text-gray-700 font-medium mb-2 text-left">Mot de passe</label>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  v-model="password"
                  v-bind="passwordAttrs"
                  required
                  class="w-full px-4 py-2 bg-primary-hover border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
              </div>
              <div class="flex flex-col space-y-4">
                <button
                  type="submit"
                  class="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  :disabled="useUserStore().loader"
                >
                  {{ useUserStore().loader ? 'Connexion...' : 'Se connecter' }}
                </button>

                <!-- Liens supplémentaires -->
                <div class="flex flex-col items-center space-y-2 pt-4 border-t">
                  <router-link 
                    to="/forgotpassword" 
                    class="text-primary hover:text-primary-dark transition-colors"
                  >
                    Mot de passe oublié ?
                  </router-link>
                  
                  <div class="text-gray-600">
                    Pas encore de compte ?
                    <router-link to="/register">
                      <button 
                        class="p-button p-component bg-primary text-white" 
                        type="button" 
                        data-pc-name="button"
                        data-pc-section="root"
                      >
                        S'inscrire
                      </button>
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
</style>