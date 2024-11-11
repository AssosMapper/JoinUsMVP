<script setup lang="ts">
import { useUserStore } from "@/store";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Sidebar from "primevue/sidebar";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import JnsImage from "./ui/JnsImage.vue";

const userStore = useUserStore();
const router = useRouter();
const mobileSidebarVisible = ref(false);

const first_name = computed(() => userStore.fullName);
const isAuthenticated = computed(() => userStore.isAuthenticated);
const isAdmin = computed(() => userStore.isAdmin);
const isAssociationManager = computed(() => userStore.isAssociationManager);
const isEventsManager = computed(() => userStore.isEventsManager);

const logout = () => {
  userStore.logout();
  router.push("/login");
};

const menuItems = [
  {
    label: "Accueil",
    icon: "pi pi-home",
    route: "/",
  },
  {
    label: "Événements",
    icon: "pi pi-calendar",
    route: "/displayEvents",
  },
  {
    label: "Associations",
    icon: "pi pi-users",
    route: "/displayAssociations",
  },
  {
    label: "Mes Associations",
    icon: "pi pi-heart",
    route: "/my-associations",
    auth: true,
  },
  {
    label: "Administration",
    icon: "pi pi-cog",
    route: "/adminInterface",
    admin: true,
  },
  {
    label: "Gestion des Associations",
    icon: "pi pi-users",
    route: "/associationManagerInterface",
    manager: true,
  },
  {
    label: "Gestion des Événements",
    icon: "pi pi-calendar-plus",
    route: "/eventsManagerInterface",
    eventsManager: true,
  },
];

const isActiveRoute = (route: string) =>
  router.currentRoute.value.path === route;
</script>

<template>
  <!-- Burger menu mobile -->
  <Button
    icon="pi pi-bars"
    @click="mobileSidebarVisible = true"
    class="lg:hidden fixed top-4 left-4 z-50 p-button-rounded !bg-white shadow-md"
    aria-label="Menu"
  >
    <i class="pi pi-bars text-primary text-xl"></i>
  </Button>

  <!-- Desktop Sidebar -->
  <div class="hidden lg:flex flex-col h-screen w-64 bg-white shadow-lg">
    <div class="p-4 border-b">
      <div class="flex items-center gap-3">
        <span class="font-bold text-xl text-primary">Join Us</span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-4">
      <div class="flex flex-col gap-1">
        <template v-for="item in menuItems" :key="item.label">
          <Button
            v-if="
              (!item.auth || isAuthenticated) &&
              (!item.admin || isAdmin) &&
              (!item.manager || isAssociationManager) &&
              (!item.eventsManager || isEventsManager)
            "
            :label="item.label"
            :icon="item.icon"
            :class="[
              'p-button-text w-full justify-start px-4 py-3 text-gray-700 hover:text-gray-900',
              isActiveRoute(item.route) ? 'bg-primary/10 text-primary' : '',
              'hover:bg-gray-50',
            ]"
            @click="router.push(item.route)"
          >
            <template #icon>
              <i :class="[item.icon, 'text-primary mr-2']"></i>
            </template>
          </Button>
        </template>
      </div>
    </div>

    <div class="border-t p-4">
      <div v-if="isAuthenticated" class="flex flex-col gap-3">
        <button
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 w-full"
          @click="router.push('/profile')"
        >
          <Avatar
            :label="first_name?.charAt(0).toUpperCase()"
            shape="circle"
            class="bg-primary"
          />
          <div class="flex flex-col text-left">
            <span class="font-semibold text-gray-900">{{ first_name }}</span>
            <span class="text-sm text-primary hover:underline"
              >Voir mon profil →</span
            >
          </div>
        </button>
        <Button
          icon="pi pi-power-off"
          label="Déconnexion"
          class="p-button-danger p-button-text w-full justify-start"
          @click="logout"
        />
      </div>
      <div v-else class="flex flex-col gap-2">
        <Button
          label="Connexion"
          icon="pi pi-sign-in"
          class="w-full"
          @click="router.push('/login')"
        />
        <Button
          label="S'inscrire"
          icon="pi pi-user-plus"
          class="w-full p-button-outlined"
          @click="router.push('/register')"
        />
      </div>
    </div>
  </div>

  <!-- Mobile Sidebar -->
  <Sidebar
    v-model:visible="mobileSidebarVisible"
    class="w-full sm:w-80"
    position="left"
  >
    <template #header>
      <div class="flex items-center gap-3 p-4">
        <JnsImage src="/logo.png" class="h-10" :name="userStore.fullName" />
        <span class="font-bold text-xl text-primary">Votre App</span>
      </div>
    </template>

    <div class="flex flex-col gap-1">
      <template v-for="item in menuItems" :key="item.label">
        <Button
          v-if="
            (!item.auth || isAuthenticated) &&
            (!item.admin || isAdmin) &&
            (!item.manager || isAssociationManager) &&
            (!item.eventsManager || isEventsManager)
          "
          :label="item.label"
          :icon="item.icon"
          :class="[
            'p-button-text w-full justify-start px-4 py-3',
            isActiveRoute(item.route) ? 'bg-primary/10 text-primary' : '',
          ]"
          @click="
            router.push(item.route);
            mobileSidebarVisible = false;
          "
        />
      </template>
    </div>

    <template #footer>
      <div class="p-4 border-t">
        <div v-if="isAuthenticated" class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <Avatar
              :label="first_name?.charAt(0).toUpperCase()"
              shape="circle"
              class="bg-primary"
            />
            <div class="flex flex-col">
              <span class="font-semibold">{{ first_name }}</span>
              <span class="text-sm text-gray-500">View Profile</span>
            </div>
          </div>
          <Button
            icon="pi pi-power-off"
            label="Logout"
            class="p-button-danger p-button-text w-full justify-start"
            @click="logout"
          />
        </div>
        <div v-else class="flex flex-col gap-2">
          <Button
            label="Login"
            icon="pi pi-sign-in"
            class="w-full"
            @click="router.push('/login')"
          />
          <Button
            label="Register"
            icon="pi pi-user-plus"
            class="w-full p-button-outlined"
            @click="router.push('/register')"
          />
        </div>
      </div>
      <Button
        icon="pi pi-times"
        class="p-button-rounded p-button-text fixed bottom-4 right-4 shadow-lg bg-white"
        @click="mobileSidebarVisible = false"
      />
    </template>
  </Sidebar>
</template>

<style scoped>
:deep(.p-sidebar) {
  @apply h-full;
}

:deep(.p-sidebar-mask) {
  @apply backdrop-blur-sm;
}

:deep(.p-sidebar-header),
:deep(.p-sidebar-content),
:deep(.p-sidebar-footer) {
  @apply p-0;
}
</style>
