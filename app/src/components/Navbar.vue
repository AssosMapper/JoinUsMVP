<script setup lang="ts">
import { useUserStore } from "@/store";
import Button from "primevue/button";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import NotificationButton from "./Notification/NotificationButton.vue";
import { getMediaUrl } from "@/utils/media.util";
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
    auth: true,
  },
  {
    label: "Associations",
    icon: "pi pi-users",
    route: "/displayAssociations",
    auth: true,
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

// Ajout de la détection du mode desktop
const isDesktop = computed(() => window.innerWidth >= 1024);
</script>

<template>
  <!-- Bottom Navigation Bar (Mobile Only) -->
  <div
    class="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[90]"
  >
    <div class="flex justify-around items-center h-full px-2">
      <Button
        icon="pi pi-bars"
        @click="mobileSidebarVisible = true"
        class="p-button-text !bg-transparent"
        aria-label="Menu"
      >
        <i class="pi pi-bars text-primary text-xl"></i>
      </Button>

      <Button
        icon="pi pi-home"
        @click="router.push('/')"
        :class="[
          'p-button-text !bg-transparent',
          isActiveRoute('/') ? 'text-primary' : 'text-gray-500',
        ]"
      >
        <i class="pi pi-home text-xl"></i>
      </Button>

      <Button
        v-if="isAuthenticated"
        icon="pi pi-user"
        @click="router.push('/updateProfile')"
        :class="[
          'p-button-text !bg-transparent',
          isActiveRoute('/updateProfile') ? 'text-primary' : 'text-gray-500',
        ]"
      >
        <i class="pi pi-user text-xl"></i>
      </Button>

      <Button
        v-else
        icon="pi pi-sign-in"
        @click="router.push('/login')"
        class="p-button-text !bg-transparent"
      >
        <i class="pi pi-sign-in text-xl text-gray-500"></i>
      </Button>
    </div>
  </div>

  <!-- Unified Sidebar -->
  <div
    :class="[
      'bg-white shadow-lg z-[91] transition-transform duration-300 h-screen',
      'lg:w-64 w-[80vw]',
      'lg:relative fixed',
      'lg:translate-x-0',
      mobileSidebarVisible ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- En-tête du sidebar -->
    <div class="p-4 border-b flex items-center justify-between">
      <span class="font-bold text-xl text-primary">Join Us</span>
      <div class="flex items-center gap-2">
        <!-- Bouton notification toujours visible si authentifié -->
        <NotificationButton
          class="hidden md:flex z-[92]"
          v-if="isAuthenticated"
        />
        <!-- Bouton fermeture uniquement sur mobile -->
        <Button
          v-if="!isDesktop"
          icon="pi pi-times"
          class="p-button-text p-button-rounded"
          @click="mobileSidebarVisible = false"
        />
      </div>
    </div>

    <!-- Menu items -->
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
            @click="
              () => {
                router.push(item.route);
                if (!isDesktop) mobileSidebarVisible = false;
              }
            "
          >
            <template #icon>
              <i :class="[item.icon, 'text-primary mr-2']"></i>
            </template>
          </Button>
        </template>
      </div>
    </div>

    <!-- Footer du sidebar -->
    <div class="border-t p-4">
      <div v-if="isAuthenticated" class="flex flex-col gap-3">
        <button
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 w-full"
          @click="router.push('/updateProfile')"
        >
          <JnsImage
            :src="getMediaUrl(userStore.user.image?.filepath)"
            class="bg-primary aspect-square scale-90"
            size="md"
            :name="userStore.user.first_name"
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
          label="Se connecter"
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

  <!-- Overlay pour mobile avec backdrop filter -->
  <div
    v-if="!isDesktop && mobileSidebarVisible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    @click="mobileSidebarVisible = false"
  />
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

/* Ajout de l'animation pour l'overlay */
.backdrop-blur-sm {
  @apply transition-opacity duration-300;
}
</style>
